# Deployment Guide

This guide covers various deployment options for the Fintech Wallet System.

## Table of Contents
1. [Docker Deployment](#docker-deployment)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)

## Docker Deployment

The easiest way to deploy the entire application is using Docker Compose.

### Prerequisites
- Docker and Docker Compose installed
- MongoDB instance (or use the included MongoDB container)

### Steps

1. Clone the repository:
```bash
git clone https://github.com/Christian-Akor/FINTECH-WALLET-SYSTEM.git
cd FINTECH-WALLET-SYSTEM
```

2. Update environment variables in `docker-compose.yml`

3. Build and run:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

## Backend Deployment

### Heroku Deployment

1. Install Heroku CLI and login:
```bash
heroku login
```

2. Create a new Heroku app:
```bash
heroku create fintech-wallet-api
```

3. Add MongoDB addon:
```bash
heroku addons:create mongolab:sandbox
```

4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set JWT_EXPIRE=7d
heroku config:set BCRYPT_ROUNDS=10
heroku config:set RATE_LIMIT_WINDOW_MS=900000
heroku config:set RATE_LIMIT_MAX_REQUESTS=100
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com
```

5. Deploy:
```bash
cd backend
git subtree push --prefix backend heroku main
```

### Railway Deployment

1. Install Railway CLI:
```bash
npm i -g @railway/cli
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add MongoDB plugin from Railway dashboard

4. Set environment variables in Railway dashboard

5. Deploy:
```bash
cd backend
railway up
```

### Render Deployment

1. Create account on [Render](https://render.com)

2. Create new Web Service from GitHub repo

3. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Add environment variables

4. Create MongoDB Atlas database and connect

## Frontend Deployment

### Vercel Deployment (Recommended)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL

4. Deploy to production:
```bash
vercel --prod
```

### Netlify Deployment

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Build the application:
```bash
cd frontend
npm run build
```

3. Deploy:
```bash
netlify deploy --prod --dir=.next
```

4. Set environment variables in Netlify dashboard

### DigitalOcean App Platform

1. Create account on DigitalOcean

2. Create new App from GitHub repo

3. Configure build settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Run Command: `cd frontend && npm start`

4. Add environment variables

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. Create a new cluster

3. Create database user with password

4. Whitelist IP addresses (or use 0.0.0.0/0 for all IPs)

5. Get connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/fintech_wallet
```

6. Update `MONGODB_URI` environment variable

### Local MongoDB

For development:
```bash
# macOS (Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
Download from https://www.mongodb.com/try/download/community
```

## Environment Variables

### Backend (.env)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fintech_wallet

# JWT
JWT_SECRET=your_very_secure_random_secret_key_here
JWT_EXPIRE=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend-api-url.com/api
```

## Security Checklist for Production

- [ ] Change JWT_SECRET to a strong, random value
- [ ] Use HTTPS for both frontend and backend
- [ ] Set CORS_ORIGIN to your actual frontend domain
- [ ] Use MongoDB Atlas or secured MongoDB instance
- [ ] Enable MongoDB authentication
- [ ] Set up proper firewall rules
- [ ] Enable rate limiting
- [ ] Set NODE_ENV=production
- [ ] Use environment variables (never commit secrets)
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup database regularly

## Post-Deployment Verification

1. Check backend health:
```bash
curl https://your-api-url.com/health
```

2. Test registration:
```bash
curl -X POST https://your-api-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phoneNumber": "1234567890",
    "password": "password123",
    "pin": "1234"
  }'
```

3. Verify frontend loads correctly

4. Test complete user flow:
   - Registration
   - Login
   - View dashboard
   - Make transfer
   - Check transaction history

## Monitoring and Maintenance

### Recommended Monitoring Tools
- **Backend**: Sentry, LogRocket, New Relic
- **Database**: MongoDB Atlas monitoring
- **Uptime**: UptimeRobot, Pingdom
- **Performance**: Google Lighthouse

### Regular Maintenance
- Monitor error logs
- Review transaction patterns
- Check database performance
- Update dependencies regularly
- Perform security audits
- Backup database weekly

## Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify environment variables are set
- Check logs for specific errors

### Frontend can't connect to backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration on backend
- Verify backend is accessible

### Database connection issues
- Check MongoDB Atlas IP whitelist
- Verify database user credentials
- Ensure network connectivity

## Support

For issues or questions:
- GitHub Issues: [Repository Issues](https://github.com/Christian-Akor/FINTECH-WALLET-SYSTEM/issues)
- Email: support@finwallet.com

## License

ISC License - See LICENSE file for details
