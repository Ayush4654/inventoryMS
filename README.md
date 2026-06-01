# Inventory & Order Management System

A full-stack inventory and order management application with real-time stock tracking, order processing, and dashboard analytics. Built with FastAPI + React + PostgreSQL.

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Python 3.11** | Core language |
| **FastAPI** | REST API framework with automatic OpenAPI docs |
| **SQLAlchemy** (async) | ORM with async session support |
| **Alembic** | Database schema migrations |
| **Pydantic** | Request/Response validation with email support |
| **Uvicorn** | ASGI server |
| **asyncpg** | PostgreSQL async driver |
| **PostgreSQL 15** | Primary database |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **TailwindCSS** | Utility-first CSS framework |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **Docker Compose v3.8** | Multi-service orchestration |
| **Docker Hub** | Backend image registry ([shuklasarvesh/inventoryms](https://hub.docker.com/r/shuklasarvesh/inventoryms)) |
| **Render** | Backend cloud deployment ([inventoryms-backend-q9z0.onrender.com](https://inventoryms-backend-q9z0.onrender.com)) |
| **Vercel** | Frontend cloud deployment ([frontend-rust-eight-57.vercel.app](https://frontend-rust-eight-57.vercel.app)) |
| **Nginx** | Production frontend server |
| **Git** | Version control |

## Features

- **Product Management** — CRUD operations with unique SKU validation and stock tracking
- **Customer Management** — Create and manage customers with unique email validation
- **Order Processing** — Atomic order creation with stock deduction, price snapshots, and rollback on failure
- **Order Cancellation** — Automatic stock restoration when orders are cancelled
- **Dashboard Analytics** — Real-time summary stats and low-stock product alerts (qty < 10)
- **Interactive API Docs** — Auto-generated Swagger UI at `/docs`
- **Responsive UI** — Clean dark sidebar layout with TailwindCSS

## Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry, CORS, router registration
│   │   ├── database.py          # Async SQLAlchemy engine + session
│   │   ├── models/              # Product, Customer, Order, OrderItem ORM
│   │   ├── schemas/             # Pydantic Create/Update/Response schemas
│   │   ├── crud/                # Database operation functions
│   │   └── routers/             # Products, Customers, Orders, Dashboard endpoints
│   ├── alembic/                 # Migration scripts
│   ├── alembic.ini
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/                 # Axios instance (reads VITE_API_URL)
│   │   ├── components/          # Navbar, Sidebar, Modal, Table, Button, Alert
│   │   └── pages/               # Dashboard, Products, Customers, Orders, OrderDetail
│   ├── Dockerfile
│   ├── nginx.conf               # SPA fallback for React Router
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

## Local Development

### Prerequisites

- Docker & Docker Compose
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ayush4654/inventoryMS.git
cd inventoryMS

# 2. Copy environment file and fill in values
cp .env.example .env

# 3. Build and run with Docker Compose
docker compose up --build
```

### Access the application

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000         |
| Backend  | http://localhost:8000         |
| API Docs | http://localhost:8000/docs    |

### Environment Variables (.env)

```
POSTGRES_DB=inventory_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword
CORS_ORIGINS=http://localhost:3000
```

### Run without Docker (Windows)

```bash
# Backend
cd backend
pip install -r requirements.txt
set DATABASE_URL=sqlite+aiosqlite:///./inventory.db
uvicorn app.main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev
```

## API Endpoints

| Method | Endpoint              | Description                        | Status Codes        |
|--------|-----------------------|------------------------------------|---------------------|
| POST   | `/products`           | Create a new product               | 201, 400            |
| GET    | `/products`           | List all products                  | 200                 |
| GET    | `/products/{id}`      | Get a single product               | 200, 404            |
| PUT    | `/products/{id}`      | Update a product (partial)         | 200, 400, 404       |
| DELETE | `/products/{id}`      | Delete a product                   | 200, 404            |
| POST   | `/customers`          | Create a new customer              | 201, 400            |
| GET    | `/customers`          | List all customers                 | 200                 |
| GET    | `/customers/{id}`     | Get a single customer              | 200, 404            |
| DELETE | `/customers/{id}`     | Delete a customer                  | 200, 404            |
| POST   | `/orders`             | Create an order (with stock check) | 201, 400, 404       |
| GET    | `/orders`             | List all orders                    | 200                 |
| GET    | `/orders/{id}`        | Get full order details             | 200, 404            |
| DELETE | `/orders/{id}`        | Cancel order & restore stock       | 200, 404            |
| GET    | `/dashboard`          | Get summary statistics             | 200                 |
| GET    | `/health`             | Health check                       | 200                 |

## Business Logic

1. **SKU uniqueness** — Each product SKU must be globally unique (400 error on duplicate)
2. **Email uniqueness** — Each customer email must be globally unique (400 error on duplicate)
3. **Stock validation** — Product quantity can never go below 0
4. **Order creation** — Validates customer existence, stock availability for ALL items atomically; deducts stock and snapshots unit prices; rejects entire order if any item lacks stock
5. **Order cancellation** — Restores stock for all items and deletes the order
6. **Low stock** — Products with quantity < 10 are flagged on the dashboard

## Database Models

```
Product   (id, name, sku*, price, quantity, created_at, updated_at)
Customer  (id, full_name, email*, phone, created_at)
Order     (id, customer_id, status[enum], total_amount, created_at)
OrderItem (id, order_id, product_id, quantity, unit_price)
```

*Fields marked with `*` are unique and indexed.

## Live URLs

| Service | URL |
|---------|-----|
| **Backend API** | [https://inventoryms-backend-q9z0.onrender.com](https://inventoryms-backend-q9z0.onrender.com) |
| **API Docs** | [https://inventoryms-backend-q9z0.onrender.com/docs](https://inventoryms-backend-q9z0.onrender.com/docs) |
| **Frontend** | [https://frontend-rust-eight-57.vercel.app](https://frontend-rust-eight-57.vercel.app) |
| **Docker Image** | [shuklasarvesh/inventoryms](https://hub.docker.com/r/shuklasarvesh/inventoryms) |

## Deployment

### Backend (Render — Docker Runtime)

1. Push to GitHub (auto-deploy enabled)
2. [Render Dashboard](https://dashboard.render.com) → **New Web Service** → connect repo
3. Root Directory: `backend`
4. Runtime: **Docker** (uses `backend/Dockerfile`)
5. Environment:
   - `DATABASE_URL` = Render PostgreSQL Internal URL
   - `CORS_ORIGINS` = `https://frontend-rust-eight-57.vercel.app`
6. Add **Render PostgreSQL** database, deploy

### Frontend (Vercel)

1. Push to GitHub (auto-deploy enabled)
2. [Vercel Dashboard](https://vercel.com) → **New Project** → connect repo
3. Root Directory: `frontend`
4. Framework: `Vite`
5. Build-time env: `vercel env add VITE_API_URL production` = `https://inventoryms-backend-q9z0.onrender.com`
6. Deploy

## Docker Commands

```bash
# Build and start
docker compose up --build

# Run in background
docker compose up --build -d

# Stop
docker compose down

# Reset database (deletes volume)
docker compose down -v

# Push backend image to Docker Hub
docker build -t shuklasarvesh/inventoryms:latest -f Dockerfile .
docker push shuklasarvesh/inventoryms:latest

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db
```
