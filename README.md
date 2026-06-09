# Medipath Diagnostics — Full-Stack Platform

A production-ready MERN stack healthcare web platform built on a **Middleman Proxy Architecture** that shields the legacy hospital LIS from the public internet.

## Architecture

```
[React Frontend :5173] ──HTTPS──► [Express Proxy :5000] ◄── POST /webhook ── [Hospital LIS]
                                          │                 │
                                    [MongoDB Atlas]   [Cloudinary CDN]
```

## Project Structure

```
medipath mdn/
├── client/   # React 18 + Vite + Tailwind CSS v4 + Framer Motion
└── server/   # Node.js ESM + Express + Mongoose
```

## Quick Start

### 1. Server
```bash
cd server
# Copy .env.example to .env and fill in your values
npm run dev     # Starts on http://localhost:5000
```

### 2. Client
```bash
cd client
npm run dev     # Starts on http://localhost:5173
```

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/tests` | Get all tests (from local cache) |
| GET | `/api/tests?search=` | Search tests |
| GET | `/api/tests/categories` | Get test categories |
| POST | `/api/bookings` | Create a booking |
| GET | `/api/bookings/:id` | Get booking by ID |
| POST | `/api/prescriptions/upload` | Upload prescription to Cloudinary |
| GET | `/api/reports/lookup` | Lookup report by billNo + mobile |
| POST | `/api/reports` | Create/update a report entry |
| **POST** | **`/api/webhook/lab-sync`** | **LIS sync webhook (requires x-webhook-secret)** |

## Webhook Usage (for Hospital LIS Team)

Send a `POST` to `/api/webhook/lab-sync` with:

**Headers:**
```
x-webhook-secret: <your WEBHOOK_SECRET value>
Content-Type: application/json
```

**Body:**
```json
{
  "tests": [
    { "name": "Complete Blood Count", "code": "CBC", "price": 350, "category": "Haematology", "turnaroundHours": 6 },
    { "name": "Lipid Profile", "code": "LIP", "price": 650, "category": "Biochemistry", "turnaroundHours": 12 }
  ]
}
```

## Environment Variables

See `server/.env.example` for all required variables.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS v4, Framer Motion, Axios, React Router v6, Lucide React, qrcode.react
- **Backend:** Node.js (ESM), Express.js, Mongoose, Multer, Cloudinary v2, JWT, bcryptjs, Nodemailer, Helmet, Morgan
- **Database:** MongoDB Atlas
- **Storage:** Cloudinary (prescriptions)
