# 📚 Bookstore

> A full-stack online bookstore application built with React, TypeScript, and Express.js

[![Live Demo](https://img.shields.io/badge/demo-live-green?style=for-the-badge)](https://enmazenadel.github.io/Book-Store-Store/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat-square&logo=bootstrap)](https://getbootstrap.com/)

---

## ✨ Features

**For Customers:**
- Browse and search books by title, ISBN, author, or category
- Shopping cart with real-time totals
- Secure checkout with order history
- Profile management

**For Administrators:**
- Dashboard with sales overview
- Book inventory management (CRUD)
- Automated stock replenishment
- Sales and analytics reports

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/ENMazenAdel/bookstoredb.git

# Install frontend dependencies
cd bookstoredb/frontend
npm install

# Start development server
npm run dev
```

**Demo Accounts:**

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin` |
| Customer | `john_doe` | `password` |

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
|----------|---------|----------|
| React 18 | Express.js | PostgreSQL |
| TypeScript | Node.js | — |
| Vite | — | — |
| Bootstrap 5 | — | — |
| React Router v6 | — | — |

---

## 📁 Project Structure

```
bookstoredb/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API layer
│   │   └── types/         # TypeScript interfaces
│   └── package.json
│
├── backend/           # Express API server
│   └── src/
│       ├── index.js
│       └── routes/
│
├── database/          # Database files
│   ├── schema.sql
│   └── *.json         # Sample data
│
└── REPORT.md          # Full project documentation
```

---

## 📖 Documentation

For complete project documentation including ERD, database schema, triggers, and UI descriptions, see [REPORT.md](REPORT.md).

---

## 📄 License

This project is for educational purposes — Database Systems Course (Fall 2025).
