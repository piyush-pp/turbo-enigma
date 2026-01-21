# Appoint Frontend - Setup & Getting Started

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. Access the Dashboard

**Login Credentials** (use your registered account):
- Email: your-email@example.com
- Password: your-password

Or create a new account using the signup form.

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000/api
```

By default, the API client connects to `http://localhost:3000/api`.

## Available Routes

### Public Routes
- `/login` - Login page
- `/signup` - Registration page

### Protected Routes (require login)
- `/dashboard/:businessId/` - Main dashboard
- `/dashboard/:businessId/calendar` - Calendar view
- `/dashboard/:businessId/appointments` - Appointment management
- `/dashboard/:businessId/customers` - Customer management
- `/dashboard/:businessId/revenue` - Revenue analytics
- `/dashboard/:businessId/availability` - Availability settings

## Features Overview

### Dashboard (`/dashboard/:businessId/`)
- Key metrics overview
- Today's appointments
- Quick stats (bookings, revenue, staff)

### Calendar (`/dashboard/:businessId/calendar`)
- Interactive month calendar
- Click date to view appointments
- Appointment indicators

### Appointments (`/dashboard/:businessId/appointments`)
- List all appointments
- Filter by status
- Confirm/cancel appointments
- View client details

### Customers (`/dashboard/:businessId/customers`)
- Customer database
- Search functionality
- Booking history
- Revenue tracking

### Revenue (`/dashboard/:businessId/revenue`)
- Revenue trends (line chart)
- Status distribution (pie chart)
- Key metrics
- Last 30 days analysis

### Availability (`/dashboard/:businessId/availability`)
- Set working hours per staff
- Configure working/non-working days
- Time-based availability

## Development

### Code Quality

**Linting**
```bash
npm run lint
```

**Code Formatting**
```bash
npm run format
```

**Type Checking**
```bash
npx tsc --noEmit
```

### File Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components (routes)
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `src/index.css` - Global styles

### Creating New Pages

1. Create component in `src/pages/YourPage.tsx`
2. Add route to `src/App.tsx`
3. Link from sidebar or another route

Example:
```tsx
// src/pages/MyPage.tsx
export const MyPage = () => {
  return (
    <main className="lg:ml-64 p-6">
      <h1 className="text-3xl font-bold mb-8">My Page</h1>
      {/* Your content */}
    </main>
  )
}
```

### Creating New Components

Place reusable components in `src/components/`:

```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return <div className="card">{title}</div>
}
```

## API Integration

### Using API Hooks

```tsx
import { useBookings, useServices, useStaff } from '@/hooks/api'

export const MyComponent = () => {
  const { bookings, loading, error } = useBookings(businessId)
  const { services } = useServices(businessId)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    // Render with bookings and services
  )
}
```

### Making Direct API Calls

```tsx
import apiClient from '@/lib/api'

const fetchData = async () => {
  try {
    const response = await apiClient.get('/owner/business')
    console.log(response.data)
  } catch (error) {
    console.error('Failed:', error)
  }
}
```

## Styling with Tailwind CSS

### Pre-defined Classes

```css
.card              /* White card with shadow */
.btn-primary       /* Blue primary button */
.btn-secondary     /* Gray secondary button */
.badge-success     /* Green success badge */
.badge-pending     /* Yellow pending badge */
.badge-cancelled   /* Red cancelled badge */
```

### Custom Utilities

Tailwind's utility classes work directly in JSX:

```tsx
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <span className="text-sm font-medium text-blue-900">Status</span>
</div>
```

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port.

### API Connection Errors

1. Verify backend is running: `npm run dev` in `/backend`
2. Check API URL in environment variables
3. Check browser console for CORS errors
4. Verify token in localStorage: `localStorage.getItem('accessToken')`

### Components Not Rendering

1. Check browser console for errors
2. Verify route path matches
3. Check that token is present (auth required)
4. Use React DevTools browser extension

### Styling Not Applied

1. Rebuild Tailwind: Restart dev server
2. Check class names are spelled correctly
3. Verify tailwind.config.js includes `src/` path
4. Clear browser cache (Ctrl+Shift+Delete)

## Build for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Then open `http://localhost:4173`

## Deployment

### Static Hosting (Vercel, Netlify, etc.)

1. Build the project: `npm run build`
2. Deploy the `dist/` folder
3. Configure environment variables (VITE_API_URL)
4. Ensure API backend is accessible from production domain

### Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Performance Tips

1. Use React DevTools Profiler to identify slow components
2. Memoize expensive computations with `useMemo`
3. Use lazy loading for routes with `React.lazy`
4. Optimize images and assets
5. Monitor bundle size: `npm run build -- --analyze`

## Browser DevTools

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- View component hierarchy
- Profile performance

### Network Tab
- Monitor API requests
- Check response times
- Verify authentication headers
- Debug CORS issues

### Storage Tab
- View localStorage tokens
- Inspect cookies
- Clear browser data

## Next Steps

1. **Customize Branding**: Update colors and logo in Tailwind config
2. **Add More Metrics**: Extend dashboard with additional statistics
3. **Implement Export**: Add PDF/CSV export functionality
4. **Add Notifications**: Implement toast notifications
5. **Dark Mode**: Add dark mode toggle with Tailwind

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Recharts Documentation](https://recharts.org/)

## Support

For issues:
1. Check console for error messages
2. Verify API is running and accessible
3. Check authentication tokens
4. Review network requests in DevTools
5. Test with different browser

---

Happy coding! 🚀
