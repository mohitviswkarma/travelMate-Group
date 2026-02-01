# Travel Matching Backend

A **Java Core** backend for matching like-minded people to travel together. based on destination, budget, date range, and interests.

This project uses:

* **Java 11**
* **Embedded Tomcat** (no external server)
* **Hibernate + PostgreSQL**
* **JWT-based authentication**
* **Docker & Docker Compose**

The application is packaged as a **single executable JAR** and is fully containerized.

---

## 📁 Project Structure

```
travel-matching-backend/
│
├── Dockerfile              # Docker image definition (multi-stage build)
├── docker-compose.yml      # Backend + PostgreSQL setup
├── .dockerignore
│
├── pom.xml                 # Maven configuration
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/travelmate/
│   │   │       ├── application/   # App bootstrap (embedded Tomcat)
│   │   │       ├── controller/    # REST APIs
│   │   │       ├── service/       # Business logic
│   │   │       ├── repository/    # Hibernate DAOs
│   │   │       ├── entity/        # JPA entities
│   │   │       ├── security/      # JWT, auth filters
│   │   │       └── util/
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── hibernate.cfg.xml
│   │       └── log4j2.xml
│   └── test/
│
└── README.md
```

---

## 🐳 Docker Setup

This project uses **Docker Compose** to run:

* Backend (Java JAR + Embedded Tomcat)
* PostgreSQL database

No local Java, Maven, or PostgreSQL installation is required when using Docker.

---

## 🔧 Prerequisites

Make sure you have the following installed:

* **Docker** (v20+)
* **Docker Compose** (v2+)

Verify:

```bash
docker --version
docker compose version
```

---

## 🏗 Build & Run (Docker)

### 1️⃣ Build and start all services

```bash
docker compose up --build
```

This will:

* Build the backend JAR using Maven (inside Docker)
* Start PostgreSQL
* Start the backend server

Backend will be available at:

```
http://localhost:8080
```

---

### 2️⃣ Run in background (detached mode)

```bash
docker compose up -d
```

---

### 3️⃣ View logs

```bash
# Backend logs
docker logs travelmate-backend

# Database logs
docker logs travelmate-db
```

---

### 4️⃣ Stop services

```bash
docker compose down
```

This stops containers but **keeps database data** (Docker volume).

---

### 5️⃣ Stop and remove everything (including DB data)

```bash
docker compose down -v
```

⚠️ This will delete all PostgreSQL data.

---

## 🔄 Rebuild Only Backend

Useful during development when DB schema is unchanged.

```bash
docker compose build backend
docker compose up -d backend
```

---

## ⚙ Environment Variables

These are defined in `docker-compose.yml` and consumed by the application:

```yaml
DB_URL=jdbc:postgresql://postgres:5432/travelmate
DB_USERNAME=travelmate
DB_PASSWORD=travelmate
JWT_SECRET=super-secret-key
```

They are mapped in `application.properties`:

```properties
db.url=${DB_URL}
db.username=${DB_USERNAME}
db.password=${DB_PASSWORD}

jwt.secret=${JWT_SECRET}
```

---

## 🧪 Local Run (Without Docker)

If you want to run locally:

```bash
mvn clean package
java -jar target/travel-matching-backend.jar
```

Make sure PostgreSQL is running and DB configs are correct.

---

## 🚀 Next Steps

* Add embedded Tomcat bootstrap (`Application.java`)
* Add health check endpoint (`/health`)
* Implement Auth APIs (Register/Login)
* Design matching algorithm (destination, date, budget)

---

## 👨‍💻 Hackathon Notes

* Single executable JAR
* Zero framework magic
* Easy to demo on any system
* Clean, recruiter-friendly architecture

---

**Author:** TravelMate Team
