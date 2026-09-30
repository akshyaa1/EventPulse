# EventPulse - Event Management and Handling Platform 🎟️✨

A full-stack MERN application for creating, managing, browsing, and booking live events, conferences, workshops, and hackathons.

---

## 🌟 Key Features

- **JWT Authentication & Authorization**:
  - Secure signup & login with bcrypt hashed passwords.
  - Role-based access control (`organizer` vs. `attendee`).
  - 1-click Demo credentials for rapid testing.
- **Event Lifecycle & Full CRUD**:
  - **Create**: Organizers can launch events with venue/online links, categories, capacity limits, pricing, tags, and banner imagery.
  - **Read**: Dynamic exploration with real-time keyword search, category filter pills (Tech, Music, Business, Design, Workshops, Social), and status tags.
  - **Update**: Edit existing events with capacity safeguard checks (cannot lower below active bookings).
  - **Delete**: Remove events with cascade cleanup of registrations.
- **Seat Booking & RSVP Handling**:
  - Attendees can reserve passes (1–5 tickets) with real-time capacity decrement.
  - Instant digital ticket code generation (`EP-XXXXXX`).
  - Active reservation tracking with option to cancel RSVP (instantly restores capacity).
  - Duplicate booking prevention.
- **Organizer Analytics Dashboard**:
  - Real-time KPI summary cards: Total Events Hosted, Total Attendees, Total Ticket Revenue, Average Fill Rate %.
  - Comprehensive event management table with quick actions.
  - Interactive Attendee Roster modal showing full attendee contact details and ticket codes.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, React Router 6, Axios, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express.js, RESTful API architecture.
- **Database**: MongoDB, Mongoose ODM.
- **Security**: JSON Web Tokens (JWT), bcryptjs password hashing, CORS.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (running locally on port `27017` or a MongoDB Atlas URI)

### 2. Backend Setup
```bash
cd server
npm install

# (Optional) Pre-populate sample events, organizers, and attendee passes
npm run seed

# Start the backend server (runs on http://localhost:5000)
npm run dev
# or: npm start
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start Vite dev server (runs on http://localhost:5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 🔑 Demo Accounts

The database seed script includes two pre-configured accounts:

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Organizer** | `organizer@eventpulse.com` | `password123` | Create, edit, delete events, inspect attendee rosters, view revenue KPIs |
| **Attendee** | `attendee@eventpulse.com` | `password123` | Browse events, RSVP & book tickets, view passes in My Bookings, cancel passes |

*(You can also register brand new custom attendee or organizer accounts directly in the UI!)*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account |
| `POST` | `/api/auth/login` | Public | Login & receive JWT bearer token |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |

### Events (`/api/events`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/events` | Public | List all events (supports `?search=...&category=...`) |
| `GET` | `/api/events/:id` | Public | Get single event details with organizer info |
| `GET` | `/api/events/my/organized` | Private (Organizer) | Get events created by logged-in organizer with stats |
| `POST` | `/api/events` | Private (Organizer) | Create a new event |
| `PUT` | `/api/events/:id` | Private (Organizer) | Update existing event |
| `DELETE` | `/api/events/:id` | Private (Organizer) | Delete event and its registrations |

### Registrations & RSVPs (`/api/registrations`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/registrations/:eventId` | Private | RSVP / book tickets for an event |
| `GET` | `/api/registrations/my` | Private | List all passes booked by logged-in user |
| `DELETE` | `/api/registrations/:id` | Private | Cancel an RSVP and restore seats |
| `GET` | `/api/registrations/event/:eventId` | Private (Organizer) | View attendee roster for an event |
