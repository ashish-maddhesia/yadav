# Express.js CI/CD & AWS EC2 Learning Demo 🚀

A clean, production-ready Express.js REST API with PostgreSQL integration designed to help you learn CI/CD pipelines using GitHub Actions and AWS EC2 deployment.

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Database Driver:** `pg` (node-postgres with parameterized queries)
- **Configuration:** `dotenv`
- **Process Manager:** PM2 (for AWS EC2 deployment)
- **CI/CD:** GitHub Actions

---

## 📁 Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions CI/CD pipeline
├── routes/
│   └── password.js      # Password API route handlers
├── .env.example         # Template for environment variables
├── .gitignore           # Git ignore rules
├── db.js                # PostgreSQL connection pool configuration
├── package.json         # Project metadata and dependencies
├── README.md            # Documentation
└── server.js            # Main Express application entry point
```

---

## 🛢 PostgreSQL Table Schema

Connect to your PostgreSQL server and execute the following SQL command to create the required table:

```sql
CREATE TABLE passwords (
    id SERIAL PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐳 Quick Start with Docker (Recommended)

If you don't have PostgreSQL installed or running locally, start PostgreSQL instantly with Docker Compose:

```bash
docker compose up -d
```
This command automatically starts a PostgreSQL 15 container on port `5432` with database `cicd_demo_db`, password `ashish`, and auto-executes `init.sql` to create the `passwords` table.

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) OR local PostgreSQL server

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your PostgreSQL credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=8000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=cicd_demo_db
```

### 4. Start the Application
```bash
npm start
```
The server will start at `http://localhost:8000`.

---

## 📡 API Endpoints & Usage

### 1. Welcome Route
- **Method:** `GET`
- **Path:** `/`
- **Response:** `Hi from CI/CD Demo 🚀`

```bash
curl http://localhost:8000/
```

---

### 2. Health Check
- **Method:** `GET`
- **Path:** `/health`
- **Response:**
  ```json
  {
    "status": "OK",
    "uptime": "12.34 seconds"
  }
  ```

```bash
curl http://localhost:8000/health
```

---

### 3. Store a Password
- **Method:** `POST`
- **Path:** `/password`
- **Body:**
  ```json
  {
    "password": "hello123"
  }
  ```
- **Response:**
  ```json
  {
    "id": 1,
    "password": "hello123",
    "created_at": "2026-07-29T10:00:00.000Z"
  }
  ```

```bash
curl -X POST http://localhost:8000/password \
  -H "Content-Type: application/json" \
  -d '{"password": "hello123"}'
```

---

### 4. Get All Passwords
- **Method:** `GET`
- **Path:** `/passwords`
- **Response:** Array of stored password objects.

```bash
curl http://localhost:8000/passwords
```

---

### 5. Delete a Password by ID
- **Method:** `DELETE`
- **Path:** `/password/:id`
- **Response:**
  ```json
  {
    "message": "Password deleted successfully",
    "deleted": {
      "id": 1,
      "password": "hello123",
      "created_at": "2026-07-29T10:00:00.000Z"
    }
  }
  ```

```bash
curl -X DELETE http://localhost:8000/password/1
```

---

## ☁️ AWS EC2 & PM2 Setup Guide

### 1. Connect to your EC2 Ubuntu Instance
```bash
ssh -i /path/to/your-key.pem ubuntu@<YOUR_EC2_PUBLIC_IP>
```

### 2. Install Node.js & Git on EC2
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git
```

### 3. Install PM2 Globally
```bash
sudo npm install -g pm2
```

### 4. Clone Your Repository on EC2
```bash
cd ~
git clone https://github.com/<your-username>/<your-repo-name>.git ci-cd
cd ci-cd
npm install
```

### 5. Create `.env` on EC2
Create the `.env` file with your production database credentials:
```bash
nano .env
```

### 6. Initial PM2 Start
```bash
pm2 start server.js --name "express-app"
pm2 save
pm2 startup
```

---

## ⚙️ GitHub Actions CI/CD Configuration

The repository includes `.github/workflows/deploy.yml` which automatically deploys changes to your EC2 instance on every `git push origin main`.

### Required GitHub Secrets
Go to **GitHub Repository** -> **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**:

| Secret Name | Description | Example |
| :--- | :--- | :--- |
| `EC2_HOST` | Public IP or DNS of your AWS EC2 instance | `54.210.12.34` |
| `EC2_USERNAME` | SSH SSH username (default for Ubuntu is `ubuntu`) | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH Key contents (`.pem` file text) | `-----BEGIN OPENSSH PRIVATE KEY----- ...` |
| `TARGET_DIR` | Directory on EC2 where app is located | `/home/ubuntu/ci-cd` |

---

## 🔒 Security Best Practices
1. **Parameterized Queries:** All SQL queries use `$1`, `$2` positional parameters to prevent SQL injection vulnerabilities.
2. **Environment Variables:** Confidential values (DB credentials, ports) are managed outside source control via `.env`.
3. **Graceful Shutdown:** The server releases PostgreSQL connection pool resources cleanly on shutdown signals (`SIGINT`/`SIGTERM`).
CI/CD Test
Pipeline Test Thu Jul 30 12:30:30 AM IST 2026
