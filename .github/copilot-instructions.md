# Bookstore Frontend - Copilot Instructions

## Project Overview
This is a React + TypeScript frontend for an online bookstore system using Vite as the build tool and Bootstrap 5 for styling.

## Tech Stack
- React 18 with TypeScript
- Vite for build tooling
- Bootstrap 5 for UI components
- React Router v6 for navigation
- Axios for API calls

## User Types
1. **Admin**: Can manage books, view reports, place/confirm orders
2. **Customer**: Can browse books, manage cart, checkout, view order history

## Project Structure
```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
│   ├── admin/      # Admin-only pages
│   └── customer/   # Customer pages
├── services/       # API service layer
├── context/        # React context providers
├── types/          # TypeScript interfaces
└── assets/         # Static assets
```

## Development Guidelines
- Use functional components with hooks
- Apply Bootstrap classes for styling
- Use TypeScript strictly - no `any` types
- Keep components small and focused
