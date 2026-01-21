# Appoint Provider & Staff Dashboard

A comprehensive React + TypeScript dashboard application for appointment management system providers and staff members.

## Features

### 📊 Dashboard
- Overview of key metrics (today's bookings, confirmed appointments, revenue, active staff)
- Today's appointments at a glance
- Quick status indicators

### 📅 Calendar View
- Visual calendar with booking indicators
- Select dates to view appointments
- Color-coded appointment status
- Month navigation

### 📝 Appointment Management
- View all appointments with detailed information
- Filter by status (Pending, Confirmed, Completed, Cancelled)
- Confirm or cancel pending appointments
- Client information and contact details
- Appointment notes and duration

### 👥 Customer Management
- Customer database with booking history
- Search by name or email
- Booking count and revenue tracking
- Contact information
- Customer segmentation

### 💰 Revenue Overview
- Revenue trend charts
- Booking status distribution
- Key metrics (total revenue, average booking value, total bookings)
- Revenue analysis by status

### ⏰ Availability Management
- Weekly availability schedule per staff member
- Set working hours and days off
- Automatic save and validation
- Separate management for each staff member

## Tech Stack

### Frontend
- **React 18.2.0** - UI framework
- **TypeScript 5.3.3** - Type safety
- **React Router 6.20.1** - Navigation
- **Tailwind CSS 3.4.1** - Styling
- **Vite 5.0.8** - Build tool

### Data Visualization
- **Recharts 2.10.3** - Charts and graphs
- **Lucide React 0.294.0** - Icons

### API & State
- **Axios 1.6.2** - HTTP client with token refresh
- **Date-fns 2.30.0** - Date utilities

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── AppointmentCard.tsx   # Appointment display card
│   │   ├── CalendarView.tsx      # Calendar component
│   │   ├── RevenueOverview.tsx   # Revenue charts
│   │   ├── AvailabilityManagement.tsx  # Availability editor
│   │   └── ProtectedRoute.tsx    # Auth guard
│   ├── pages/
│   │   ├── DashboardPage.tsx     # Main dashboard
│   │   ├── CalendarPage.tsx      # Calendar view
│   │   ├── AppointmentsPage.tsx  # Appointments list
│   │   ├── CustomersPage.tsx     # Customer management
│   │   ├── RevenuePage.tsx       # Revenue analytics
│   │   ├── AvailabilityPage.tsx  # Availability settings
│   │   ├── LoginPage.tsx         # Login form
│   │   └── SignupPage.tsx        # Registration form
│   ├── hooks/
│   │   └── api.ts               # API hooks and types
│   ├── lib/
│   │   └── api.ts               # Axios client with interceptors
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css               # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── index.html
```

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation Steps

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Create environment file** (optional, defaults to localhost)
   ```bash
   cp .env.example .env
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## API Integration

### Authentication
The application uses JWT-based authentication with automatic token refresh:
- Access tokens (15 min validity)
- Refresh tokens (7 days validity)
- Automatic token refresh on 401 responses
- Tokens stored in localStorage

### API Endpoints Used

**Authentication**
- `POST /auth/login` - Login
- `POST /auth/signup` - Register
- `POST /auth/refresh` - Refresh token

**Bookings**
- `GET /bookings` - List bookings (with filters)
- `PATCH /bookings/{id}` - Update booking status

**Services**
- `GET /owner/services/{businessId}` - List services

**Staff**
- `GET /owner/staff/{businessId}` - List staff
- `GET /owner/availability/{staffId}` - Get availability
- `PUT /owner/availability/{staffId}` - Set availability

**Business**
- `GET /owner/business` - List businesses

## Components Overview

### Sidebar
Navigation component with links to all dashboard sections. Mobile-responsive with hamburger menu.

### AppointmentCard
Displays booking details including client info, time, status, and action buttons for status updates.

### CalendarView
Interactive calendar showing appointments for each day. Click dates to filter appointments view.

### RevenueOverview
Multiple charts showing revenue trends, status distribution, and key metrics.

### AvailabilityManagement
Editor for setting staff working hours. Per-day configuration with working day toggles.

## Authentication Flow

1. User logs in or signs up
2. Backend returns access and refresh tokens
3. Tokens stored in localStorage
4. API client automatically adds Bearer token to requests
5. On 401 response, automatically refresh token
6. If refresh fails, redirect to login

## Features in Detail

### Dashboard Metrics
- **Today's Bookings**: Count of appointments scheduled for today
- **Confirmed Appointments**: All confirmed bookings (lifetime)
- **Total Revenue**: Sum of service prices for completed/confirmed bookings
- **Active Staff**: Count of active staff members

### Appointment Management
- View appointment status: PENDING, CONFIRMED, COMPLETED, CANCELLED
- Update pending appointments to CONFIRMED or CANCELLED
- See client contact information
- View appointment duration and time
- Add notes for reference

### Calendar Features
- Navigate between months
- Quick "Today" button
- Visual indicators for multiple appointments per day
- Click any date to see that day's appointments
- Highlight today's date in blue

### Customer Analytics
- Search customers by name or email
- View booking count per customer
- Track customer spending
- Contact information storage
- Customer list sorted by booking frequency

### Revenue Insights
- 30-day revenue trend line chart
- Booking status pie chart
- Key metrics cards (total revenue, average value, total bookings)
- Filter by booking status

### Availability Configuration
- Set working hours for each day
- Mark days as working or non-working
- Disable/enable entire days
- Automatic save to backend
- Visual feedback on changes

## Styling

Built with Tailwind CSS providing:
- Responsive design (mobile-first)
- Consistent color scheme
- Utility-based styling
- Dark mode ready
- Custom components (.card, .btn-primary, etc.)

## Error Handling

- API request errors with user-friendly messages
- Automatic token refresh on auth failures
- Form validation on login/signup
- Graceful loading states
- Error notifications displayed to user

## Performance Optimizations

- Lazy component loading with React Router
- Memoized data calculations (useMemo)
- Debounced search functionality
- Efficient list rendering
- Optimized re-renders with hooks

## Development Scripts

```bash
npm run dev           # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Known Limitations

- Revenue calculation uses estimated service prices (requires actual service data from API)
- No offline support (requires internet connection)
- Limited to modern browsers (ES2020+)

## Future Enhancements

- [ ] Export reports to PDF/CSV
- [ ] SMS notifications for appointments
- [ ] Appointment reminders
- [ ] Bulk operations on appointments
- [ ] Staff performance analytics
- [ ] Customer reviews/ratings display
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Email templates editor
- [ ] Advanced filtering and search
- [ ] Appointment rescheduling
- [ ] Capacity management
- [ ] Custom business branding

## Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## License

Proprietary - All rights reserved

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API server is running (http://localhost:3000)
3. Check localStorage for auth tokens
4. Review network requests in DevTools
5. Contact support team

---

**Last Updated**: 2024  
**Version**: 1.0.0
