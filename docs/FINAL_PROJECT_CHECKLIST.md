# Final Project Checklist — Flight-Social

This condensed checklist is intended for sprint planning and team tracking. Mark items with ✅ when done and assign owners/estimates.

## MVP — Core features
- [ ] User auth
  - [x] Sign up with profile picture upload (Cloudinary)
  - [x] Login / JWT token handling
  - [x] GET /auth/me endpoint to validate token (protected)
  - Acceptance:
    - [x] `POST /api/v1/auth/register` creates a user and returns profile including `profilePicture` URL
    - [x] `POST /api/v1/auth/login` returns a JWT on valid credentials
    - [x] `GET /api/v1/auth/me` returns 200 + sanitized user JSON when called with `Authorization: Bearer <token>`

- [ ] User profiles
  - [x] View profile (avatar, bio, posts, followers/following)
- [x] Edit profile and update profile picture
- Acceptance:
    - [x] `GET /api/v1/users/:id` returns user profile with recent posts (paginated)
    - [x] `PUT /api/v1/users/:id` updates editable fields and returns the updated profile (auth required)

- [x] Posts timeline
- [x] Create posts with text, media (image/video), location, tags, `isAnonymous` option
- [x] Feed: fetch posts for timeline (server-driven)
- [x] Edit/delete own posts; like and comment (CRUD)
- [x] Images uploaded to Cloudinary; store URLs in DB
  - Acceptance:
    - [x] `POST /api/v1/posts` accepts `FormData` with optional media file and returns the saved post (auth required)
    - [x] `GET /api/v1/feed?page=1&size=20` returns paginated posts filtered by the logged-in user's friends and groups; each post includes author (`id,name,profilePicture`) and group (`id,name`)
    - [x] `PUT /api/v1/posts/:id` allows the post owner to edit text/tags and returns the updated post
    - [x] `DELETE /api/v1/posts/:id` deletes the post when requested by the owner or admin
    - Note: implemented routes are available under the posts router (examples): `/create-post`, `/update-post/:id`, `/delete-post/:id`, `/get-timeline-posts/:username`, `/get-post/:id`.

- [ ] Comments
- [ ] Add/edit/delete comments on posts (anonymous option)
  - Acceptance:
    - [x] `POST /api/v1/posts/:postId/comments` creates a comment (optionally anonymous) and returns the comment
    - [x] `PUT /api/v1/comments/:id` edits a comment by its owner
    - [x] `DELETE /api/v1/comments/:id` deletes a comment by its owner or admin
    - Note: implemented comment routes (posts router): `/add-comment/:id`, `/update-comment/:id`, `/delete-comment/:id`.

- [ ] Groups
  - [ ] Create/join groups, group posts, privacy (public/private)
  - [ ] Group member management (invite/approve/leave)
  - Acceptance:
    - [ ] `POST /api/v1/groups` creates a group (with privacy flag)
    - [ ] `POST /api/v1/groups/:id/join` requests to join a private group or joins a public group
    - [ ] `GET /api/v1/groups/:id/posts` returns posts scoped to the group (paginated)

- [ ] Real-time communication (Chat)
  - [ ] Implement Socket.io server & client wiring for private messaging
  - [ ] Persist chat messages to `ChatMessage` model
  - Acceptance:
    - [ ] Socket connections validate JWT and reject unauthorized sockets
    - [ ] Sending a private message delivers instantly if recipient online and persists in DB
    - [ ] Endpoint to fetch message history between two users


## Admin & Moderation
- [ ] Admin console
  - [x] List users/groups, view user JSON/details, delete users/groups
  - [x] Verify admin via /auth/me; token management (hidden in UI)
  - [ ] Audit logs for admin actions

- [ ] Moderation tools
  - [ ] Flag content, review flagged items, remove content/users

## API & Backend
- [ ] REST API design (e.g., /api/v1)
  - [ ] Users: CRUD endpoints, follow/unfollow
  - [ ] Posts: CRUD, like/unlike, timeline
  - [ ] Comments: CRUD
  - [ ] Groups: CRUD, join/leave
- [ ] Auth: JWT issuance/verification
- [ ] Data models (Mongoose): User, Post, Comment, Group, ChatMessage
- [ ] Input validation & sanitization
- [ ] Consistent error handling & JSON response shapes

## Frontend (React + Vite)
- [ ] Auth flow: store tokens in localStorage (consider refresh flow)
 - [x] AdminConsole using jQuery/AJAX for admin actions
 - [x] Vite dev proxy for /api → backend
 - [x] RightBar minimizable (FAB toggle; hidden when minimized)
- [ ] Responsive layout and pages (Feed, Profile, Groups, Admin)
- [ ] New post form uses FormData for media uploads
- [ ] Optimistic UI updates where sensible

## DevOps & Deployment
- [ ] Environment config (.env) for secrets
- [ ] Dockerfiles (optional)
- [ ] CI pipeline: lint, test, build
- [ ] Production hosting (Heroku, Vercel, Azure, AWS)
- [ ] DB hosting (MongoDB Atlas)

## Security & Compliance
- [ ] Hash passwords, secure JWT handling
- [ ] Rate limiting
- [ ] File upload validation (mimetype, size)
- [ ] Input sanitization (prevent XSS)

## Quality & Testing
- [ ] Unit tests for backend auth and post logic
- [ ] Integration tests for API flows
- [ ] End-to-end smoke tests (login → post → comment)
- [ ] Linting & formatting (ESLint, Prettier)

## Monitoring & Maintenance
- [ ] Structured logging and error tracking (Sentry)
- [ ] Health checks and basic metrics
- [ ] DB backup strategy

## Acceptance criteria examples
- [ ] /auth/me returns 200 + user JSON when token valid
- [ ] Creating a post persists in DB and appears on feed
- [ ] AdminConsole lists users; deleting a user removes them
- [ ] Images uploaded via NewPost return Cloudinary URL

## Optional enhancements (post-MVP)
- [ ] Reactions (emoji), post sharing
- [ ] Follow recommendations
- [ ] WebSockets for chat & live notifications
- [ ] Dark mode / theming

---

Assigned to: [TODO]
Sprint / Milestone: [TODO]
Priority ordering: MVP-first

Please update this file and/or create GitHub issues for each checked item as you work through the project.

## Completed in this workspace
- Admin console (list users, view user JSON, delete users) — frontend: `frontend/src/pages/Admin/AdminConsole.jsx`
- `GET /api/v1/auth/me` endpoint implemented — backend: `server/controllers/authController.js`, `server/routes/authRoutes.js`
- `GET /api/v1/users/all` route + controller hooked up — backend: `server/controllers/userController.js`, `server/routes/userRoutes.js`
- Vite dev proxy for `/api` → `http://localhost:3000` — `frontend/vite.config.js`
- Admin user modal prettier + profile picture display — `frontend/src/pages/Admin/AdminConsole.jsx`
- RightBar minimizable with FAB and persistence — `frontend/src/components/rightBar/RightBar.jsx`, `frontend/src/components/rightBar/rightbar.css`

- Seeder skeleton (sample data) — `server/scripts/seed.js`
- NewPost FormData handling (media upload flow) — `frontend/src/pages/NewPost/newPost.jsx`
- Cloudinary config & usage — `server/config/cloudinary.js`, `server/controllers/postController.js`

## Finalized status (defense-ready checklist)

Marked done (from implemented codebase):

- [x] Sign up with profile picture upload (Cloudinary)
- [x] Login / JWT token handling
- [x] GET /auth/me endpoint to validate token (protected)
- [x] Feed: fetch posts for timeline (server-driven)
- [x] AdminConsole using jQuery/AJAX for admin actions
- [x] Vite dev proxy for /api → backend
- [x] RightBar minimizable (FAB toggle; hidden when minimized)

Remaining / in-progress items (recommendations to finish before defense):

- [ ] View/edit profile (avatar, bio, posts, followers/following) — frontend: `frontend/src/pages/Profile/` (partial)
- [ ] Full posts CRUD and comments CRUD (edit/delete UI flows and confirmation) — `frontend/src/pages/NewPost/`, `frontend/src/pages/postsComponents/`
- [ ] Images validation and Cloudinary hardening (server-side mimetype/size checks)
- [ ] Audit logs for admin actions (server-side)
- [ ] Unit and integration tests (backend auth/post flow)
- [ ] D3 analytics components and Socket.io chat wiring (analytics under `frontend/src/components/Analytics/`, chat under `frontend/src/components/Chat/`)

How to run demos locally (quick run commands)

1) Install dependencies (if not already):

```powershell
# from repo root
cd server; npm install
cd ..\frontend; npm install
```

2) Start backend and frontend dev servers (two shells)

```powershell
# In shell 1 (backend)
cd C:\Users\PC\Flight-Social\server
npm run dev

# In shell 2 (frontend)
cd C:\Users\PC\Flight-Social\frontend
npm run dev
```

3) Seed the local DB with sample data (safe for local dev only)

```powershell
# from repo root
node server\scripts\seed.js
```

Notes & troubleshooting
- If the frontend returns HTML for `/api` calls, restart the Vite dev server so `vite.config.js` proxy takes effect.
- The seeder is destructive for the collections it touches. Do not run it against production.
- If `npm run dev` exits with errors, paste the terminal logs and I'll help debug (common issues: missing .env, Mongo not running, port in use).

If you'd like, I can also:
- Add `npm run seed` to `server/package.json` for convenience.
- Scaffold Socket.io server + simple React chat component and two-page demo instructions.
- Scaffold two D3 components with server endpoints that aggregate posts by group/month.
