# Spring Boot Backend

This is the backend for the Login functionality.

## Prerequisites
- Java 17 or higher
- Maven
- MySQL Database (`tsarit`) running on localhost:3306

## Setup Database
Ensure your MySQL has the database created:
```sql
CREATE DATABASE tsarit;
```

## Running the Application
1. Open a terminal in this `backend` folder.
2. Run:
   ```bash
   mvn spring-boot:run
   ```

## Endpoints
- **POST** `/api/auth/register`
  ```json
  {
    "username": "testuser",
    "password": "password123",
    "email": "test@example.com"
  }
  ```
- **POST** `/api/auth/login`
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
