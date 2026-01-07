#!/bin/bash

# Hotel Chandra Bharti - Project Setup Script

echo "🏨 Hotel Chandra Bharti - Full Stack Setup"
echo "==========================================="

# Install Backend Dependencies
echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Install Frontend Dependencies
echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the project:"
echo "   Terminal 1 (Backend): cd backend && npm start"
echo "   Terminal 2 (Frontend): cd frontend && npm run dev"
echo ""
echo "📝 Default Admin Credentials:"
echo "   Email: admin@hotelchandrabharti.com"
echo "   Password: admin123"
echo ""
echo "🔗 Access Points:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5000"
echo ""
echo "💡 First Steps:"
echo "   1. Setup MongoDB Atlas connection in .env"
echo "   2. Setup Gmail credentials in .env"
echo "   3. Run backend server"
echo "   4. Run frontend dev server"
echo "   5. Visit admin/login to create default admin"
