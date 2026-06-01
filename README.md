# Inventory & Order Management System

A full-stack inventory and order management system built with FastAPI, React, PostgreSQL, and Docker.

## Tech Stack

| Layer       | Technology                                         |
|-------------|----------------------------------------------------|
| Backend     | Python 3.11, FastAPI, SQLAlchemy (async), Alembic  |
| Frontend    | React 18, Vite, Axios, React Router v6, TailwindCSS |
| Database    | PostgreSQL 15                                      |
| Container   | Docker + Docker Compose v3.8                       |
| Deployment  | Backend → Render, Frontend → Vercel                |

---

## Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── main.py           # FastAPI entry point
│   │   ├── database.py       # Async engine + session
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── crud/             # Database operations
│   │   └── routers/          # API route handlers
│   ├── alembic/              # Database migrations
│   ├── alembic.ini
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance
│   │   ├── components/       # Reusable UI components
│   │   └── pages/            # Route pages
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Local Development

### Prerequisites

- Docker & Docker Compose installed
- Git

### Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd inventory-system

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

---

## API Endpoints

| Method | Endpoint              | Description                        |
|--------|-----------------------|------------------------------------|
| POST   | `/products`           | Create a new product               |
| GET    | `/products`           | List all products                  |
| GET    | `/products/{id}`      | Get a single product               |
| PUT    | `/products/{id}`      | Update a product (partial)         |
| DELETE | `/products/{id}`      | Delete a product                   |
| POST   | `/customers`          | Create a new customer              |
| GET    | `/customers`          | List all customers                 |
| GET    | `/customers/{id}`     | Get a single customer              |
| DELETE | `/customers/{id}`     | Delete a customer                  |
| POST   | `/orders`             | Create an order (with stock check) |
| GET    | `/orders`             | List all orders                    |
| GET    | `/orders/{id}`        | Get order details                  |
| DELETE | `/orders/{id}`        | Cancel order & restore stock       |
| GET    | `/dashboard`          | Get summary statistics             |
| GET    | `/health`             | Health check                       |

---

## Business Logic

1. **SKU uniqueness** — Each product SKU must be globally unique (400 error on duplicate)
2. **Email uniqueness** — Each customer email must be globally unique (400 error on duplicate)
3. **Stock validation** — Product quantity can never go below 0
4. **Order creation** — Validates customer existence, stock availability for ALL items atomically; deducts stock and snapshots unit prices; rejects entire order if any item lacks stock
5. **Order cancellation** — Restores stock for all items and deletes the order
6. **Low stock** — Products with quantity < 10 are flagged on the dashboard

---

## Backend Deployment (Render)

1. Push the repository to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com) → **New Web Service**
3. Connect your repository and set **Root Directory** to `backend`
4. Configure:

   | Setting         | Value                                                  |
   |-----------------|--------------------------------------------------------|
   | Build Command   | `pip install -r requirements.txt`                      |
   | Start Command   | `uvicorn app.main:app --host 0.0.0.0 --port $PORT`    |
   | Python Version  | 3.11                                                   |

5. Add the following **Environment Variables**:

   | Variable       | Value                                                    |
   |----------------|----------------------------------------------------------|
   | `DATABASE_URL` | `postgresql+asyncpg://user:pass@host:5432/inventory_db` |
   | `CORS_ORIGINS` | `https://your-frontend.vercel.app`                       |

6. Create a **Render PostgreSQL** database and copy the Internal Connection String
7. Deploy

---

## Frontend Deployment (Vercel)

1. Push the repository to GitHub
2. Go to [Vercel Dashboard](https://vercel.com) → **New Project**
3. Connect your repository and set **Root Directory** to `frontend`
4. Set **Framework Preset** to `Vite`
5. Add environment variable:

   | Variable        | Value                                  |
   |-----------------|----------------------------------------|
   | `VITE_API_URL`  | `https://your-backend.onrender.com`    |

6. Deploy

---

## Docker Commands

```bash
# Build and start all services
docker compose up --build

# Start in detached mode
docker compose up --build -d

# Stop all services
docker compose down

# Stop and remove volumes (resets database)
docker compose down -v

# View logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f db

# Rebuild a single service
docker compose build backend
docker compose build frontend
```
