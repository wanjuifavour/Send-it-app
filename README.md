# SendIT - Parcel Delivery System

A modern parcel delivery management system that allows users to create and track delivery orders with real-time notifications and map integration.

## Features

### User Management
- User registration and authentication
- JWT-based authentication
- Secure password encryption
- Welcome email for new users
- Admin and regular user roles

### Parcel Management
- Admin creation of parcel delivery orders
- Parcel status tracking and updates
- Separate views for sent and received parcels
- Real-time status notifications (Email/SMS)
- Google Maps integration for delivery tracking
- Search functionality
- Paginated results

### Admin Features
- Create delivery orders
- Update parcel delivery status
- Manage user accounts
- Access to system analytics

### Technical Features
- Real-time email notifications
- Background service for email processing
- Soft delete implementation
- Input validation using JOI
- Error handling with status codes
- Stored procedures for database operations

## Technology Stack

### Frontend
- React.js
- Google Maps API
- Material-UI/Tailwind CSS (for styling)
- Axios (for API calls)

### Backend
- Node.js
- Express.js
- JWT for authentication
- JOI for validation
- SQL Server/MySQL (with stored procedures)
- Background service worker for emails

### Database
- Stored procedures for all database operations
- Soft delete implementation
- Database helpers for common operations

## Project Structure

```
📦 sendit
 ┣ 📂 frontend
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┣ 📂 pages
 ┃ ┃ ┣ 📂 services
 ┃ ┃ ┗ 📂 utils
 ┃ ┃ 
 ┃ ┗ 📜 package.json
 ┣ 📂 backend
 ┃ ┃
 ┃ ┣ 📂 config
 ┃ ┣ ┗ 📜 database.js
 ┃ ┃
 ┃ ┣ 📂 Controllers 
 ┃ ┃ ┣ 📜 parcelController.js
 ┃ ┃ ┗ 📜 userController.js
 ┃ ┃
 ┃ ┣ 📂 middlewares
 ┃ ┃   ┣ 📜 auth.js
 ┃ ┃   ┣ 📜 errorHandler.js
 ┃ ┃   ┗ 📜 validation.js
 ┃ ┃
 ┃ ┣ 📂 routes
 ┃ ┃   ┣ 📜 parcelRoutes.js
 ┃ ┃   ┗ 📜 userRoutes.js
 ┃ ┃
 ┃ ┣ 📂 services
 ┃ ┃   ┣ 📜 emailQueue.js
 ┃ ┃   ┗ 📜 emailService.js
 ┃ ┃
 ┃ ┣ 📜 .env
 ┃ ┃
 ┃ ┣ 📜 package.json
 ┃ ┃
 ┃ ┗ 📜 server.js
 ┗ 📜 README.md
```