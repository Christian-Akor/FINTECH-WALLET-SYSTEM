# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

Body:
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phoneNumber": "1234567890",
  "password": "password123",
  "pin": "1234"
}

Response: 201
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phoneNumber": "1234567890",
    "accountNumber": "3012345678",
    "balance": 0,
    "isVerified": false,
    "role": "user"
  }
}
```

### Login User
```
POST /auth/login
Content-Type: application/json

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200
{
  "success": true,
  "token": "jwt_token_here",
  "data": { ... }
}
```

### Get Current User
```
GET /auth/me
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

### Update User Details
```
PUT /auth/updatedetails
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "firstName": "Jane",
  "email": "jane@example.com"
}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

### Update Password
```
PUT /auth/updatepassword
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}

Response: 200
{
  "success": true,
  "token": "new_jwt_token",
  "data": { ... }
}
```

### Update PIN
```
PUT /auth/updatepin
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "currentPin": "1234",
  "newPin": "5678"
}

Response: 200
{
  "success": true,
  "message": "PIN updated successfully"
}
```

## User Endpoints

### Get User by Account Number
```
GET /users/account/:accountNumber
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "accountNumber": "3012345678"
  }
}
```

### Get Single User
```
GET /users/:id
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

### Get All Users (Admin Only)
```
GET /users
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

## Wallet Endpoints

### Get Balance
```
GET /wallet/balance
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": {
    "balance": 1000,
    "accountNumber": "3012345678"
  }
}
```

### Transfer Money
```
POST /wallet/transfer
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "recipientAccountNumber": "3087654321",
  "amount": 100,
  "pin": "1234",
  "description": "Payment for goods"
}

Response: 200
{
  "success": true,
  "message": "Transfer successful",
  "data": {
    "_id": "transaction_id",
    "sender": { ... },
    "recipient": { ... },
    "amount": 100,
    "type": "transfer",
    "status": "completed",
    "description": "Payment for goods",
    "reference": "TXNABCD1234",
    "balanceAfter": {
      "sender": 900,
      "recipient": 1100
    },
    "metadata": { ... },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Transaction History
```
GET /wallet/transactions?page=1&limit=20
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "count": 20,
  "total": 100,
  "page": 1,
  "pages": 5,
  "data": [ ... ]
}
```

### Get Single Transaction
```
GET /wallet/transactions/:id
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

### Get Transaction by Reference
```
GET /wallet/transactions/reference/:reference
Authorization: Bearer {token}

Response: 200
{
  "success": true,
  "data": { ... }
}
```

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Rate Limiting

API requests are limited to 100 requests per 15 minutes per IP address.

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer {your_jwt_token}
```

Tokens expire after 7 days by default.
