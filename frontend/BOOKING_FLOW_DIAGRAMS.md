# Public Booking Interface - Visual Flows

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────────┐              │
│  │ Public Home  │────────→│ Public Booking   │              │
│  │   Page (/)   │         │ Page with Wizard │              │
│  └──────────────┘         └──────────────────┘              │
│                                    │                         │
│                    ┌───────────────┼───────────────┐         │
│                    │               │               │         │
│           ┌────────▼─────┐  ┌──────▼──────┐  ┌────▼──────┐  │
│           │   Step 1:    │  │   Step 2:   │  │  Step 3:  │  │
│           │  Service     │  │    Staff    │  │  Date &   │  │
│           │ Selection    │  │ Selection   │  │   Time    │  │
│           │              │  │  (Optional) │  │           │  │
│           └────────┬─────┘  └──────┬──────┘  └────┬──────┘  │
│                    │               │               │         │
│                    └───────────────┼───────────────┘         │
│                                    │                         │
│                           ┌────────▼──────────┐              │
│                           │  Step 4:          │              │
│                           │  Customer Info    │              │
│                           └────────┬──────────┘              │
│                                    │                         │
│                           ┌────────▼──────────┐              │
│                           │  Step 5:          │              │
│                           │  Review &         │              │
│                           │  Confirm          │              │
│                           └────────┬──────────┘              │
│                                    │                         │
│                           ┌────────▼──────────┐              │
│                           │  Success Page     │              │
│                           │  (Confirmation)   │              │
│                           └───────────────────┘              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ HTTP/HTTPS
                            │ Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│            Backend API (Express + TypeScript)               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Public Endpoints (No Authentication Required)      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • GET  /owner/business/public/{slug}               │   │
│  │ • GET  /public/slots                               │   │
│  │ • POST /bookings                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Protected Endpoints (Authentication Required)      │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • GET  /owner/services/{businessId}                │   │
│  │ • GET  /owner/staff/{businessId}                   │   │
│  │ • GET  /owner/availability/{staffId}               │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Core Services                             │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │ • bookingService (create, validate, check slots)   │   │
│  │ • slotsService (generate with availability)         │   │
│  │ • businessService (retrieve by slug)                │   │
│  │ • serviceService (list by business)                 │   │
│  │ • staffService (list by business)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│               PostgreSQL Database                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Tables:                                                     │
│  • businesses              • availabilityRules              │
│  • services                • bookings                       │
│  • staff                   • users                          │
│  • staffServices                                            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## User Journey - Multi-Staff Business

```
Start
  │
  ├─→ Visit Home Page (/)
  │    └─→ Enter business slug
  │         └─→ Click "Continue"
  │
  ├─→ Booking Page Loads (/booking/{slug})
  │    └─→ Backend fetches business
  │         └─→ Check: isSingleStaff = false
  │              └─→ Show 5 steps
  │
  ├─→ STEP 1: Service Selection
  │    ├─→ Backend fetches services
  │    ├─→ Display service cards
  │    └─→ User selects service
  │         └─→ "Next" enabled
  │
  ├─→ STEP 2: Staff Selection (Multi-Staff)
  │    ├─→ Backend fetches active staff
  │    ├─→ Display staff options
  │    └─→ User selects staff member
  │         └─→ "Next" enabled
  │
  ├─→ STEP 3: Date & Time Selection
  │    ├─→ Backend fetches available slots
  │    │    (for service + staff + date + timezone)
  │    ├─→ Display calendar
  │    ├─→ User clicks date
  │    ├─→ Display time slots for that date
  │    └─→ User selects time slot
  │         └─→ "Next" enabled
  │
  ├─→ STEP 4: Customer Information
  │    ├─→ Display form:
  │    │    • Full Name (required)
  │    │    • Email (required)
  │    │    • Phone (optional)
  │    │    • Notes (optional)
  │    ├─→ User enters information
  │    ├─→ Client-side validation
  │    └─→ "Next" enabled when required fields filled
  │
  ├─→ STEP 5: Review & Confirm
  │    ├─→ Display booking summary:
  │    │    • Service name, price, duration
  │    │    • Staff member
  │    │    • Date & time
  │    │    • Customer info
  │    │    • Notes (if provided)
  │    ├─→ User reviews details
  │    └─→ User clicks "Complete Booking"
  │         │
  │         ├─→ Send POST /api/bookings
  │         │    with all booking details
  │         │
  │         ├─→ Backend validates:
  │         │    • Business exists
  │         │    • Service active
  │         │    • Staff active
  │         │    • Slot still available
  │         │    • Double-booking check
  │         │
  │         ├─→ Backend creates booking
  │         │    • Store in database
  │         │    • Queue email notification
  │         │
  │         └─→ Return success response
  │              with booking ID
  │
  └─→ Success Page
       ├─→ Display confirmation message
       ├─→ Show booking confirmation number
       ├─→ Show booking details
       ├─→ Notify customer email sent
       └─→ Offer "Back to Home" link
```

## User Journey - Single-Staff Business

```
Start
  │
  ├─→ Visit Home Page (/)
  │    └─→ Enter business slug
  │         └─→ Click "Continue"
  │
  ├─→ Booking Page Loads (/booking/{slug})
  │    └─→ Backend fetches business
  │         └─→ Check: isSingleStaff = true
  │              └─→ Show 4 steps (skip staff selection)
  │              └─→ Auto-select default staff
  │
  ├─→ STEP 1: Service Selection
  │    ├─→ Backend fetches services
  │    ├─→ Display service cards
  │    └─→ User selects service
  │         └─→ "Next" enabled
  │
  ├─→ STEP 2: Date & Time Selection
  │    ├─→ Backend fetches available slots
  │    │    (staff auto-selected)
  │    ├─→ Display calendar
  │    ├─→ User clicks date
  │    ├─→ Display time slots
  │    └─→ User selects time slot
  │         └─→ "Next" enabled
  │
  ├─→ STEP 3: Customer Information
  │    ├─→ Display form
  │    ├─→ User enters required info
  │    └─→ "Next" enabled when ready
  │
  ├─→ STEP 4: Review & Confirm
  │    ├─→ Display summary
  │    ├─→ User reviews
  │    └─→ Click "Complete Booking"
  │         │
  │         └─→ Create booking (same as multi-staff)
  │
  └─→ Success Page
```

## Data Flow - Slot Generation

```
User Input:
├─ Business slug
├─ Service ID
├─ Staff ID (if multi-staff)
└─ Selected date

   │
   ├─→ Frontend sends GET /api/public/slots?
   │    businessSlug=xxx&serviceId=yyy&date=2024-01-25&staffId=zzz
   │
   ├─→ Backend:
   │    ├─ Find business by slug
   │    ├─ Get service details (duration)
   │    ├─ Get staff availability rules for date
   │    │    └─ Query availabilityRules WHERE staffId=? AND dayOfWeek=?
   │    │
   │    ├─ Get existing bookings for that date/staff
   │    │    └─ Query bookings WHERE staffId=? AND date WITHIN ?
   │    │
   │    ├─ Generate 15-minute intervals
   │    │    └─ For each interval:
   │    │       ├─ Check within availability window
   │    │       ├─ Check doesn't overlap existing bookings
   │    │       ├─ Check slot + service duration fits
   │    │       └─ If valid, add to available slots
   │    │
   │    └─ Return array of available time slots
   │
   └─→ Frontend:
       ├─ Display slots in calendar/list
       └─ User selects one slot
```

## Double-Booking Prevention

```
Request: Create booking for 2024-01-25 14:00 UTC

Backend Processing:
│
├─→ Layer 1: Pre-check Query
│   └─ SELECT * FROM bookings WHERE
│        staffId = ?
│        AND startTimeUtc < 15:00
│        AND endTimeUtc > 14:00
│        LIMIT 1
│   └─ If found: Reject immediately (99% of cases)
│
├─→ Layer 2: Transaction (Serializable Isolation)
│   └─ BEGIN TRANSACTION (SERIALIZABLE)
│      ├─ Re-check for conflicts
│      ├─ If clear, INSERT booking
│      │  └─ UNIQUE(staffId, startTimeUtc) constraint
│      └─ COMMIT
│      (If simultaneous request:
│       → Unique constraint violation
│       → Automatic rollback)
│
├─→ Layer 3: Database Constraint
│   └─ UNIQUE (staffId, startTimeUtc)
│      └─ Prevents exact duplicate at DB level
│
└─→ Response to Frontend:
    ├─ Success: Return booking ID
    └─ Conflict: Return 409 error
       └─ Frontend: "Slot no longer available"
       └─ User: Select different time
```

## Component Hierarchy

```
App
├─ PublicHomePage
│  └─ Business lookup form
│     └─ Redirect to booking
│
├─ PublicBookingPage
│  └─ BookingWizard
│     ├─ Progress indicator (Steps 1-5)
│     ├─ Step content:
│     │  ├─ ServiceSelectionStep
│     │  │  ├─ Service cards
│     │  │  └─ Selection handling
│     │  │
│     │  ├─ StaffSelectionStep
│     │  │  ├─ Staff cards
│     │  │  └─ Selection handling
│     │  │
│     │  ├─ DateTimeSelectionStep
│     │  │  ├─ Calendar component
│     │  │  ├─ Month navigation
│     │  │  ├─ Slot grid
│     │  │  └─ Selection handling
│     │  │
│     │  ├─ CustomerInfoStep
│     │  │  ├─ Name input
│     │  │  ├─ Email input
│     │  │  ├─ Phone input
│     │  │  ├─ Notes textarea
│     │  │  └─ Validation feedback
│     │  │
│     │  └─ BookingReviewStep
│     │     ├─ Service card
│     │     ├─ DateTime card
│     │     ├─ Customer info
│     │     └─ Notes display
│     │
│     ├─ Navigation buttons
│     │  ├─ Previous button
│     │  └─ Next/Complete button
│     │
│     └─ State management:
│        ├─ selectedServiceId
│        ├─ selectedStaffId
│        ├─ selectedSlot
│        └─ formData
│
└─ Success confirmation
   ├─ Checkmark icon
   ├─ Confirmation number
   ├─ Booking details
   └─ Home link
```

## API Call Sequence

```
Timeline: User booking appointment

T0:  PublicBookingPage component mounts
     └─→ Call: getBusinessBySlug(slug)

T1:  Business loaded (500ms)
     ├─→ Call: getServices(businessId)
     └─→ Call: getStaff(businessId) [if multi-staff]

T2:  Services and staff loaded (1000ms)
     └─→ Display Step 1: Service Selection

T3:  User selects service
     └─→ Call: getAvailableSlots(slug, serviceId, today, staffId?)

T4:  Slots loaded (300-500ms)
     └─→ Display calendar with available dates

T5:  User selects date/time
     └─→ selectedSlot updated in state

T6:  User enters customer info
     └─→ Form validation

T7:  User clicks "Complete Booking"
     └─→ Call: createBooking({...})
     └─→ Submission loading state

T8:  Booking created (1000-2000ms)
     ├─→ Backend creates booking
     ├─→ Backend queues email
     └─→ Backend returns success

T9:  Success page displayed
     ├─→ Show confirmation number
     ├─→ Show booking details
     └─→ Offer "Back to Home"

Total Time: ~3-5 seconds of API calls + user interaction
```

## State Management Diagram

```
PublicBookingPage Component State

┌─────────────────────────────────────────────┐
│          Loading State                      │
├─────────────────────────────────────────────┤
│ loading: boolean   - Page loading state    │
│ error: string|null - Error message         │
│ bookingSuccess: boolean - Booking created  │
│ bookingId: string|null - Confirmation ID   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│         Business Data                       │
├─────────────────────────────────────────────┤
│ business: PublicBusiness - Business info   │
│ services: PublicService[] - Services list  │
│ staff: PublicStaff[] - Staff members       │
│ availableSlots: TimeSlot[] - Available     │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        Selection State                      │
├─────────────────────────────────────────────┤
│ selectedServiceId: string|null             │
│ selectedStaffId: string|null               │
│ selectedSlot: TimeSlot|null                │
│ currentStep: number                        │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│        Form Data State                      │
├─────────────────────────────────────────────┤
│ formData: {                                 │
│   clientName: string                       │
│   clientEmail: string                      │
│   clientPhone?: string                     │
│   notes?: string                           │
│ }                                          │
│ formErrors: Record<string, string>         │
│ isSubmitting: boolean                      │
└─────────────────────────────────────────────┘
```

---

These diagrams show how the public booking interface works end-to-end!
