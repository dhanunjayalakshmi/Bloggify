# Bloggify

A full-stack blog platform built as a portfolio project. Bloggify lets users write, publish, and discover blog posts with a clean, modern UI — featuring a rich text editor, real-time notifications, personalised feeds, and a detailed analytics dashboard.

**GitHub Repo:** [dhanunjayalakshmi/Bloggify](https://github.com/dhanunjayalakshmi/Bloggify)

**Live:** [bloggify-smoky.vercel.app](https://bloggify-smoky.vercel.app)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4 |
| UI Components | Radix UI, shadcn/ui, Lucide Icons |
| Rich Text Editor | Tiptap |
| State Management | Zustand (with persist) |
| Charts | Recharts |
| Backend | Node.js, Express |
| Database & Auth | Supabase (PostgreSQL + RLS + Realtime) |
| File Storage | Supabase Storage |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

### Writing & Publishing
- Rich text editor powered by Tiptap — bold, italic, underline, highlight, headings, lists, code blocks, blockquotes, alignment, and inline images
- Notion-style floating `+` block picker at the cursor for quick block insertion
- Bubble toolbar that appears on text selection for inline formatting
- Cover image upload with Supabase Storage
- Tag input with normalisation
- Auto-saving drafts to localStorage every 5 seconds
- Draft conflict resolution when switching between create and edit
- Preview mode before publishing

### Reading Experience
- Copy code button on all code blocks
- Back to Top button
- Estimated read time
- Blog series widget — grouped, ordered posts with prev/next navigation
- Related articles and more from the author sections

### Discovery & Feeds
- Home feed with sort options: Latest, Popular, Trending, For You
- **For You feed** — blogs from followed users and followed tags
- Tag pages — browse all blogs under a specific tag
- Tag following with `+` / `✓` chip toggle
- Explore people page
- Search by title and content

### Social & Engagement
- Follow / unfollow authors
- Emoji reactions on blogs (❤️ 🔥 💡 🤔 🎉) with optimistic UI
- Upvote / downvote on blogs and comments
- Nested comments with Markdown support
- **@mentions** in comments — live user search dropdown, highlighted in rendered text
- Bookmarks

### Notifications
- Real-time notifications via Supabase Realtime (postgres_changes)
- Notified on: new follower, comment on your blog, upvote on your blog or comment, @mention
- Bell icon with unread count badge
- Click to mark read and navigate to the source

### Blog Series
- Create and manage series of related posts
- Add / remove blogs from a series
- Drag-to-reorder with `@dnd-kit/sortable`
- Series widget displayed on each blog's detail page

### Analytics Dashboard
- Views over time (line chart)
- Top blogs by views (bar chart)
- Tag performance — average views per tag (horizontal bar chart)
- Content length vs views (short / medium / long)
- Reactions summary per emoji
- Reactions per blog (stacked bar chart)
- Follower growth over time

### Auth
- Email / password signup and login via Supabase Auth
- Forgot password and update password flows
- Persistent sessions with Zustand persist — no flash to login on page reload
- RLS policies on all tables — data access enforced at the database level

### Landing Page
- Live stats: total blogs published, total writers, total reads
- Features section
- Top authors by follower count
- Popular tags by frequency
- CTA section
- Public stats fetched via service role key on the backend (bypasses RLS safely)

---

## Project Structure

```
Blog_Website/
├── Blog_Frontend/       # React + Vite app
│   └── src/
│       ├── components/  # Reusable UI and feature components
│       ├── hooks/       # Custom hooks
│       ├── pages/       # Route-level page components
│       ├── stores/      # Zustand stores
│       ├── routes/      # AppRoutes, PrivateRoute
│       ├── services/    # API service functions
│       └── utils/       # Helpers
└── Blog_Backend/        # Express API
    ├── routes/          # API route handlers
    ├── middlewares/     # Auth middleware (verifyToken)
    ├── config/          # Supabase clients (anon + admin)
    └── utils/           # Validators, notification helpers
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone https://github.com/dhanunjayalakshmi/Bloggify.git
cd bloggify
```

### 2. Backend setup

```bash
cd Blog_Backend
npm install
```

Create a `.env` file:

```env
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FRONTEND_URL=http://localhost:3000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd Blog_Frontend
npm install
```

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_KEY=your_supabase_anon_key
VITE_API_BASE_URL=/api
```

Start the frontend:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000` and proxies `/api` requests to the backend on port `5000`.

---

## Key Architecture Decisions

**RLS everywhere** — Every table has Row Level Security enabled with policies scoped to `auth.uid()`. Internal user IDs are resolved via `(SELECT id FROM users WHERE auth_id = auth.uid())` since Supabase auth UUIDs differ from application user IDs.

**Service role for public data** — The landing page stats endpoint (`GET /api/public/stats`) uses a Supabase admin client (service role key) on the backend. This bypasses RLS for trusted server-side aggregate queries without exposing credentials to the client.

**Auth flash prevention** — Zustand persists `user` and `token` to localStorage. `PrivateRoute` checks for persisted credentials while Supabase confirms the session, returning `null` instead of redirecting to avoid a flash to the landing page.

**Realtime notifications** — Supabase Realtime `postgres_changes` subscription filters on the recipient's internal `users.id` (not the Supabase auth UUID) to receive only relevant inserts.

---

## Screenshots

> Coming soon

---

## License

MIT
