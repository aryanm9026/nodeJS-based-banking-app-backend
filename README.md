# Enterprise Banking Backend API 🏦

A high-integrity, transaction-oriented banking engine engineered with **Node.js**, **Express**, and **MongoDB**. This system implements a double-entry accounting principle through an immutable ledger, ensuring ACID compliance and absolute data consistency for financial operations.

## 🌟 Key Architectural Features

### 🛡️ Financial Integrity & Core Banking
* **ACID-Compliant Transactions**: Leverages MongoDB Managed Transactions (Sessions) to ensure that fund transfers are atomic—preventing "lost money" scenarios during partial failures.
* **Immutable Audit Ledger**: Implements a strict "Append-Only" architecture. Custom Mongoose middleware explicitly blocks `update` and `delete` operations on the ledger, ensuring a permanent and tamper-proof financial history.
* **Idempotency Engine**: Critical for distributed systems, the API utilizes `idempotencyKey` validation to prevent duplicate processing of the same transaction during network retries.
* **Real-Time Balance Derivation**: Balances are dynamically calculated via MongoDB Aggregation Pipelines across the ledger, ensuring the "Source of Truth" is always the transaction history rather than a static field.

### 🔒 Advanced Security
* **Stateless Authentication**: Secure JWT-based authentication with high-entropy secrets.
* **Token Lifecycle Management**: A dedicated Blacklist subsystem manages session invalidation, ensuring logged-out tokens cannot be weaponized.
* **Granular Authorization**: Role-based access control (RBAC) distinguishes between standard consumers and System Users for administrative funding.
* **Sensitive Data Masking**: Schemas are configured to automatically exclude sensitive fields like password hashes from all query results.

## 🛠️ Technology Stack
* **Runtime**: Node.js v20+
* **Framework**: Express.js (v5.2.1)
* **Database**: MongoDB with Mongoose ODM
* **Security**: Bcryptjs (Adaptive Hashing) & JWT
* **Communication**: Nodemailer with OAuth2 Integration

## 📊 API Reference

### Identity Management
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | `POST` | User onboarding & automated welcome dispatch |
| `/api/auth/login` | `POST` | Secure credential validation & session issuance |
| `/api/auth/logout` | `POST` | Immediate token revocation via Blacklist |

### Account Services
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/accounts/` | `POST` | Initialize a new multi-currency account |
| `/api/accounts/` | `GET` | List all verified accounts for the session user |
| `/api/accounts/balance/:id` | `GET` | Real-time balance derivation via Ledger analysis |

### Transaction Engine
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/transactions/` | `POST` | Inter-account fund transfer with Idempotency |
| `/api/transactions/system/initial-funds` | `POST` | Authorized liquidity injection for system accounts |

## ⚙️ Deployment & Configuration

### 1. Repository Initialization
```bash
git clone <repository-url>
cd nodeJS-based-banking-app-backend
npm install
```

## .env Configuration

### Server Config
PORT=3000
JWT_SECRET=your_high_entropy_secret

### Database Config
MONGO_URI=your_mongodb_connection_string

### Mail Server (OAuth2) Config
EMAIL_USER=your_service_account@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token

## Start the server
npm run dev

## Integrity Verification API
| `/` | `GET` | Verify the integrity of the server with a health check |

---
Developed as a practice project for backend in a form of a high-integrity highly-secure banking server.