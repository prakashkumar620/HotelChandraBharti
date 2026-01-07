<<<<<<< HEAD
# 🏨 Hotel Chandra Bharti - Full Stack Management Website

A comprehensive hotel management system with customer and admin dashboards, built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 👥 Customer Features
- **User Authentication**: Sign up, login, forgot password with OTP
- **Menu Browsing**: View categorized menu items (Veg/Non-Veg/Drinks)
- **Shopping Cart**: Add items to cart with quantity management
- **Table Booking**: Book tables/rooms/halls with date & time selection
- **Contact Form**: Send messages to hotel
- **Profile Management**: View and manage user profile

### 🔐 Admin Features
- **Admin Dashboard**: View statistics (users, bookings, messages)
- **Menu Management**: Add, edit, delete menu items
- **User Management**: View all users, block/unblock accounts
- **Booking Management**: View and approve/reject bookings
- **Message Management**: View contact messages and send replies
- **Password Management**: Change admin password

## 🛠️ Tech Stack

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB Atlas** - Cloud database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Mongoose** - ODM

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router DOM** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Context API** - State management

## 📋 Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Gmail account (for email service)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repo-url>
cd hotel_chandra_bharti_full_project
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with:
# MONGO_URI=<your-mongodb-connection-string>
# JWT_SECRET=<your-jwt-secret>
# EMAIL_USER=<your-gmail>
# EMAIL_PASS=<your-gmail-app-password>
# RECEIVER_EMAIL=<your-email>
# PORT=5000
# CLIENT_URL=http://localhost:3000

# Start server
npm start
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Database**: MongoDB Atlas (cloud)

## 🔑 Default Admin Credentials

**Email**: admin@hotelchandrabharti.com  
**Password**: admin123

Create default admin by visiting: `/admin/create-default-admin` (GET request)

## 📊 Project Structure

```
backend/
├── models/           # Database schemas
├── controllers/      # Business logic
├── routes/          # API endpoints
├── middleware/      # Authentication & validation
├── services/        # Email, external services
├── config/          # Database config
└── server.js        # Main server file

frontend/
├── src/
│   ├── pages/       # Page components
│   ├── components/  # Reusable components
│   ├── context/     # Context providers
│   ├── utils/       # API & helpers
│   ├── App.jsx      # Routes
│   └── index.css    # Global styles
└── public/          # Static assets
```

## 🔗 API Endpoints

### Authentication
```
POST   /auth/signup              - Register new user
POST   /auth/login               - User login
POST   /auth/forgot-password     - Request OTP
POST   /auth/reset-password      - Reset password with OTP
GET    /auth/profile             - Get user profile (protected)
```

### Menu
```
GET    /menu                     - Get all menu items
GET    /menu/category/:category  - Get items by category
POST   /menu                     - Add menu item (admin)
PUT    /menu/:id                 - Update menu item (admin)
DELETE /menu/:id                 - Delete menu item (admin)
```

### Bookings
```
POST   /bookings                 - Create booking
GET    /bookings/user/:userId    - Get user bookings (protected)
GET    /bookings/:id             - Get booking details
PUT    /bookings/:id/cancel      - Cancel booking (protected)
```

### Admin
```
POST   /admin/login              - Admin login
GET    /admin/create-default-admin
GET    /admin/dashboard/stats    - Dashboard stats (protected)
GET    /admin/menu               - Get all menu items (admin)
GET    /admin/users              - Get all users (admin)
PUT    /admin/users/:id/block    - Block/unblock user (admin)
DELETE /admin/users/:id          - Delete user (admin)
GET    /admin/bookings           - Get all bookings (admin)
PUT    /admin/bookings/:id/status - Update booking status (admin)
DELETE /admin/bookings/:id       - Delete booking (admin)
GET    /admin/messages           - Get all messages (admin)
PUT    /admin/messages/:id/reply - Reply to message (admin)
DELETE /admin/messages/:id       - Delete message (admin)
POST   /admin/change-password    - Change admin password (admin)
```

### Contact
```
POST   /contact                  - Send contact message
```

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Works seamlessly on all devices

## 🎨 Color Scheme

- **Primary**: Yellow (#fbbf24)
- **Secondary**: Orange (#f97316)
- **Background**: Slate-900 (#0f172a)
- **Text**: White with gray accents

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Protected admin routes
- Input validation on backend
- CORS enabled
- User role-based access control

## 📧 Email Configuration

The project uses Nodemailer with Gmail SMTP:

1. Enable "Less secure app access" in Gmail
2. Or use "App Password" (recommended for 2FA accounts)
3. Configure in .env:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Verify connection string in .env
- Ensure MongoDB Atlas whitelist your IP
- Check network connectivity

### Email Not Sending
- Verify Gmail credentials
- Allow "Less secure apps" in Gmail settings
- Use App Password if 2FA enabled

### Port Already in Use
- Change PORT in .env (backend)
- Change port in vite.config.js (frontend)

## 🚢 Deployment

### Backend (Heroku/Railway)
```bash
# Add Procfile
web: node server.js

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy `dist` folder
```

## 📝 License

MIT License - feel free to use this project

## 👨‍💼 Author

Created for Hotel Chandra Bharti Management System

## 🤝 Support

For issues or questions, please check the IMPLEMENTATION_GUIDE.md

---

**Made with ❤️ for Hotel Chandra Bharti**
=======
# HotelChandraBharti
>>>>>>> d23eca56cec837d08ecad35c39998fa6dd0b0238
