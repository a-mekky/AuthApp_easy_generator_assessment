# Project Documentation

This project consists of two main components: **Backend** as `NestJS` and **Frontend** as `Vue`. Below is a summary of each component with links to their respective sections.

## Table of Contents
1. [Backend](#backend)
   - [Features](#backend-features)
   - [Installation](#backend-installation)
   - [API Endpoints](#backend-api-endpoints)
   - [Testing](#backend-testing)
2. [Frontend](#frontend)
   - [Features](#frontend-features)
   - [Installation](#frontend-installation)
   - [Usage](#frontend-usage)
   - [Testing](#frontend-testing)

---

## Backend

The backend is built using the [NestJS](https://nestjs.com/) framework and provides a robust and scalable solution for user authentication and management.

### [Features](#backend-features)
- Authentication (Signup, Login, Token Refresh, Logout)
- JWT-based security
- MongoDB integration
- API documentation with Swagger
- Logging with Winston

### [Installation](#backend-installation)
- Prerequisites: Node.js, MongoDB, npm
- Steps to set up and run the backend locally.
- The `.env` **Must** exist with the keys provied in the examples

### [API Endpoints](#backend-api-endpoints)
- Authentication endpoints (`/auth/signup`, `/auth/signin`, etc.)
- User profile protected endpoint (`/users/profile`)

### [Testing](#backend-testing)
- Unit tests

### [Deployment](#backend-deployment)
- Steps to build and deploy the backend for production.

---

## Frontend

The frontend is built using [Vue](https://vuejs.org/) and provides a user-friendly interface for interacting with the backend services.

### [Features](#frontend-features)
- User registration and login
- Token-based session management
- Responsive design

### [Installation](#frontend-installation)
- Prerequisites: Node.js, npm
- Steps to set up and run the frontend locally.

### [Usage](#frontend-usage)
- How to navigate and use the application.
