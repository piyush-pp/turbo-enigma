# Public Booking Interface - Implementation Guide

## Overview

The public booking interface is a customer-facing, multi-step booking wizard that allows customers to discover services and book appointments without authentication. It's fully wired to real backend APIs.

## Architecture

### Pages

1. **Public Home Page** (`/`)
   - Landing page for customers
   - Business lookup form
   - Features overview
   - Call-to-action to booking

2. **Public Booking Page** (`/booking/:businessSlug`)
   - Multi-step wizard for appointment booking
   - Displays business details and available services
   - Real-time slot generation

### Routes

```
Public Routes (No Auth Required):
├── / (Public Home Page)
└── /booking/:businessSlug (Public Booking Wizard)

Protected Routes (Auth Required):
├── /login (Provider Login)
├── /signup (Provider Signup)
└── /dashboard/:businessId/* (Provider Dashboard)
```

## Booking Wizard Flow

### Step Sequence

The wizard dynamically adjusts based on business configuration:

#### For Multi-Staff Businesses:
1. **Service Selection** - Choose service
2. **Staff Selection** - Choose staff member
3. **Date & Time** - Select appointment slot
4. **Customer Info** - Enter contact details
5. **Review & Confirm** - Review and confirm booking

#### For Single-Staff Businesses:
1. **Service Selection** - Choose service
2. **Date & Time** - Select appointment slot (Staff auto-selected)
3. **Customer Info** - Enter contact details
4. **Review & Confirm** - Review and confirm booking

### Components

#### `BookingWizard` Component
Main wizard container with progress indicator and navigation buttons.

```tsx
<BookingWizard
  steps={steps}
  currentStep={currentStep}
  onNext={handleNext}
  onPrev={handlePrev}
  isLoading={loading}
  canContinue={canProceed}
>
  {/* Step content */}
</BookingWizard>
```

Features:
- Progress bar showing completed steps
- Next/Previous navigation
- Step validation
- Loading states
- Dynamic "Continue" or "Complete Booking" button

#### `ServiceSelectionStep` Component
Displays available services with pricing and duration.

```tsx
<ServiceSelectionStep
  services={services}
  selectedServiceId={selectedServiceId}
  onSelectService={setSelectedServiceId}
  isLoading={loading}
/>
```

Features:
- Service cards with name, description, price, duration
- Visual selection indicator
- Filter active services only

#### `StaffSelectionStep` Component
Shows available staff members for multi-staff businesses.

```tsx
<StaffSelectionStep
  staff={staff}
  selectedStaffId={selectedStaffId}
  onSelectStaff={setSelectedStaffId}
  isSingleStaff={isSingleStaff}
  isLoading={loading}
/>
```

Features:
- Staff member cards
- Hidden for single-staff businesses
- Visual selection feedback

#### `DateTimeSelectionStep` Component
Interactive calendar with real-time slot availability.

```tsx
<DateTimeSelectionStep
  availableSlots={availableSlots}
  selectedSlot={selectedSlot}
  onSelectSlot={setSelectedSlot}
  timezone={timezone}
/>
```

Features:
- Month calendar navigation
- "Today" quick button
- Dates with available slots highlighted
- 15-minute interval slots
- Timezone-aware display
- Loading states during slot fetch

#### `CustomerInfoStep` Component
Collects customer contact information.

```tsx
<CustomerInfoStep
  formData={formData}
  onChange={handleFormChange}
  errors={errors}
/>
```

Fields:
- **Full Name** (required)
- **Email Address** (required, validated)
- **Phone Number** (optional)
- **Notes** (optional, multi-line)

Validation:
- Name: Required, non-empty
- Email: Required, valid email format
- Phone: Optional format
- Notes: Optional free text

#### `BookingReviewStep` Component
Shows complete booking summary before confirmation.

```tsx
<BookingReviewStep
  business={business}
  service={selectedService}
  selectedSlot={selectedSlot}
  formData={formData}
  isProcessing={isSubmitting}
/>
```

Displays:
- Service name, duration, price
- Date and time
- Customer information
- Notes (if provided)
- Timezone information
- Confirmation message

### Public API Hooks

**File:** `src/hooks/publicApi.ts`

```typescript
// Business lookup
getBusinessBySlug(slug: string): Promise<PublicBusiness>

// Service listing
getServices(businessId: string): Promise<PublicService[]>

// Staff listing
getStaff(businessId: string): Promise<PublicStaff[]>

// Slot generation
getAvailableSlots(
  businessSlug: string,
  serviceId: string,
  date: string,
  staffId?: string,
  timezone?: string
): Promise<TimeSlot[]>

// Booking creation
createBooking(booking: BookingRequest): Promise<BookingResponse>
```

### Data Flow

```
Public Home Page
    ↓ (Enter business slug)
Public Booking Page
    ↓ (Fetch business & services)
Service Selection
    ↓ (Select service)
Staff Selection (Multi-staff only)
    ↓ (Select staff)
Date & Time Selection
    ↓ (Fetch slots & select time)
Customer Info
    ↓ (Enter contact details)
Review & Confirm
    ↓ (Submit booking)
Success Page / Error Handling
```

## Integration with Backend APIs

### Required Backend Endpoints

All endpoints are called from the public booking interface:

#### 1. Get Business by Slug
```
GET /api/owner/business/public/{slug}

Response:
{
  "id": "uuid",
  "name": "Business Name",
  "slug": "business-slug",
  "timezone": "America/New_York",
  "isSingleStaff": false
}
```

#### 2. Get Services
```
GET /api/owner/services/{businessId}

Response:
[
  {
    "id": "uuid",
    "name": "Service Name",
    "duration": 60,
    "price": 100,
    "isActive": true
  }
]
```

#### 3. Get Staff
```
GET /api/owner/staff/{businessId}

Response:
[
  {
    "id": "uuid",
    "userId": "uuid",
    "isActive": true
  }
]
```

#### 4. Get Available Slots
```
GET /api/public/slots?businessSlug={slug}&serviceId={id}&date={date}&staffId={id}&timezone={tz}

Response:
[
  {
    "startTimeUtc": "2024-01-25T14:00:00Z",
    "endTimeUtc": "2024-01-25T15:00:00Z"
  }
]
```

#### 5. Create Booking
```
POST /api/bookings

Request Body:
{
  "businessSlug": "business-slug",
  "serviceId": "uuid",
  "staffId": "uuid",
  "startTimeUtc": "2024-01-25T14:00:00Z",
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "(555) 123-4567",
  "notes": "Optional notes"
}

Response:
{
  "id": "uuid",
  "status": "PENDING",
  "startTimeUtc": "2024-01-25T14:00:00Z",
  "clientName": "John Doe",
  "clientEmail": "john@example.com"
}
```

## User Experience Flow

### 1. Landing Page
- User enters business name/slug
- System validates format and redirects to booking page

### 2. Service Selection
- User sees all active services
- Each card shows name, description, duration, price
- User clicks to select service
- System loads available slots for selected service

### 3. Staff Selection (Multi-staff only)
- Shows available staff members
- User selects preferred staff
- System may reload slots for specific staff

### 4. Date & Time Selection
- Interactive calendar for current and future months
- Dates with available slots are highlighted
- User clicks date to see available times
- User selects specific time slot
- All slots are 15-minute intervals

### 5. Customer Information
- User enters required information (name, email)
- Optional phone and notes fields
- Real-time validation
- Error messages shown immediately

### 6. Review & Confirm
- Complete booking summary displayed
- All details highlighted in cards
- User confirms or can go back to edit
- Success message shown after booking

### 7. Confirmation
- "Booking Confirmed" message
- Confirmation number displayed
- Email notification sent to customer
- Link to return home

## Error Handling

### Validation Errors
- **Service not found**: "Service not found or unavailable"
- **No slots available**: "No available time slots for this date"
- **Invalid email**: "Invalid email format"
- **Missing required field**: "Field name is required"

### API Errors
- **Business not found**: Display error with link home
- **Network error**: Retry option
- **Booking conflict**: "Slot no longer available, please select another time"

### User-Friendly Messages
- All errors displayed inline or in banners
- Clear indication of required vs optional fields
- Helpful hints for email and phone formats

## Responsive Design

### Breakpoints
- **Mobile** (< 768px):
  - Single column layout
  - Touch-friendly buttons
  - Stacked calendar grid
  - Full-width form fields

- **Tablet** (768px - 1024px):
  - 2-column grids where applicable
  - Adjusted font sizes
  - Optimized spacing

- **Desktop** (> 1024px):
  - 3-column grids for slots
  - Full-featured calendar
  - Side-by-side layouts

### Mobile Optimizations
- Large touch targets (44px minimum)
- Simplified navigation
- Auto-focus on form fields
- Keyboard-friendly inputs
- Reduced animations for better performance

## Accessibility

### WCAG 2.1 Compliance
- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation
- ✅ Color contrast (AA standard)
- ✅ Focus indicators
- ✅ Form validation messages

### Screen Reader Support
- All form fields have associated labels
- Error messages linked to form fields
- Button text is descriptive
- Progress step numbering

## Performance Considerations

### Optimization Strategies

1. **API Caching**
   - Services list cached after load
   - Business details cached
   - Slots refreshed on date change

2. **Lazy Loading**
   - Components load only when needed
   - Slots loaded for calendar month as shown

3. **Request Debouncing**
   - Search debounced (if feature added)
   - Slot loading on date selection

4. **Bundle Optimization**
   - Date-fns imported tree-shakeable
   - Recharts not needed (removed for public)
   - Chart library only in provider dashboard

### Load Times
- Page load: < 2 seconds
- First interaction: < 1 second
- Slot fetch: < 500ms
- Booking submission: < 1 second

## Testing Checklist

### Functional Testing
- [ ] Service selection updates available slots
- [ ] Staff selection shows only for multi-staff businesses
- [ ] Calendar navigation works correctly
- [ ] Form validation prevents invalid submissions
- [ ] Booking confirmation received after submission
- [ ] Email notification sent

### Edge Cases
- [ ] Single-staff business (auto-select staff)
- [ ] No available slots for selected date
- [ ] Service with no assigned staff
- [ ] Double-booking prevention
- [ ] Timezone handling across DST
- [ ] Business with single service
- [ ] Business with many services

### Browser Compatibility
- [ ] Chrome/Edge (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Deployment

### Prerequisites
1. Backend API running and accessible
2. CORS configured on backend
3. HTTPS certificate for production
4. Business slug convention documented

### Environment Variables
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Deployment Steps
1. Build: `npm run build`
2. Deploy `dist/` folder to hosting
3. Configure environment variables
4. Test booking flow end-to-end
5. Monitor error logs

## Future Enhancements

- [ ] Rescheduling existing bookings
- [ ] Payment processing
- [ ] Promo code/discount codes
- [ ] Appointment reminders (SMS/push)
- [ ] Staff bio and photos
- [ ] Service gallery
- [ ] Customer reviews display
- [ ] Waitlist functionality
- [ ] Custom business branding/colors
- [ ] Multi-language support
- [ ] FAQ/Help section
- [ ] Live chat support

## Troubleshooting

### Common Issues

**Q: "Business not found" error**
- A: Check business slug is correct
- A: Verify business slug exists in backend
- A: Check API connection

**Q: No available slots showing**
- A: Verify staff have availability rules set
- A: Check selected date is in future
- A: Verify staff are marked as active

**Q: Form validation failing on valid email**
- A: Check regex pattern matches email format
- A: Try without special characters first

**Q: Booking submitted but no confirmation email**
- A: Check backend email queue is running
- A: Verify SMTP credentials in backend .env
- A: Check spam/junk folder

---

**Last Updated**: January 2024  
**Version**: 1.0.0
