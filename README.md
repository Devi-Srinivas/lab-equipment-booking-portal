# Laboratory Equipment Booking Portal

A MERN stack web application for **Sri Vasavi Engineering College (Autonomous)** that lets students book laboratory equipment and lets lab administrators manage equipment, approve requests, track returns and view reports.

## Features

### Student
- Register and log in with a student ID
- View equipment with live availability and book a date and time slot
- See booking status: Pending, Accepted, Rejected, Returned or Cancelled
- Cancel a Pending or Accepted booking
- Return equipment after use

### Admin (Employee / Faculty)
- Add, update and delete equipment
- Accept or reject booking requests
- See whether each student has returned their equipment, with the return date
- Filter requests by status
- Reports tab: summary cards, equipment-wise and student-wise reports, date range filter, CSV download and print

### Stock handling
- Accepting a booking reduces the available quantity
- Returning or cancelling an accepted booking adds it back

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Authentication | JWT, bcrypt password hashing |

## Project Structure

```
Laboratory Equipment Booking Portal/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route logic
│   ├── middleware/      # Auth middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js
└── frontend/
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── services/
```

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- A MongoDB database (local or MongoDB Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Devi-Srinivas/lab-equipment-booking-portal.git
cd lab-equipment-booking-portal
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a file named `.env` inside the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the server:
```bash
npm start
```
The API runs at `http://localhost:5000`.

### 3. Set up the frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
The app runs at `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a student or admin |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET / POST / PUT / DELETE | `/api/equipment` | Manage equipment |
| POST | `/api/bookings` | Submit a booking request |
| GET | `/api/bookings` | All bookings (add `?student=name` to filter) |
| PUT | `/api/bookings/:id` | Accept or reject a booking (admin) |
| PUT | `/api/bookings/:id/return` | Return equipment (student) |
| PUT | `/api/bookings/:id/cancel` | Cancel a booking (student) |

## Notes

- Admin IDs follow the format `t-cse-13`.
- Each browser tab keeps its own login (`sessionStorage`), so an admin and a student can be signed in side by side in different tabs.
- Never commit your `.env` file. It is listed in `.gitignore`.

## Author

**Devi Srinivas**
GitHub: [Devi-Srinivas](https://github.com/Devi-Srinivas)
