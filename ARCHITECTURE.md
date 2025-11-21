# System Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │  Landing   │  │  Register  │  │   Login    │  │  Dashboard ││
│  │    Page    │  │    Page    │  │    Page    │  │    Page    ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐│
│  │  Transfer  │  │Transaction │  │  Profile   │  │  Components││
│  │    Page    │  │    Page    │  │    Page    │  │  (Shared)  ││
│  └────────────┘  └────────────┘  └────────────┘  └────────────┘│
│                                                                   │
│              Next.js 16 + TypeScript + Tailwind CSS              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS/REST API
                              │ (JWT Auth)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION LAYER                          │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Security Middleware                        │   │
│  │  • Helmet (Security Headers)                            │   │
│  │  • CORS Protection                                       │   │
│  │  • Rate Limiting (100 req/15min)                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │               Authentication Middleware                  │   │
│  │  • JWT Verification                                      │   │
│  │  • User Session Management                              │   │
│  │  • Role-Based Access Control                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Auth      │  │    User      │  │   Wallet     │         │
│  │  Controller  │  │  Controller  │  │  Controller  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │     Auth     │  │     User     │  │    Wallet    │         │
│  │   Service    │  │   Service    │  │   Service    │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                   │
│                  Node.js + Express.js                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│                                                                   │
│  ┌────────────────────────────────────────────────────┐         │
│  │              MongoDB Collections                    │         │
│  │                                                     │         │
│  │  ┌─────────────┐          ┌─────────────┐         │         │
│  │  │    Users    │          │Transactions │         │         │
│  │  ├─────────────┤          ├─────────────┤         │         │
│  │  │ • firstName │          │ • sender    │         │         │
│  │  │ • lastName  │          │ • recipient │         │         │
│  │  │ • email     │          │ • amount    │         │         │
│  │  │ • password  │          │ • type      │         │         │
│  │  │ • pin       │          │ • status    │         │         │
│  │  │ • accountNo │          │ • reference │         │         │
│  │  │ • balance   │          │ • metadata  │         │         │
│  │  └─────────────┘          └─────────────┘         │         │
│  │                                                     │         │
│  │  Indexes: email, phoneNumber, accountNumber,       │         │
│  │           reference, sender, recipient, createdAt  │         │
│  └────────────────────────────────────────────────────┘         │
│                                                                   │
│                        MongoDB                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Request Flow

### User Registration Flow
```
User → Frontend Form → Validation → API Request
                                        ↓
                          Backend Validation (express-validator)
                                        ↓
                          Generate Account Number
                                        ↓
                          Hash Password & PIN (bcrypt)
                                        ↓
                          Save to MongoDB
                                        ↓
                          Generate JWT Token
                                        ↓
                          Return User Data + Token
```

### Money Transfer Flow
```
User → Enter Details → Verify Recipient → Enter PIN
                                              ↓
                            Validate Request (amount, PIN)
                                              ↓
                            Start MongoDB Transaction
                                              ↓
                            Verify PIN (bcrypt)
                                              ↓
                            Check Sender Balance
                                              ↓
                            Deduct from Sender
                                              ↓
                            Add to Recipient
                                              ↓
                            Create Transaction Record
                                              ↓
                            Commit Transaction
                                              ↓
                            Return Success Response
```

## Security Layers

```
┌─────────────────────────────────────────┐
│     Layer 1: Network Security           │
│  • HTTPS Only                           │
│  • CORS Configuration                   │
│  • Rate Limiting                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Layer 2: Authentication             │
│  • JWT Tokens (7-day expiry)           │
│  • Secure Token Storage                 │
│  • Token Verification                   │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Layer 3: Authorization              │
│  • Role-Based Access Control           │
│  • Resource Ownership Check            │
│  • PIN Verification for Transfers      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Layer 4: Data Security              │
│  • Password Hashing (bcrypt)           │
│  • PIN Hashing (bcrypt)                │
│  • Input Validation                     │
│  • SQL/NoSQL Injection Prevention      │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│     Layer 5: Database Security          │
│  • Atomic Transactions                 │
│  • Connection Encryption               │
│  • Access Control                       │
└─────────────────────────────────────────┘
```

## Component Relationships

```
┌─────────────────────────────────────────────────────┐
│                    Frontend                          │
│                                                      │
│  AuthContext ─────────┐                            │
│       │                │                            │
│       ├──► Login       │                            │
│       ├──► Register    │◄──── Input Components     │
│       ├──► Dashboard   │                            │
│       ├──► Transfer    │◄──── Button Components    │
│       ├──► Transactions│                            │
│       └──► Profile     │◄──── Navbar Component     │
│                        │                            │
│       API Service ─────┘                            │
│       │                                              │
│       ├──► authService.ts                           │
│       ├──► walletService.ts                         │
│       └──► userService.ts                           │
└─────────────────────────────────────────────────────┘
                    │
                    │ HTTP/REST
                    ▼
┌─────────────────────────────────────────────────────┐
│                    Backend                           │
│                                                      │
│  Routes ──────────┐                                 │
│       │            │                                 │
│       ├──► authRoutes                               │
│       ├──► userRoutes                               │
│       └──► walletRoutes                             │
│                    │                                 │
│  Middleware ───────┤                                │
│       │            │                                 │
│       ├──► auth                                     │
│       ├──► validator                                │
│       └──► errorHandler                             │
│                    │                                 │
│  Controllers ──────┤                                │
│       │            │                                 │
│       ├──► authController                           │
│       ├──► userController                           │
│       └──► walletController                         │
│                    │                                 │
│  Models ───────────┘                                │
│       │                                              │
│       ├──► User                                     │
│       └──► Transaction                              │
└─────────────────────────────────────────────────────┘
```

## Technology Stack Details

```
┌──────────────────────────────────────────────────────┐
│                   Frontend Stack                      │
├──────────────────────────────────────────────────────┤
│ Framework:       Next.js 16 (App Router)             │
│ Language:        TypeScript                           │
│ Styling:         Tailwind CSS                        │
│ State:           React Context API                   │
│ HTTP Client:     Axios                               │
│ Notifications:   react-hot-toast                     │
│ Icons:           lucide-react                        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   Backend Stack                       │
├──────────────────────────────────────────────────────┤
│ Runtime:         Node.js v16+                        │
│ Framework:       Express.js v5                       │
│ Database:        MongoDB v4.4+                       │
│ ODM:             Mongoose v9                         │
│ Auth:            jsonwebtoken                        │
│ Encryption:      bcryptjs                            │
│ Validation:      express-validator                   │
│ Security:        helmet, cors, express-rate-limit    │
│ Logging:         morgan                              │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│                   DevOps Stack                        │
├──────────────────────────────────────────────────────┤
│ Containerization: Docker                             │
│ Orchestration:    Docker Compose                     │
│ Version Control:  Git                                │
│ Deployment:       Vercel, Heroku, Railway, Render   │
└──────────────────────────────────────────────────────┘
```

## File Count Summary

```
Backend Files:     15 files
Frontend Files:    20 files
Documentation:      6 files
Configuration:      8 files
Docker Files:       3 files
Total:            66 files (excluding node_modules, .git, .next)
```

## Lines of Code Breakdown

```
Backend:      ~2,500 lines
Frontend:     ~2,800 lines
Documentation: ~1,200 lines
───────────────────────────
Total:        ~6,500+ lines
```
