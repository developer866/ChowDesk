# 🍽️ Chowdesk

> A full-stack restaurant web application that lets customers browse a menu, build a cart, and place orders directly via WhatsApp — while giving the restaurant owner a complete admin dashboard to manage orders and menu items.

![Project Status](https://img.shields.io/badge/status-in%20development-orange)
![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Node.js%20%7C%20MongoDB-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Preview

> _Screenshots and live demo link will be added on deployment._

---

## ✨ Features

### Customer Side
- 🧾 Browse menu items grouped by category (Starters, Mains, Drinks, Desserts)
- 🛒 Add items to cart, adjust quantities, view running total
- 📲 Place orders via WhatsApp — a formatted order summary is sent instantly
- 📍 Choose between delivery or pickup at checkout
- 📱 Fully responsive — works great on mobile

### Admin Dashboard
- 🔐 Secure login with JWT authentication
- 📋 View all incoming orders with customer details and status
- ✅ Update order status — Pending → Confirmed → Completed → Cancelled
- 🍔 Add, edit, and delete menu items with image upload (Cloudinary)
- 📊 Dashboard stats — orders today, revenue today, top items

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt |
| Image Upload | Cloudinary |
| WhatsApp | wa.me deep link |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 📁 Project Structure

```
chowdesk/
├── frontend/                 # Next.js application
│   ├── app/
│   │   ├── page.jsx          # Home page
│   │   ├── menu/             # Menu page
│   │   ├── cart/             # Cart page
│   │   ├── checkout/         # Order form + WhatsApp submit
│   │   ├── about/            # About + location
│   │   └── admin/            # Admin dashboard (protected)
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   ├── MenuCard.jsx
│   │   ├── CartDrawer.jsx
│   │   └── Navbar.jsx
│   ├── context/
│   │   └── CartContext.jsx   # Global cart state
│   └── lib/
│       └── api.js            # API call helpers
│
├── backend/                  # Express.js API
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── authController.js
│   ├── models/
│   │   ├── MenuItem.js
│   │   ├── Order.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── menu.js
│   │   ├── orders.js
│   │   └── auth.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   └── server.js
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)

### 1. Clone the repo

```bash
git clone https://github.com/developer866/chowdesk.git
cd chowdesk
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend/` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_WHATSAPP_NUMBER=2349033383479
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 🔌 API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/menu` | Get all available menu items |
| GET | `/api/menu/:id` | Get a single menu item |
| POST | `/api/orders` | Submit a new order |

### Admin (JWT required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/admin/orders` | Get all orders |
| PATCH | `/api/admin/orders/:id` | Update order status |
| POST | `/api/admin/menu` | Add a menu item |
| PATCH | `/api/admin/menu/:id` | Update a menu item |
| DELETE | `/api/admin/menu/:id` | Delete a menu item |
| GET | `/api/admin/stats` | Get dashboard stats |

---

## 🗺️ Development Roadmap

- [x] Project setup and folder structure
- [ ] Frontend — public pages (Home, Menu, Cart, Checkout)
- [ ] Backend — REST API (menu + orders)
- [ ] WhatsApp order submission
- [ ] Admin dashboard (orders + menu management)
- [ ] Cloudinary image upload
- [ ] Deployment (Vercel + Render)
- [ ] **Version 2** — Paystack payment integration
- [ ] **Version 2** — Customer accounts and order history
- [ ] **Version 2** — Real-time order notifications (Socket.io)

---

## 👨‍💻 Author

**Ayeni Opeyemi Joseph**

- Portfolio: [portfolio-nu-six-65.vercel.app](https://portfolio-nu-six-65.vercel.app)
- GitHub: [@developer866](https://github.com/developer866)
- Email: opeyemijoseph866@gmail.com

---

## 📄 License

This project is licensed under the MIT License.
