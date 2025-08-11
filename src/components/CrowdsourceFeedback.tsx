'use client';

import { useState, useEffect, useRef } from 'react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import FocusLock from 'react-focus-lock';
import { RadioShow, CrowdsourceData } from '@/lib/types';

interface CrowdsourceFeedbackProps {
  show: RadioShow;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<CrowdsourceData['data']>) => void;
}

export default function CrowdsourceFeedback({ show, isOpen, onClose, onSubmit }: CrowdsourceFeedbackProps) {
  const [qualityRating, setQualityRating] = useState(0);
  const [emotionTags, setEmotionTags] = useState<string[]>([]);
  const [ageAppropriate, setAgeAppropriate] = useState<boolean | null>(null);
  const [contentWarnings, setContentWarnings] = useState<string[]>([]);
  const [additionalTags, setAdditionalTags] = useState('');
  const [transcriptionCorrections, setTranscriptionCorrections] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
    }
  }, [isOpen]);

  const emotionOptions = [
    'suspenseful', 'funny', 'scary', 'romantic', 'exciting', 'sad', 'uplifting', 
    'mysterious', 'educational', 'dramatic', 'action-packed', 'thought-provoking'
  ];

  const contentWarningOptions = [
    'violence', 'mild language', 'adult themes', 'scary content', 'dated social attitudes',
    'smoking/drinking', 'loud noises', 'death/mortality themes'
  ];

  const handleEmotionToggle = (emotion: string) => {
    setEmotionTags(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleContentWarningToggle = (warning: string) => {
    setContentWarnings(prev => 
      prev.includes(warning) 
        ? prev.filter(w => w !== warning)
        : [...prev, warning]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const feedbackData = {
      qualityRating: qualityRating || undefined,
      emotionTags: emotionTags.length > 0 ? emotionTags : undefined,
      ageAppropriate: ageAppropriate !== null ? ageAppropriate : undefined,
      contentWarnings: contentWarnings.length > 0 ? contentWarnings : undefined,
      transcriptionCorrections: transcriptionCorrections.trim() || undefined,
      additionalTags: additionalTags.trim() ? additionalTags.split(',').map(tag => tag.trim()) : undefined
    };

    onSubmit(feedbackData);
    onClose();
    
    // Reset form
    setQualityRating(0);
    setEmotionTags([]);
    setAgeAppropriate(null);
    setContentWarnings([]);
    setAdditionalTags('');
    setTranscriptionCorrections('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <FocusLock returnFocus>
        <div
          role="dialog"
          aria-modal="true"
          ref={dialogRef}
          tabIndex={-1}
          className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
          aria-labelledby="modal-title"
          ref={dialogRef}
          tabIndex={-1}
          className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 id="modal-title" className="text-xl font-bold text-white">Help Improve Our Catalog</h3>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-purple-300 hover:text-white transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

          <div className="mb-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
            <h4 className="font-semibold text-purple-200 mb-1">{show.title}</h4>
            <p className="text-purple-300 text-sm">{show.series} • {show.year}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio Quality Rating */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-3">
                How would you rate the audio quality?
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setQualityRating(rating)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    {rating <= qualityRating ? (
                      <StarSolidIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarIcon className="h-8 w-8 text-purple-400" />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-purple-400 mt-1">
                1 = Poor quality, 5 = Excellent quality
              </p>
            </div>

            {/* Emotion Tags */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-3">
                How would you describe this show? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {emotionOptions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => handleEmotionToggle(emotion)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      emotionTags.includes(emotion)
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-900/30 text-purple-300 hover:bg-purple-800/50'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* Age Appropriateness */}
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-3">
                Is this content appropriate for all ages?
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setAgeAppropriate(true)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    ageAppropriate === true
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                  }`}
                >
                  Yes, family-friendly
                </button>
                <button
                  type="button"
                  onClick={() => setAgeAppropriate(false)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    ageAppropriate === false
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                  }`}
                >
                  No, mature content
                </button>
              </div>
            </div>

            {/* Content Warnings */}
            {ageAppropriate === false && (
              <div>
                <label className="block text-sm font-medium text-purple-300 mb-3">
                  What content warnings should we include?
                </label>
                <div className="flex flex-wrap gap-2">
                  {contentWarningOptions.map((warning) => (
                    <button
                      key={warning}
                      type="button"
                      onClick={() => handleContentWarningToggle(warning)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        contentWarnings.includes(warning)
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 text-purple-300 hover:bg-slate-600'
                      }`}
                    >
                      {warning}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Tags */}
            <div>
              <label htmlFor="additional-tags" className="block text-sm font-medium text-purple-300 mb-2">
                Additional tags (comma-separated)
              </label>
              <input
                id="additional-tags"
                type="text"
                value={additionalTags}
                onChange={(e) => setAdditionalTags(e.target.value)}
                placeholder="e.g., noir, comedy, historical, western"
                className="w-full bg-slate-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Transcription Corrections */}
            <div>
              <label htmlFor="transcription" className="block text-sm font-medium text-purple-300 mb-2">
                Transcription corrections or notes (optional)
              </label>
              <textarea
                id="transcription"
                value={transcriptionCorrections}
                onChange={(e) => setTranscriptionCorrections(e.target.value)}
                placeholder="Help us improve accuracy by noting any errors in show information..."
                rows={3}
                className="w-full bg-slate-800 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-purple-300 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          <p className="text-xs text-purple-400 mt-4 text-center">
            Your feedback helps improve the experience for everyone. Thank you for contributing!
          </p>
        </div>
      </div>
      </FocusLock>
    </div>
  );
}