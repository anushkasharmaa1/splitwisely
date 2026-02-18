# Splitwisely 💸

Splitwisely is a full-stack expense splitting web application inspired by Splitwise.  
It helps users manage shared expenses within groups, automatically calculate balances, and settle dues efficiently.

🔗 **Live Demo:** https://your-vercel-app.vercel.app

---

## ✨ Features

- User authentication with Clerk
- Create and manage expense groups
- Add members to groups by email
- Add expenses with automatic equal splitting
- View balances (owed / lent)
- Settle expenses
- Category-based expense tracking
- Delete expenses (UI implemented)
- Fully deployed with cloud database

---

## 🛠 Tech Stack

**Frontend**
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

**Authentication**
- Clerk

**Deployment**
- Vercel

---

## 📊 Database Models

- User
- Group
- GroupMember
- Expense
- ExpenseSplit
- Settlement

---

## ⚙️ Local Setup

### Clone repository
```bash
git clone https://github.com/your-username/splitwisely.git
cd splitwisely
