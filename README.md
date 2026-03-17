# Splitwisely 💸

Splitwisely is a full-stack expense splitting web application inspired by Splitwise.
It helps users manage shared expenses within groups, automatically calculate balances, and settle dues efficiently.

🔗 **Live Demo:** [splitwisely-beige.vercel.app](https://splitwisely-beige.vercel.app/)
📦 **GitHub:** [github.com/anushkasharmaa1/splitwisely](https://github.com/anushkasharmaa1/splitwisely)

---

## ✨ Features

- 🔐 User authentication with Clerk
- 👥 Create and manage expense groups
- 📧 Add members to groups by email (auto-added as friends)
- 💸 Add expenses with selectable payer and automatic equal splitting
- 📊 Real-time dashboard with balance tracking (you owe / you are owed)
- ✅ Settle expenses between members
- 🗂 Category-based expense tracking (Food, Travel, Housing, Transport, Shopping)
- 🧾 Recent activity feed across all groups
- 👫 Friends list auto-populated from group members
- 📱 Fully responsive — mobile bottom nav + desktop sidebar
- ☁️ Fully deployed with cloud PostgreSQL database

---

## 🛠 Tech Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4

**Backend**
- Next.js API Routes
- Prisma ORM v5
- PostgreSQL (Neon)

**Authentication**
- Clerk

**Deployment**
- Vercel (frontend + API)
- Neon (serverless PostgreSQL)

---

## 📊 Database Models

| Model | Description |
|-------|-------------|
| `User` | Synced with Clerk on sign-up |
| `Group` | Expense-sharing group |
| `GroupMember` | User ↔ Group relation with role (admin/member) |
| `Expense` | Individual expense with payer and category |
| `ExpenseSplit` | Per-user split amount and settled status |
| `Settlement` | Records when a user settles up |
| `Friendship` | Auto-created when users are added to a shared group |

---

## ⚙️ Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/anushkasharmaa1/splitwisely.git
cd splitwisely
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Database (Neon PostgreSQL)
DATABASE_URL=your_neon_database_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Set up the database

```bash
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Deployment

This project is deployed on **Vercel** with **Neon** as the cloud PostgreSQL database.

To deploy your own:
1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel project settings
4. Vercel auto-deploys on every push to `master`

---

## 📁 Project Structure

```
splitwisely/
├── app/
│   ├── (app)/               # Authenticated app layout
│   │   ├── dashboard/       # Dashboard page
│   │   ├── expenses/        # All expenses + add new
│   │   ├── groups/          # Groups list + group detail
│   │   ├── friends/         # Friends list
│   │   └── activity/        # Recent activity feed
│   ├── api/                 # API routes
│   │   ├── dashboard/
│   │   ├── expenses/
│   │   ├── groups/
│   │   ├── friends/
│   │   ├── sync-user/
│   │   └── webhooks/
│   ├── sign-in/
│   ├── sign-up/
│   └── page.tsx             # Landing page
├── components/
│   ├── AppSidebar.tsx       # Desktop sidebar + mobile bottom nav
│   └── AppTopbar.tsx        # Top navigation bar
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── middleware.ts
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2026 Splitwisely
