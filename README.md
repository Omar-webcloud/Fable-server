# 📚 Fable Server

Backend API for Fable Ebook Sharing Platform.

---

# Tech Stack

- Node.js
- Express.js
- MongoDB
- JWT
- Stripe
- BetterAuth
- imgBB
- CORS
- Cookie Parser

---

# Architecture

Client
↓
API Gateway
↓
Authentication Layer
↓
Authorization Layer
↓
Controllers
↓
Services
↓
MongoDB

---

# Database Collections

## users

```js
{
  _id,
  name,
  email,
  image,
  role,
  verifiedWriter,
  bookmarks:[],
  purchasedBooks:[],
  createdAt
}
```

Roles

- user
- writer
- admin

---

## ebooks

```js
{
  _id,
  title,
  description,
  fullContent,
  genre,
  coverImage,
  price,
  writerId,
  writerName,
  status,
  totalSales,
  createdAt
}
```

Status

- published
- unpublished

---

## purchases

```js
{
  _id,
  ebookId,
  buyerId,
  writerId,
  amount,
  stripeSessionId,
  purchaseDate
}
```

---

## bookmarks

```js
{
  _id,
  userId,
  ebookId,
  createdAt
}
```

---

## transactions

```js
{
  _id,
  type,
  email,
  amount,
  referenceId,
  date
}
```

Types

- purchase
- writerVerification

---

# Authentication

## JWT

Token Expiry

7 Days

Payload

```js
{
  id,
  email,
  role
}
```

---

# Middleware

## verifyJWT

Responsibilities

- Validate token
- Decode user

---

## verifyAdmin

Allow:

admin

---

## verifyWriter

Allow:

writer

---

## verifyUser

Allow:

user

---

# API Routes

# AUTH

POST

```
/api/auth/register
```

POST

```
/api/auth/login
```

POST

```
/api/auth/google
```

POST

```
/api/auth/logout
```

GET

```
/api/auth/me
```

---

# USERS

GET

```
/api/users/profile
```

PATCH

```
/api/users/profile
```

DELETE

```
/api/users/:id
```

---

# EBOOKS

GET

```
/api/ebooks
```

Supports:

- Search
- Filter
- Sort
- Pagination

Query Example

```
?page=1
&limit=12
&genre=fiction
&availability=available
&minPrice=0
&maxPrice=500
&sort=newest
```

---

GET

```
/api/ebooks/:id
```

POST

```
/api/ebooks
```

Writer Only

PATCH

```
/api/ebooks/:id
```

DELETE

```
/api/ebooks/:id
```

PATCH

```
/api/ebooks/:id/publish
```

PATCH

```
/api/ebooks/:id/unpublish
```

---

# BOOKMARKS

GET

```
/api/bookmarks
```

POST

```
/api/bookmarks/:ebookId
```

DELETE

```
/api/bookmarks/:ebookId
```

---

# PURCHASES

GET

```
/api/purchases
```

POST

```
/api/purchases/create-checkout-session
```

POST

```
/api/purchases/confirm
```

GET

```
/api/purchases/history
```

---

# WRITER

GET

```
/api/writer/my-ebooks
```

GET

```
/api/writer/sales-history
```

GET

```
/api/writer/dashboard-stats
```

---

# ADMIN

GET

```
/api/admin/users
```

PATCH

```
/api/admin/users/:id/role
```

DELETE

```
/api/admin/users/:id
```

---

GET

```
/api/admin/ebooks
```

PATCH

```
/api/admin/ebooks/:id/publish
```

PATCH

```
/api/admin/ebooks/:id/unpublish
```

DELETE

```
/api/admin/ebooks/:id
```

---

GET

```
/api/admin/transactions
```

---

GET

```
/api/admin/analytics
```

Response

```js
{
 totalUsers,
 totalWriters,
 totalRevenue,
 totalEbooksSold,
 monthlySales,
 genreDistribution
}
```

---

# Stripe Flow

User Clicks Buy
↓
Create Checkout Session
↓
Stripe Hosted Checkout
↓
Payment Success
↓
Webhook
↓
Purchase Record Created
↓
Transaction Record Created

---

# Business Rules

## Purchase

Cannot buy own ebook

Cannot purchase same ebook twice

Must be authenticated

---

## Ebook Visibility

Published:

Visible to everyone

Unpublished:

Visible only to writer and admin

---

## Role Rules

User

- Buy ebooks
- Bookmark ebooks

Writer

- Upload ebooks
- Edit ebooks
- View sales

Admin

- Full access

---

# Indexes

users.email

ebooks.title

ebooks.genre

ebooks.writerId

purchases.buyerId

purchases.ebookId

transactions.email

---

# Folder Structure

src/

├── routes/

├── controllers/

├── services/

├── middlewares/

├── models/

├── utils/

├── config/

├── validations/

├── constants/

└── server.js

---

# Environment Variables

PORT=

MONGODB_URI=

JWT_SECRET=

JWT_EXPIRES_IN=7d

STRIPE_SECRET_KEY=

STRIPE_WEBHOOK_SECRET=

IMGBB_API_KEY=

BETTER_AUTH_SECRET=

CLIENT_URL=

---

# Seed Admin

Email

admin@fable.com

Password

Admin@123

Role

admin

---

# Deployment Checklist

- MongoDB Atlas Connected
- CORS Configured
- JWT Secure
- Stripe Webhook Working
- Environment Variables Added
- No 404 On Refresh
- Production Tested
- Error Handling Implemented
- Validation Implemented
- Role Security Implemented