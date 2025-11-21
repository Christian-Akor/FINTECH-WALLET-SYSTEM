# Fintech Wallet System 💳

A full-stack, production-grade digital wallet system (Opay/Palmpay clone) built with Node.js, Express, MongoDB, Next.js, and Tailwind CSS.

## 🚀 Features

### Backend Features
- ✅ User authentication & authorization (JWT)
- ✅ Secure password hashing (bcrypt)
- ✅ Unique account number generation
- ✅ Wallet balance management
- ✅ P2P money transfers
- ✅ Transaction history with pagination
- ✅ Transaction PIN protection
- ✅ Rate limiting & security middleware
- ✅ Input validation
- ✅ Error handling
- ✅ MongoDB transactions for data consistency

### Frontend Features
- ✅ Modern, responsive UI with Tailwind CSS
- ✅ User registration & login
- ✅ Real-time balance display
- ✅ Send money to other users
- ✅ Transaction history with search
- ✅ Profile management
- ✅ Password & PIN updates
- ✅ Toast notifications
- ✅ Protected routes
- ✅ Mobile-responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Christian-Akor/FINTECH-WALLET-SYSTEM.git
cd FINTECH-WALLET-SYSTEM
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/fintech_wallet
# JWT_SECRET=your_secret_key_here
# PORT=5000

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local

# Update .env.local if needed
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Start MongoDB service:
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Linux
   sudo systemctl start mongod
   ```

## 📁 Project Structure

```
FINTECH-WALLET-SYSTEM/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, validation, error handling
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/             # Next.js pages
    │   ├── components/      # React components
    │   ├── contexts/        # React contexts
    │   ├── lib/             # Utilities & API setup
    │   ├── services/        # API services
    │   └── types/           # TypeScript types
    ├── .env.local.example
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password
- `PUT /api/auth/updatepin` - Update transaction PIN

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get single user
- `GET /api/users/account/:accountNumber` - Get user by account number
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/transfer` - Transfer money
- `GET /api/wallet/transactions` - Get transaction history
- `GET /api/wallet/transactions/:id` - Get single transaction
- `GET /api/wallet/transactions/reference/:reference` - Get transaction by reference

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Transaction PIN protection
- Rate limiting on API endpoints
- CORS configuration
- Input validation & sanitization
- Helmet.js security headers
- MongoDB transactions for data consistency

## 🎨 UI Screenshots

The application features:
- Clean, modern landing page
- Intuitive registration/login forms
- Dashboard with balance overview
- Easy-to-use transfer interface
- Comprehensive transaction history
- User profile management

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from GitHub or CLI
3. Ensure MongoDB connection string is set

### Frontend Deployment (Vercel/Netlify)
1. Connect GitHub repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy automatically on push

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fintech_wallet
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Christian Akor

## 🙏 Acknowledgments

- Inspired by Opay and Palmpay
- Built with modern best practices
- Designed for scalability and security

## 📞 Support

For support, email support@finwallet.com or create an issue in the repository.

---

**Note**: This is a demonstration project. For production use, additional security measures and compliance requirements should be implemented.
