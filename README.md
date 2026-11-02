# book-my-show

A full-stack movie ticket booking application with show scheduling, seat selection, and Stripe payments.

## 🚀 Live Demo
[https://book-it-1-wtsq.onrender.com/](https://book-it-1-wtsq.onrender.com/)

## 🛠️ Tech Stack

**Frontend:**
- Angular (standalone components)
- TypeScript
- ng-zorro (UI components)
- Reactive Forms
- SCSS

**Backend:**
- Node.js / Express
- MongoDB
- JWT Authentication
- Stripe API

**Deployment:**
- Render (frontend & backend)

## ✨ Features

- User authentication (login, register, forgot password)
- Browse movies and view details
- Select shows and book seats in real-time
- Secure payments with Stripe
- View booking history
- Admin panel for movie & theater management
- Theater partner dashboard

## 📦 Installation

### Backend
```bash
cd server
npm install
# Create .env file with MONGO_URI, STRIPE_SECRET_KEY, JWT_SECRET
npm start
