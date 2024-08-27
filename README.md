# Finance-hub

Finance-hub is a web application for personal finance management. It allows users to track their income, expenses, and view financial insights through a user-friendly dashboard.

Check-out it here:https://finance-4qgqjxpvf-peteris-projects.vercel.app/

## Features

- User registration and authentication
- Dashboard with financial overview
- Transaction tracking (income and expenses)
- Monthly financial breakdown

## Tech Stack

- Frontend: React.js with Tailwind CSS
- Backend: Laravel (PHP)
- Database: PostgreSQL

## Getting Started

### Prerequisites

- Node.js and npm
- PHP 8.2+
- Composer
- PostgreSQL

### Installation

1. Clone the repository
2. Set up the backend:
   ```
   cd back-end
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   ```
3. Set up the frontend:
   ```
   cd front-end
   npm install
   touch .env(with content of:REACT_APP_BACKEND_URL=http://127.0.0.1:8000)
    
   ```

4. Start the backend server:
   ```
   php artisan serve
   ```

5. Start the frontend development server:
   ```
   npm start
   ```

Visit `http://localhost:3000` to access the application.
