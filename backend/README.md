# Expensio — Backend

Spring Boot 3.3 + Java 21 REST API for the Expensio expense tracker.

## Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 16 (or run via `docker-compose`)

## Quick Start

```bash
# 1. Copy env template
cp .env.example .env
# 2. Fill in your DB credentials in .env
# 3. Run
mvn spring-boot:run
```

## API Docs
Swagger UI available at: `http://localhost:8080/swagger-ui.html`

## Running Tests
```bash
mvn verify
```
Requires Docker running for Testcontainers (repository tests).
