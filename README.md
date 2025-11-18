# Cloudflare Images Manager

A modern, intuitive web application for managing your Cloudflare Images. Upload, search, and manage your images with ease.

## Features

- **Easy Upload**: Drag-and-drop or click to upload images
- **Image Gallery**: View all your uploaded images in a responsive grid
- **Search**: Filter images by filename
- **Copy URLs**: One-click copy image URLs to clipboard
- **Delete Images**: Remove unwanted images with confirmation
- **Pagination**: Navigate through large image collections
- **Responsive Design**: Works perfectly on mobile and desktop

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Cloudflare Images API** - Image hosting and delivery
- **React Hot Toast** - Beautiful notifications

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Cloudflare account with Images enabled
- Cloudflare API Token with Images permissions

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cloudflare-images-pl
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and fill in your Cloudflare credentials:

```env
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_API_TOKEN=your_api_token_here
CLOUDFLARE_ACCOUNT_HASH=your_account_hash_here
```

**Where to find these values:**

- **Account ID**: Cloudflare Dashboard → Images → Overview
- **API Token**: Cloudflare Dashboard → My Profile → API Tokens (Create token with "Cloudflare Images - Edit" permission)
- **Account Hash**: Found in the example URL on Cloudflare Dashboard → Images → Overview

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment to Vercel

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Deploy to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables (same as `.env.local`)
   - Click "Deploy"

3. Your app will be live with automatic deployments on every push to main!

## Project Structure

```
cloudflare-images-pl/
├── app/
│   ├── api/
│   │   └── images/
│   │       ├── route.ts          # Upload & List images
│   │       └── [id]/
│   │           └── route.ts      # Delete image
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page
├── components/
│   ├── ImageCard.tsx             # Individual image card
│   ├── ImageGallery.tsx          # Gallery grid
│   ├── ImageUpload.tsx           # Upload component
│   ├── Pagination.tsx            # Pagination controls
│   └── SearchBar.tsx             # Search input
├── lib/
│   └── cloudflare.ts             # Cloudflare API client
├── types/
│   └── cloudflare.ts             # TypeScript types
└── .env.local                    # Environment variables
```

## API Routes

- `POST /api/images` - Upload a new image
- `GET /api/images?page=1` - List images with pagination
- `DELETE /api/images/[id]` - Delete an image

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Yes |
| `CLOUDFLARE_API_TOKEN` | API token with Images permissions | Yes |
| `CLOUDFLARE_ACCOUNT_HASH` | Account hash for image URLs | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Check the [Cloudflare Images documentation](https://developers.cloudflare.com/images/)
- Open an issue on GitHub
