# Tech Context

## Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components

### Backend/Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (v2 only)
- **Real-time**: Supabase subscriptions (v2 only)

### External APIs
- **Dota 2 Data**: OpenDota API

### Hosting & Deployment
- **Platform**: Google Cloud Platform
- **Service**: Cloud Run (recommended for ease of deployment and auto-scaling)

## Color Palette

```css
/* Primary Colors */
--background: #121315
--accent-primary: #ad3f21
--black: #000000
--text-light: #d1d1c6
--text-secondary: #cecece
```

## Architecture Notes
- **Version 1**: Client-side only, no database
- **Version 2**: Full-stack with authentication and real-time collaboration