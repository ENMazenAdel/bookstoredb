# Backend API Documentation

Express.js REST API server for the Bookstore application.

## Overview

This backend provides a RESTful API for the bookstore frontend, handling:
- User authentication (login/register)
- Book inventory management (CRUD operations)
- Shopping cart operations
- Customer order management

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.x
- **Middleware**: 
  - CORS (cross-origin requests)
  - express.json (body parsing)
- **Development**: Nodemon (auto-restart)

## Project Structure

```
backend/
├── package.json          # Dependencies and scripts
├── src/
│   ├── index.js          # Express server entry point
│   └── routes/
│       ├── books.js      # Book inventory endpoints
│       ├── users.js      # Authentication & user endpoints
│       ├── cart.js       # Shopping cart endpoints
│       └── orders.js     # Order management endpoints
```

## Getting Started

### Installation
```bash
cd backend
npm install
```

### Development
```bash
npm run dev    # Starts with nodemon (auto-reload)
```

### Production
```bash
npm start      # Starts without nodemon
```

### Environment Variables
Create a `.env` file:
```
PORT=5000      # Server port (default: 5000)
```

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

### Books (`/api/books`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all books |
| GET | `/:isbn` | Get book by ISBN |
| POST | `/` | Create new book |
| PUT | `/:isbn` | Update book |
| DELETE | `/:isbn` | Delete book |

### Users (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | Authenticate user |
| POST | `/register` | Create new account |
| GET | `/:id` | Get user profile |
| PUT | `/:id` | Update user profile |

### Cart (`/api/cart`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:userId` | Get user's cart |
| POST | `/:userId/items` | Add item to cart |
| PUT | `/:userId/items/:isbn` | Update item quantity |
| DELETE | `/:userId/items/:isbn` | Remove item from cart |
| DELETE | `/:userId` | Clear entire cart |

### Orders (`/api/orders`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all orders (admin) |
| GET | `/user/:userId` | Get user's orders |
| GET | `/:id` | Get order by ID |
| POST | `/` | Create new order |
| PUT | `/:id` | Update order status |

## Data Storage

> **Note**: This is a development/demo backend using in-memory storage.
> All data resets when the server restarts.

For production, replace the in-memory arrays with:
- PostgreSQL (see `../database/schema.sql`)
- Use an ORM like Prisma or Sequelize

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful delete)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid credentials)
- `404` - Not Found
- `500` - Server Error

## Security Notes

⚠️ **This is a demo backend. For production:**

1. **Passwords**: Use bcrypt for password hashing
2. **Authentication**: Implement JWT tokens
3. **Validation**: Add input validation (express-validator)
4. **Rate Limiting**: Add rate limiting middleware
5. **HTTPS**: Use HTTPS in production
6. **Environment**: Never commit `.env` files

## Sample Requests

### Login
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

### Get All Books
```bash
curl http://localhost:5000/api/books
```

### Add to Cart
```bash
curl -X POST http://localhost:5000/api/cart/user123/items \
  -H "Content-Type: application/json" \
  -d '{"book": {"isbn": "978-0-13-468599-1", ...}, "quantity": 2}'
```
