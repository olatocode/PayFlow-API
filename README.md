<!-- @format -->

# PayFlow-API

A REST API for a fintech digital wallet — mobile-money style balances, top-ups, and peer-to-peer transfers.

Built with **Express 5**, **MongoDB/Mongoose**, and **JWT** authentication.

📄 **[Postman documentation →](https://documenter.getpostman.com/view/19291153/2sB2qahgYY)**

---

## Features

- **Auth** — registration, login, logout, and refresh-token rotation. Passwords hashed with bcrypt.
- **Wallets** — one wallet per user, created automatically on registration. Check balance, top up, transfer.
- **Transfers** — send money to any user by phone number, with balance and self-transfer checks. Recorded as transactions.
- **Transaction history** — every top-up and transfer the user is involved in, newest first.
- **User management** — list, view, update, soft-delete users, and count soft-deleted users.
- **Security & ops** — JWT guards, Joi request validation, Helmet headers, CORS, login rate limiting, Winston + Morgan logging, and a central error handler that hides internals in production.

## Tech Stack

| Layer | Choice |
| --- | --- |
| Runtime | Node.js (ES modules) |
| Framework | Express 5 |
| Database | MongoDB via Mongoose 8 |
| Auth | `jsonwebtoken`, `bcryptjs` |
| Validation | Joi 17 |
| HTTP middleware | `helmet`, `cors`, `morgan`, `express-rate-limit` |
| Logging | Winston |

## Requirements

- Node.js 18+ (ES modules)
- A running MongoDB instance (local or Atlas)

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Create your env file
cp .env.example .env        # PowerShell: Copy-Item .env.example .env

# 3. Fill in .env (see below)

# 4. Start the dev server (hot reload)
npm run dev
```

The server listens on `PORT` (defaults to `8000`) and only starts once MongoDB connects.

```bash
curl http://localhost:8000/
# {"message":"Welcome To PayFlow API!"}
```

### Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port to listen on. Falls back to `8000`. |
| `MONGO_URI` | **Yes** | MongoDB connection string. |
| `JWT_ACCESS_SECRET` | **Yes** | Secret used to sign access tokens. |
| `JWT_REFRESH_SECRET` | **Yes** | Secret used to sign refresh tokens. |
| `ACCESS_TOKEN_EXPIRES_IN` | **Yes** | Access token lifetime, e.g. `15m`. |
| `REFRESH_TOKEN_EXPIRES_IN` | **Yes** | Refresh token lifetime, e.g. `7d`. |
| `NODE_ENV` | No | `development` returns full stack traces; `production` returns sanitized errors. |

> `NODE_ENV` is not in `.env.example` — add it yourself if you want verbose error output locally.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Run the server (`node src/server.js`). |
| `npm run dev` | Run with `nodemon` for auto-restart on change. |

## API Reference

Base URL: `http://localhost:8000/api/v1`

Routes marked **auth** require a bearer token:

```
Authorization: Bearer <accessToken>
```

### Auth

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/users/auth/register` | – | Create a user and their wallet. Returns tokens. |
| `POST` | `/users/auth/login` | – | Exchange credentials for tokens. Rate limited. |
| `POST` | `/users/auth/logout` | – | Invalidate a refresh token. |
| `POST` | `/users/auth/refresh` | – | Rotate tokens using a valid refresh token. |

#### `POST /users/auth/register`

```json
{ "name": "Ada Lovelace", "phone_no": "08012345678", "email": "ada@example.com", "password": "secret123" }
```

`201 Created`

```json
{
  "message": "Registration Successful",
  "data": { "accessToken": "...", "refreshToken": "..." }
}
```

Validation rules: `name` and `phone_no` are required strings, `email` must be a valid email, `password` must be at least 6 characters.

#### `POST /users/auth/login`

```json
{ "email": "ada@example.com", "password": "secret123" }
```

**Rate limited to 3 attempts per IP per 5 minutes.**

#### `POST /users/auth/logout`

```json
{ "refreshToken": "..." }
```

Nulls the stored refresh token, so it can no longer be exchanged. Unknown tokens return `204`.

#### `POST /users/auth/refresh`

```json
{ "refreshToken": "..." }
```

Returns a **new** access token and a **new** refresh token; the old refresh token is invalidated.

### Wallets

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/wallets/balance` | ✓ | Current balance and wallet ID. |
| `POST` | `/wallets/topup` | ✓ | Add funds. Body: `{ "amount": 5000 }`. |
| `POST` | `/wallets/transfer` | ✓ | Send funds to a phone number. |

#### `POST /wallets/transfer`

```json
{ "phone_no": "08098765432", "amount": 1500 }
```

Fails with `404` if the receiver doesn't exist, `400` if you're sending to yourself, and `400` on insufficient balance.

### Transactions

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/transactions/history` | ✓ | All transfers and top-ups involving you, newest first. |

Returns sender/receiver phone numbers rather than full user objects.

### Users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/users` | – | List all users (soft-deleted included). Password excluded. |
| `GET` | `/users/deleted` | – | Count of soft-deleted users. |
| `GET` | `/users/:id` | – | Fetch one user. Password excluded. |
| `PUT` | `/users/:id` | – | Update a user with the raw request body. |
| `DELETE` | `/users/:id` | – | Soft-delete a user (sets `isDeleted`, `deletedAt`). |

Responses use `{ status: 'success', message, data }`.

> **Note:** the user endpoints are currently unauthenticated, `PUT /users/:id` takes an unvalidated body and returns the password hash, and `GET /users` does not filter out soft-deleted users. Treat these routes as unfinished and don't expose them publicly.

## Data Model

```
User
  name, phone_no, email (unique), password (hashed)
  isDeleted, deletedAt          -- soft delete
  refreshToken                  -- single active session token
  wallet -> Wallet

Wallet
  user -> User
  balance (Number, default 0)

Transaction
  sender -> User, receiver -> User
  amount (Number)
  type ('transfer' | 'top-up')
  timestamp (Date)
```

A user has exactly one wallet, created automatically during registration.

## Project Structure

```
src/
├── app.js                 # Express app: middleware, routes, error handling
├── server.js              # MongoDB connection + listen
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── walletController.js
│   └── transactionController.js
├── models/                # Mongoose schemas
│   ├── User.js
│   ├── Wallet.js
│   └── transaction.js
├── routes/                # Route definitions
│   ├── authRoute.js
│   ├── userRoute.js
│   ├── walletRoute.js
│   └── transactionRoute.js
├── middlewares/
│   ├── auth.js            # JWT verification
│   ├── validate.js        # Joi request validation
│   └── rateLimiter.js     # Login rate limiting
├── validation/            # Joi schemas
│   ├── userSchema.js
│   └── transactionSchema.js
└── utils/
    ├── AppError.js
    ├── errorHandler.js    # 404 + centralized error handler
    ├── generateToken.js
    └── logger.js          # Winston
```

## Error Handling

Unhandled routes return `404`. Operational errors respond with `{ status, message }`; programming errors are logged server-side and return a generic `Something went wrong!` so internals never leak. Set `NODE_ENV=development` for stack traces.

## Known Gaps

- No automated tests — `npm test` is a placeholder.
- `/users` CRUD endpoints have no authorization checks; `PUT /users/:id` leaks the password hash.
- Wallet top-up has no payment-gateway integration; it's a direct balance credit.
- Transfers update both wallets in sequence rather than in a MongoDB transaction, so a failure between the two saves can leave balances inconsistent.

## License

[MIT](LICENSE)

## Author

Tobi Awosola — [@olatocode](https://github.com/olatocode)