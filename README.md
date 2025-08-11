# Dramas.FM

A comprehensive radio drama streaming platform featuring curated channels, advanced search capabilities, and user-generated playlists with AI assistance.

## Features

- **Curated Channels**: Homepage with admin-curated channels streaming from Archive.org
- **Advanced Search**: Visual and dense elastic-like search of radio drama catalog
- **User Playlists**: AI and algorithmic assistance for playlist creation
- **Multi-level Users**: Anonymous cookie-based to power users with API access
- **Crowdsourcing**: Non-intrusive data collection for quality and tagging

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## User Levels

- **Level 0**: Pseudo-anonymous cookie-based users
- **Level 1**: Registered users with saved playlists
- **Power Users**: API access and tagging/categorization tools
- **Admins**: Site and user management

## Technology Stack

- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Database**: Cloudflare integration for radio drama catalog
- **Streaming**: Archive.org integration
- **Authentication**: Multi-level user system
