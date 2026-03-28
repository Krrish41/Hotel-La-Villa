# Hotel La Villa

A full-stack hotel booking and management system built with React, Node.js, Express, and MySQL.

This project combines a customer-facing hotel website with an admin dashboard. Guests can browse rooms, search by stay dates, add amenities, place bookings, and submit feedback. Managers can log in to a protected dashboard to monitor bookings, room availability, amenity revenue, and guest feedback.

## Project Overview

The repository is split into two main parts:

- `src/` contains the React frontend.
- `backend/` contains the Node.js + Express backend.

At a high level:

- React handles the UI, routing, forms, client-side state, and API calls.
- Node/Express handles REST APIs, authentication, database access, analytics logic, and CRUD operations.
- MySQL stores booking and feedback data.

## Main Features

- Landing page with hotel branding and video hero section
- Room discovery flow with date selection and room recommendations
- Individual booking pages for four room categories
- Amenity selection with dynamic pricing
- Booking submission stored in MySQL
- Feedback form stored in MySQL
- Admin login with JWT-based protection
- Admin dashboard with weekly sales and availability metrics
- Amenity earnings breakdown and booking-level amenity statistics
- Booking search, filter, edit, delete, and CSV export for admins
- Room ratings page and operational overview pages

## Tech Stack

### Frontend

- React 18
- React Router DOM
- React Datepicker
- Create React App
- Plain CSS and inline styling for page-specific UI

### Backend

- Node.js
- Express 5
- MySQL2
- JSON Web Token (`jsonwebtoken`)
- CORS
- Dotenv

### Database

- MySQL

## React Frontend Work

The React application is responsible for the full client experience, from guest browsing to admin operations.

### 1. Routing and Application Structure

The frontend uses `BrowserRouter` and `Routes` to move between public and protected pages.

Key public routes include:

- `/` - home page
- `/aboutus` - about page
- `/booking` - booking search page
- `/dining`, `/spa`, `/swimming`, `/gym` - amenities pages
- `/b1`, `/b2`, `/b3`, `/b4` - detailed room booking pages
- `/feedback` - guest feedback form
- `/login` - admin login

Protected admin routes include:

- `/dashboard`
- `/amenities`
- `/roomratings`
- `/userdetails`

### 2. Customer Booking Flow

The booking experience is implemented in multiple React components:

- `HotelSearch.js`
  - Collects check-in and check-out dates using `react-datepicker`
  - Lets the user choose room type and rating preference
  - Saves the latest search in `localStorage`

- `HotelList.js`
  - Displays a recommended room based on the selected room type
  - Shows alternative room options
  - Passes selected dates to detailed booking pages using router state

- `bookpage1.jsx`, `bookpage2.jsx`, `bookpage3.jsx`, `bookpage4.jsx`
  - Represent the four room categories
  - Show room images, descriptions, and amenity options
  - Calculate total price dynamically from room base price and selected amenities
  - Collect guest details such as name, email, and phone number
  - Submit booking data to the backend using `fetch`

### 3. Frontend State Management

The app primarily uses React hooks:

- `useState` for form values, modal states, chart data, filters, and booking tables
- `useEffect` for API calls, page initialization, auto-refresh logic, and carousel behavior

There is no external state management library. For lightweight persistence, the app uses:

- `localStorage` for the last room search
- `localStorage` for the admin JWT token

### 4. Feedback and Guest Interaction

The feedback module is implemented in `Feedback.jsx` and allows guests to:

- Rate amenities
- Rate hospitality
- Leave comments
- Submit feedback to the backend API

### 5. Admin Interface in React

The admin side is one of the major React contributions in this project.

#### Admin Login

- `AdminLogin.jsx` sends login credentials to the backend
- On successful login, the received JWT is stored in `localStorage`
- The user is redirected to the dashboard

#### Protected Routes

- `ProtectedRoute.jsx` blocks access to admin pages if no token is present
- It also clears the token when the tab becomes hidden or the page unloads

#### Dashboard

- `R_Admin.js` loads:
  - weekly sales
  - room availability
  - staff availability
  - booking history
  - guest feedback
- Google Charts is loaded dynamically to visualize room availability and ratings
- Dashboard data refreshes automatically every 5 seconds

#### Amenities Analytics

- `R_Amenities.js` displays total amenity earnings
- Shows individual breakdowns for:
  - Spa
  - Gym
  - Breakfast
  - Airport Transfer
- Allows admins to open a modal and inspect bookings connected to a specific amenity

#### Booking Management

- `UserDetailTab.jsx` gives admins a searchable booking table
- Supports filtering by:
  - name
  - email
  - phone
  - room type
  - check-in date
  - check-out date
- Supports:
  - inline editing
  - deleting bookings
  - exporting bookings to CSV

#### Room Ratings

- `R_RoomRatings.js` displays room ratings in a simple dashboard view

## Node.js / Express Backend Work

The backend is located in `backend/index.js` and is written using ES modules.

### 1. API Server Setup

The Node server:

- creates an Express app
- enables CORS so the React frontend can communicate with it
- parses JSON request bodies
- loads environment variables using `dotenv`
- listens on port `5000` by default

### 2. Database Integration

The backend uses `mysql2/promise` to connect to MySQL.

Environment variables are used for:

- database host
- database user
- database password
- database name
- JWT secret
- server port

### 3. Booking API

`POST /api/bookings`

This route:

- validates incoming guest booking data
- inserts bookings into the `bookings` table
- stores selected amenities as JSON
- returns success or failure responses to the React frontend

### 4. Feedback API

`POST /api/feedback`

This route:

- accepts guest ratings and comments
- validates required fields
- inserts the response into the `feedback` table

### 5. Admin Authentication

`POST /api/admin-login`

This route:

- checks admin credentials
- creates a JWT token
- returns the token to the React admin login page

Protected routes use middleware that:

- reads the `Authorization: Bearer <token>` header
- verifies the JWT with the configured secret
- blocks unauthorized access

### 6. Admin Analytics and CRUD

The Node backend also includes operational and analytics logic.

#### Booking Search API

`GET /api/admin/bookings`

- returns booking data for the admin UI
- supports filtering with query parameters
- is used by the booking management page

#### Dashboard Statistics API

`GET /api/admin/stats`

- calculates weekly sales
- separates room revenue and amenity revenue
- estimates current room availability
- estimates staff availability
- computes availability by room type

The backend currently uses the following internal logic:

- room capacities:
  - Single Bed: 50
  - Twin Bed: 20
  - Double Bed: 20
  - Four Bed Suite: 10
- total staff: 200
- staff assigned per active booking: 2

#### Amenities Statistics API

`GET /api/admin/amenities/stats`

- reads booked amenities from stored JSON arrays
- totals earnings by amenity type
- returns overall and category-wise amenity income

`GET /api/admin/amenities/bookings`

- returns booking-level details for a specific amenity
- is used in the React amenities modal

#### Booking Update and Delete APIs

- `PUT /api/admin/bookings/:id`
- `DELETE /api/admin/bookings/:id`

These routes allow admin-side editing and deletion of existing bookings.

#### Feedback View API

`GET /api/admin/feedback`

- returns submitted guest feedback
- powers the feedback table shown inside the admin dashboard

## API Summary

| Method | Endpoint | Purpose | Auth Required |
| --- | --- | --- | --- |
| `POST` | `/api/bookings` | Create a hotel booking | No |
| `POST` | `/api/feedback` | Submit guest feedback | No |
| `POST` | `/api/admin-login` | Log in as admin and receive JWT | No |
| `GET` | `/api/admin/bookings` | Search and list bookings | Yes |
| `PUT` | `/api/admin/bookings/:id` | Update a booking | Yes |
| `DELETE` | `/api/admin/bookings/:id` | Delete a booking | Yes |
| `GET` | `/api/admin/stats` | Weekly sales and availability stats | Yes |
| `GET` | `/api/admin/feedback` | View submitted feedback | Yes |
| `GET` | `/api/admin/amenities/stats` | Amenity revenue totals | Yes |
| `GET` | `/api/admin/amenities/bookings` | Booking details for one amenity | Yes |

## Expected Database Tables

The backend code expects at least the following tables.

### `bookings`

Expected columns used by the backend:

- `id`
- `customer_name`
- `customer_email`
- `customer_phone`
- `room_type`
- `check_in_date`
- `check_out_date`
- `total_price`
- `amenities`
- `booking_date`

Notes:

- `amenities` is treated like a JSON array of amenity IDs
- `booking_date` is used for admin reporting and sorting

### `feedback`

Expected columns used by the backend:

- `id`
- `name`
- `email`
- `amenities_rating`
- `hospitality_rating`
- `comments`
- `submitted_at`

## Project Structure

```text
DB_Proj/
|-- backend/
|   |-- index.js
|   |-- package.json
|   |-- .env
|-- public/
|-- src/
|   |-- App.js
|   |-- index.js
|   |-- HomePage.js
|   |-- HotelSearch.js
|   |-- HotelList.js
|   |-- BookingPageMain.jsx
|   |-- bookpage1.jsx
|   |-- bookpage2.jsx
|   |-- bookpage3.jsx
|   |-- bookpage4.jsx
|   |-- AdminLogin.jsx
|   |-- ProtectedRoute.jsx
|   |-- R_Admin.js
|   |-- R_Amenities.js
|   |-- R_RoomRatings.js
|   |-- UserDetailTab.jsx
|   |-- Feedback.jsx
|-- package.json
|-- README.md
```

## Installation and Setup

### Prerequisites

- Node.js 18 or later
- npm
- MySQL Server

### 1. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 2. Install Backend Dependencies

From the `backend` folder:

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create or update `backend/.env` with values similar to:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_DATABASE=your_database_name
JWT_SECRET=replace_with_a_secure_secret
```

### 4. Start the Backend

Inside the `backend` folder:

```bash
node index.js
```

The backend runs on:

- `http://localhost:5000`

### 5. Start the React Frontend

From the project root:

```bash
npm start
```

The frontend runs on:

- `http://localhost:3000`

## How the Frontend and Backend Connect

The React app communicates with the backend using `fetch` calls to `http://localhost:5000`.

Examples of this integration:

- booking pages send booking details to `/api/bookings`
- feedback page sends ratings to `/api/feedback`
- admin login sends credentials to `/api/admin-login`
- protected admin pages attach the JWT token in the `Authorization` header

This project is a good example of a classic full-stack flow:

1. React collects user input.
2. Node/Express validates and processes the request.
3. MySQL stores or retrieves the data.
4. React renders the returned result in the UI.

## Available Frontend Scripts

From the root `package.json`:

- `npm start` - run the React development server
- `npm run build` - create a production build
- `npm test` - run React tests

## Backend Notes

- The backend currently does not define a custom `start` script in `backend/package.json`, so it is started with `node index.js`.
- Admin API protection uses JWT tokens.
- Some values such as room metadata, room ratings, and certain admin details are still hardcoded in the frontend/backend for project use.

## Suggested Improvements

- Move the API base URL into environment variables for the React app
- Add backend scripts such as `start` and `dev`
- Replace hardcoded admin credentials with database-backed authentication
- Add formal SQL schema and seed files
- Add validation and error handling middleware
- Add unit and integration tests for API routes
- Add deployment configuration for frontend and backend

## Conclusion

This project demonstrates a complete React + Node.js hotel booking system with:

- a user-facing booking experience
- a protected admin dashboard
- MySQL-backed persistence
- analytics and booking management features

It is a strong example of how React can be used for interactive UI and routing, while Node.js and Express provide authentication, API services, and database-driven business logic.
