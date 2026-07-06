## BOOST GURU SMM

A full-stack SMM (Social Media Marketing) panel. Users buy social media growth services (followers, likes, views, etc.), fund their wallet via manual UPI transfer, and track orders — while admins manage services, providers, users, notices, and transactions from a dedicated dashboard.

**Stack:** React + Tailwind (frontend) · Node.js + Express + MongoDB (backend)

## Features

- **JWT authentication** — register, login, email OTP-based forgot/reset password
- **Multi-provider order routing** — orders are automatically routed to one of several upstream SMM providers (Peakerr, JAP, WorldOfSMM) through a shared provider registry, so adding a new provider requires no changes to order logic
- **Service catalog** — categories and services synced from providers or managed manually, with search and filtering
- **Wallet & manual payments** — users add funds via manual UPI transfer with UTR verification; admins approve/reject deposits from the transactions panel
- **Order management** — place orders, track status (pending/processing/completed/cancelled/partial), view start count and remaining count
- **Notices** — admin-published announcements shown in a user-facing feed
- **Admin dashboard** — manage users, services, categories, notices, orders, and transactions, with cross-model transaction search and site settings (currency, min deposit, maintenance mode)
- **Rate limiting & validation** — dedicated limiters for auth/payment routes and request validation via `express-validator`

## Project Structure

```txt
smm-panel/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers (auth, user, order, service, category, notice, payment, admin)
│   ├── middleware/      # protect, adminOnly, error handling, rate limiting, validation
│   ├── models/          # User, Service, Category, Order, Transaction, Notice, Settings
│   ├── providers/       # Provider registry + per-provider clients (Peakerr, JAP, WorldOfSMM)
│   ├── routes/          # Express routers, mounted under /api
│   ├── Emailverify/     # OTP and contact-form mail senders
│   ├── utils/           # apiResponse helpers, JWT signing, sendEmail
│   └── server.js
└── frontend/
    └── src/
        ├── api/          # Axios client + endpoint calls
        ├── components/   # admin/, common/, user/ UI components
        ├── context/      # AuthContext
        ├── hooks/        # useAuth, useFetch
        ├── pages/        # admin/, public/, user/ pages
        ├── routes/       # AppRoutes, ProtectedRoute, AdminRoute, PublicRoute
        └── store/        # Zustand auth store
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`.

### Backend environment variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smm-panel
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d

# Provider APIs (each is optional — if a key is empty, orders routed to
# that provider fail gracefully instead of crashing)

PEAKERR_API_KEY=
PEAKERR_API_URL=https://peakerr.com/api/v2

JAP_API_KEY=
JAP_API_URL=https://justanotherpanel.com/api/v2

WORLDOFSMM_API_KEY=
WORLDOFSMM_API_URL=https://worldofsmm.com/api/v2

FRONTEND_URL=http://localhost:5173

# SMTP (used for OTP emails)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=no-reply@smmpanel.local


# contact us 
EMAIL_USER=your gmail
EMAIL_PASS=your gmail app pass

NODE_ENV=development
```


## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

### Frontend environment variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

Backend:

```bash
npm run dev     # nodemon
npm run start   # node server.js
npm run build   # syntax check
```

Frontend:

```bash
npm run dev
npm run start
npm run build
```

## API Response Format

All API routes return:

```json
{
  "success": true,
  "message": "Message",
  "data": {}
}
```

## Main Routes

**Auth** — `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`

**User** — `GET/PUT /api/user/profile`, `GET /api/user/balance`, `GET /api/user/dashboard`, `POST /api/user/api-key/regenerate`, `POST /api/user/forgot-password`, `POST /api/user/verify-otp`, `POST /api/user/change-password`, `POST /api/user/contact`

**Services** — `GET /api/services`, `GET /api/services/:id`

**Categories** — `GET /api/categories`, `GET /api/categories/:id`

**Notices** — `GET /api/notices` (authenticated feed)

**Orders** — `POST /api/orders/new`, `GET /api/orders/my`, `GET /api/orders/:id`

**Payment** — `POST /api/payment/deposit`, `POST /api/payment/verify`, `GET /api/payment/my`

**Admin** (all under `/api/admin`, requires admin role):
`GET /dashboard` · `GET/POST/PUT/DELETE /users` · `GET/POST/PUT/DELETE /services` · `GET/POST/PUT/DELETE /categories` · `GET/POST/PUT/DELETE /notices` · `GET/PUT/DELETE /orders` · `GET/PUT/DELETE /transactions` · `GET/PUT /settings`

## Order Provider Routing

Each `Service` document has a `providerName` (`Peakerr`, `JAP`, `WorldOfSMM`, or `Manual`). When an order is placed, `providers/index.js` looks up the matching provider client and forwards the order — no branching logic lives in `orderController.js`. To add a new provider:

1. Create `providers/<name>Provider.js`, reusing `createSmmApiProvider()` from `smmApiProviderFactory.js` if the panel follows the standard SMM Panel API v2 spec (as Peakerr, JAP, and WorldOfSMM do).
2. Register it in `providers/index.js`.
3. Add its name to the `providerName` enum in `models/Service.js` and to the validator in `routes/adminRoutes.js`.