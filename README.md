# SMM Pulse Panel

Full-stack SMM panel with a React + Tailwind frontend and Node.js + Express + MongoDB backend.

## Structure

```txt
smm-panel/
├── frontend/
└── backend/
```

## Backend Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed:admin
npm run dev
```

Backend runs on `http://localhost:5000`.

Default admin:

```txt
admin@smmpanel.com
Admin@123
```

Required backend environment variables:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smm-panel
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
PEAKERR_API_KEY=
PEAKERR_API_URL=https://peakerr.com/api/v2
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

If `PEAKERR_API_KEY` is empty, provider orders are queued safely for manual processing. If Razorpay keys are empty, deposits run in local/manual verification mode.

## Frontend Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs on `http://localhost:5173`.

Required frontend environment variables:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY=
```

## Scripts

Backend:

```bash
npm run dev
npm run start
npm run build
npm run seed:admin
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

Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`

User: `/api/user/profile`, `/api/user/balance`, `/api/user/dashboard`

Services: `/api/services`, `/api/services/:id`

Categories: `/api/categories`

Orders: `/api/orders/new`, `/api/orders/my`, `/api/orders/:id`

Payment: `/api/payment/deposit`, `/api/payment/verify`

Admin: `/api/admin/dashboard`, `/api/admin/users`, `/api/admin/services`, `/api/admin/categories`, `/api/admin/orders`, `/api/admin/transactions`, `/api/admin/settings`
