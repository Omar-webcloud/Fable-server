# Fable Server

Backend API service for the Fable Ebook Sharing Platform.

## Live Deployment Link
https://fable-umber.vercel.app/

## Project Overview
This repository contains the backend server for the Fable platform. It manages user credentials, database persistence, payment logic, and administrative operations. The server exposes REST API endpoints that the frontend client consumes.

## Tech Stack
* Node.js for backend runtime execution
* Express.js for web framework routing
* MongoDB with Mongoose for database management
* JSON Web Tokens for user authorization
* Stripe SDK for processing credit card checkout payments
* Cookie Parser for reading cookie sessions
* CORS for configuring secure cross origin requests

## Database Collections
The database is structured into these key collections:
* users for storing user profile details and roles
* ebooks for tracking book listings, status, and pricing
* purchases for storing sales logs and Stripe session associations
* bookmarks for user wishlists
* transactions for financial reports

## Middleware Layers
The application enforces security using the following validation functions:
* verifyJWT to confirm the presence of valid user tokens
* verifyAdmin to restrict access to administrator functions
* verifyWriter to restrict access to creator actions
* verifyUser to validate standard customer actions

## Business Rules
The API enforces several key logical rules:
* Writers cannot buy their own ebooks
* Users cannot buy the same ebook multiple times
* Book content is hidden until purchase validation completes
* Unpublished ebooks are only visible to the creator and admins

## Directory Structure
The server architecture follows these patterns:
* src/routes for endpoint setup
* src/controllers for request and response logic
* src/services for business operations
* src/middlewares for request filters and guards
* src/models for schema definitions
* src/validations for request shape parsing

## Environment Configuration
Ensure the following environment variables are specified:
* PORT
* MONGODB_URI
* JWT_SECRET
* JWT_EXPIRES_IN
* STRIPE_SECRET_KEY
* STRIPE_WEBHOOK_SECRET
* IMGBB_API_KEY
* BETTER_AUTH_SECRET
* CLIENT_URL