import Link from 'next/link';

async function fetchShow(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/shows/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function ShowPage({ params }: { params: { id: string } }) {
  const data = await fetchShow(params.id);
  if (!data?.success) {
    return <div className="min-h-screen text-white p-8">Not found</div>;
  }
  const { show, audioFiles } = data.data as { show: any, audioFiles: any[] };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Dramas.FM</Link>
      </header>
      <div className="max-w-4xl mx-auto bg-white/5 border border-purple-500/20 rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
        <p className="text-purple-300 mb-4">{show.identifier} • {show.year}</p>
        <p className="text-purple-200 mb-6">{show.description}</p>
        <h2 className="text-xl font-semibold mb-3">Audio Files</h2>
        <ul className="space-y-2">
          {audioFiles.map((a) => (
            <li key={a.id} className="bg-white/5 rounded p-3 flex justify-between items-center">
              <div>
                <div className="text-sm text-purple-300">{Math.round((a.duration || 0) / 60)}m</div>
                <div className="text-sm break-all"><a href={a.streaming_url || a.download_url || '#'} className="text-purple-400 hover:text-purple-200">{a.streaming_url || a.download_url}</a></div>
              </div>
              <div>
                <a href={a.download_url || a.streaming_url || '#'} className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700">Download</a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
