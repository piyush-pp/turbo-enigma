# Public Booking Interface - Testing Guide

## Quick Start Testing

### 1. Prerequisites
```bash
# Backend must be running
cd backend
npm run dev
# Should see: Server running on http://localhost:3000

# Frontend must be running
cd frontend
npm run dev
# Should see: http://localhost:5173
```

### 2. Create Test Data (via Backend Admin)

Before testing, you need:
- A business with slug "test-business"
- At least 2 services with different prices/durations
- At least 2 staff members (for multi-staff testing)
- Availability rules configured

Use curl or Postman to create:

```bash
# Create business
POST http://localhost:3000/api/owner/auth/register
{
  "email": "owner@test.com",
  "password": "password123"
}

# Create business (as authenticated owner)
POST http://localhost:3000/api/owner/businesses
{
  "name": "Test Business",
  "description": "A test business",
  "timezone": "America/New_York",
  "isSingleStaff": false
}

# Create services
POST http://localhost:3000/api/owner/services
{
  "businessId": "xxx",
  "name": "Haircut",
  "description": "Professional haircut",
  "duration": 30,
  "price": 50
}

# Create staff
POST http://localhost:3000/api/owner/staff
{
  "businessId": "xxx",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@test.com",
  "phone": "555-1234"
}

# Set availability
PUT http://localhost:3000/api/owner/availability/{staffId}
{
  "rules": {
    "0": {"isWorkingDay": false},           // Sunday
    "1": {"isWorkingDay": true, "startTime": "09:00", "endTime": "17:00"},
    "2": {"isWorkingDay": true, "startTime": "09:00", "endTime": "17:00"},
    "3": {"isWorkingDay": true, "startTime": "09:00", "endTime": "17:00"},
    "4": {"isWorkingDay": true, "startTime": "09:00", "endTime": "17:00"},
    "5": {"isWorkingDay": true, "startTime": "09:00", "endTime": "17:00"},
    "6": {"isWorkingDay": false}            // Saturday
  }
}
```

### 3. Test Home Page

**URL:** `http://localhost:5173/`

**Test Cases:**

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load home page | Visit `/` | Page loads, shows hero, features, lookup form | ⬜ |
| Business lookup | Enter "test-business" in form | Form submits, redirects to `/booking/test-business` | ⬜ |
| Invalid slug | Enter "nonexistent" | Error message shown | ⬜ |
| Valid slug with Enter key | Enter slug and press Enter | Same as form submit | ⬜ |

### 4. Test Booking Wizard - Multi-Staff Mode

**Setup:** Create business with `isSingleStaff: false`

**URL:** `http://localhost:5173/booking/test-business`

#### Step 1: Service Selection

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load booking page | Visit URL | Page loads, shows Step 1 progress | ⬜ |
| Services display | - | All services show with name, price, duration | ⬜ |
| Select service | Click a service card | Card highlights, "Next" button enables | ⬜ |
| Verify selection | - | Selected service remains highlighted | ⬜ |
| Navigation | Click "Next" | Advances to Step 2 | ⬜ |
| Cannot go back | No "Previous" on step 1 | "Previous" button hidden | ⬜ |

#### Step 2: Staff Selection

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load step | - | Shows Step 2 progress, displays staff members | ⬜ |
| Staff display | - | All active staff show with names/avatars | ⬜ |
| Select staff | Click a staff card | Card highlights, "Next" enables | ⬜ |
| Go back | Click "Previous" | Returns to Step 1, selection preserved | ⬜ |
| Go forward | Click "Next" after selecting | Advances to Step 3 | ⬜ |
| Auto-selection | - | No staff auto-selected (should require click) | ⬜ |

#### Step 3: Date & Time Selection

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load step | - | Shows calendar for current month | ⬜ |
| Show available dates | - | Dates with slots highlighted in green | ⬜ |
| Click available date | Click green date | Shows time slots for that date below | ⬜ |
| Click unavailable date | Click gray date | No slots shown or disabled state | ⬜ |
| Time slots | Click available date | Shows 15-minute intervals (e.g., 09:00, 09:15, 09:30) | ⬜ |
| Select time | Click a time slot | Slot highlighted, "Next" enables | ⬜ |
| Month navigation | Click ">" button | Shows next month, dates update | ⬜ |
| Previous month | Click "<" button | Shows previous month | ⬜ |
| Today button | Click "Today" | Jumps to today, shows slots | ⬜ |
| Timezone display | - | Shows business timezone | ⬜ |

#### Step 4: Customer Info

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load step | - | Shows form with 4 fields | ⬜ |
| Name field | Enter name | Accepts input | ⬜ |
| Email required | Leave empty, try next | Shows "Email required" error | ⬜ |
| Email validation | Enter invalid email | Shows "Invalid email" error | ⬜ |
| Phone optional | Leave empty | Form still valid | ⬜ |
| Notes optional | Leave empty | Form still valid | ⬜ |
| Valid form | Fill name + valid email | "Next" button enables | ⬜ |
| Previous | Click "Previous" | Returns to Step 3, form preserved | ⬜ |

#### Step 5: Review & Confirm

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load step | - | Shows booking summary | ⬜ |
| Service card | - | Shows service name, duration, price | ⬜ |
| DateTime card | - | Shows selected date, time, timezone | ⬜ |
| Customer info | - | Shows name, email, phone, notes | ⬜ |
| Edit allowed | Click "Previous" | Can go back to edit any field | ⬜ |
| Submit booking | Click "Complete Booking" | Shows loading indicator | ⬜ |

#### Success Page

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Booking confirmed | - | Shows success checkmark and message | ⬜ |
| Confirmation number | - | Displays unique booking ID | ⬜ |
| Booking details | - | Shows full booking summary | ⬜ |
| Email confirmation | - | Shows "Confirmation sent to [email]" | ⬜ |
| Back to home | Click "Back to Home" | Redirects to `/` | ⬜ |

### 5. Test Booking Wizard - Single-Staff Mode

**Setup:** Create business with `isSingleStaff: true`

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load booking page | Visit URL | Shows progress as "Step 1 of 4" (not 5) | ⬜ |
| Step 1 | - | Service selection same as multi-staff | ⬜ |
| Step 2 missing | Click "Next" from service | Skips to date/time (no staff selection) | ⬜ |
| Staff auto-select | - | Staff automatically selected in background | ⬜ |
| Step 3 is Step 2 now | - | Date selection is now "Step 2 of 4" | ⬜ |
| Steps reduced | - | Total 4 steps instead of 5 | ⬜ |

### 6. Test Error Scenarios

#### Business Not Found

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Invalid slug | Visit `/booking/invalid-slug` | Shows "Business not found" error | ⬜ |
| Retry link | Click "Try another business" | Redirects to home page | ⬜ |

#### No Services

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Business with no services | - | Shows "No services available" message | ⬜ |
| Cannot proceed | - | Cannot advance from Step 1 | ⬜ |

#### No Available Slots

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| All slots booked | Select date with no slots | Shows "No available slots" message | ⬜ |
| Calendar shows no dates | - | No dates highlighted as available | ⬜ |

#### Slot Unavailable During Booking

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Slot taken between selection and submit | Simulate by booking same slot in another tab, then submit | Shows "Slot no longer available" error | ⬜ |
| Suggest available slots | - | Shows message with next available times | ⬜ |
| User can retry | - | Can go back and select different slot | ⬜ |

### 7. Test Responsive Design

**Desktop (1920x1080)**

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Layout | View at full width | All elements properly spaced, readable | ⬜ |
| Cards | - | Service/staff cards in grid layout | ⬜ |
| Calendar | - | Full month view visible | ⬜ |
| Form | - | Fields not cramped, labels clear | ⬜ |

**Tablet (768x1024)**

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Responsive | Resize to tablet | Layout adapts, no horizontal scroll | ⬜ |
| Cards | - | Cards stack appropriately | ⬜ |
| Calendar | - | Month view still visible or scrollable | ⬜ |
| Touch targets | - | Buttons/inputs large enough to tap | ⬜ |

**Mobile (375x667)**

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Full screen width | View on phone | No horizontal scrolling | ⬜ |
| Cards | - | Single column layout | ⬜ |
| Calendar | - | Month navigation visible, dates scrollable | ⬜ |
| Buttons | - | All buttons easily tappable | ⬜ |
| Form inputs | - | Good spacing, easy to tap and type | ⬜ |

### 8. Test API Integration

**Prerequisites:** Have browser DevTools open (F12)

#### Check Network Calls

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Load booking page | Watch Network tab | See 3 requests: business, services, staff | ⬜ |
| Slot generation | Select service + date | See GET /api/public/slots request | ⬜ |
| Create booking | Submit form | See POST /api/bookings request | ⬜ |
| Success | Booking created | Response includes bookingId | ⬜ |

#### Check Response Data

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Business response | - | Includes: id, name, timezone, isSingleStaff, email | ⬜ |
| Services response | - | Includes: id, name, price, duration | ⬜ |
| Staff response | - | Includes: id, firstName, lastName, isActive | ⬜ |
| Slots response | - | Array of time strings like "09:00", "09:15" | ⬜ |
| Booking response | - | Includes: bookingId, confirmationNumber, status | ⬜ |

### 9. Test Timezone Handling

**Setup:** Use business with timezone "America/Los_Angeles"

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Show timezone | - | Displays "America/Los_Angeles" or "PST" | ⬜ |
| Slot times | Fetch slots | Times shown in user's browser timezone | ⬜ |
| Confirmation | Review booking | Times shown consistently | ⬜ |
| Database UTC | Check backend | Times stored as UTC internally | ⬜ |

### 10. Performance Testing

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Page load | Load home page | Complete in < 2 seconds | ⬜ |
| Booking page load | Load booking page | Complete in < 2 seconds (API calls) | ⬜ |
| Slot generation | Select date | Slots returned in < 1 second | ⬜ |
| Booking submission | Submit form | Response in < 2 seconds | ⬜ |
| No janky animations | - | Scrolling smooth, no frame drops | ⬜ |

### 11. Accessibility Testing

| Test | Steps | Expected | Status |
|------|-------|----------|--------|
| Keyboard navigation | Use Tab key | Can navigate all inputs and buttons | ⬜ |
| Focus visible | Press Tab | Focus indicator visible on all elements | ⬜ |
| Form labels | - | All inputs have associated labels | ⬜ |
| Color contrast | - | Text readable (WCAG AA standard) | ⬜ |
| Screen reader | Use NVDA/JAWS | Page structure makes sense when read | ⬜ |

### 12. Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | Latest | ⬜ |
| Firefox | Latest | ⬜ |
| Safari | Latest | ⬜ |
| Edge | Latest | ⬜ |
| Mobile Safari | Latest | ⬜ |
| Chrome Mobile | Latest | ⬜ |

---

## Manual Test Cases - Detailed Workflows

### Workflow 1: Complete Happy Path (Multi-Staff)

1. Open http://localhost:5173/
2. Enter "test-business"
3. Click "Continue"
4. Select first service
5. Click "Next"
6. Select first staff member
7. Click "Next"
8. Click a date with available slots
9. Select a time slot
10. Click "Next"
11. Enter customer info (name, email)
12. Click "Next"
13. Review booking details
14. Click "Complete Booking"
15. Verify success page shows

**Expected Result:** Booking created successfully with confirmation

### Workflow 2: Edit and Rebook

1. Complete Workflow 1
2. Note the booking confirmation number
3. Click "Back to Home"
4. Enter same business slug
5. Go through booking again but select different time
6. Complete booking
7. Verify second booking has different time from first

**Expected Result:** Two separate bookings created

### Workflow 3: Error Recovery

1. Go to booking page
2. Select service
3. Open another tab, book the same slot
4. Go back to original tab
5. Try to complete booking with that slot
6. Verify error message
7. Click "Go Back"
8. Select different slot
9. Complete booking

**Expected Result:** Error handled gracefully, user can retry

---

## Debugging Tips

### Browser Console Errors

Check the console for:
- Network errors (CORS, 404, 500)
- React errors
- JavaScript exceptions

```javascript
// In browser console to check API health:
fetch('http://localhost:3000/api/owner/business/public/test-business')
  .then(r => r.json())
  .then(d => console.log(d))
```

### Backend API Testing

Use curl to test endpoints directly:

```bash
# Get business
curl http://localhost:3000/api/owner/business/public/test-business

# Get slots
curl 'http://localhost:3000/api/public/slots?businessSlug=test-business&serviceId=1&date=2024-01-25'

# Create booking
curl -X POST http://localhost:3000/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{
    "businessSlug": "test-business",
    "serviceId": "1",
    "staffId": "2",
    "startTimeUtc": "2024-01-25T14:00:00Z",
    "clientName": "John Doe",
    "clientEmail": "john@example.com"
  }'
```

### Database Inspection

Check bookings directly in database:

```sql
-- See bookings for test business
SELECT b.*, s.name as service_name, st.firstName 
FROM bookings b
JOIN services s ON b.serviceId = s.id
JOIN staff st ON b.staffId = st.id
WHERE b.businessId = (SELECT id FROM businesses WHERE slug = 'test-business')
ORDER BY b.createdAt DESC;

-- Check availability for staff
SELECT * FROM availabilityRules 
WHERE staffId = '...'
ORDER BY dayOfWeek;
```

---

## Continuous Integration Testing (Automated)

### Unit Tests

```bash
# Test utility functions
npm run test

# Test components in isolation
npm run test -- BookingWizard.test.tsx
```

### E2E Tests (Cypress/Playwright)

```typescript
describe('Public Booking Flow', () => {
  it('should complete booking end-to-end', () => {
    cy.visit('http://localhost:5173')
    cy.get('input[placeholder="Enter business slug"]').type('test-business')
    cy.get('button').contains('Continue').click()
    
    // Service selection
    cy.get('[data-testid="service-card"]').first().click()
    cy.get('button').contains('Next').click()
    
    // Staff selection
    cy.get('[data-testid="staff-card"]').first().click()
    cy.get('button').contains('Next').click()
    
    // Date/time selection
    cy.get('[data-testid="calendar-date"]').first().click()
    cy.get('[data-testid="time-slot"]').first().click()
    cy.get('button').contains('Next').click()
    
    // Customer info
    cy.get('input[name="name"]').type('John Doe')
    cy.get('input[name="email"]').type('john@example.com')
    cy.get('button').contains('Next').click()
    
    // Review and confirm
    cy.get('button').contains('Complete Booking').click()
    cy.get('[data-testid="success-message"]').should('be.visible')
  })
})
```

Run with: `npm run test:e2e`

---

## Regression Testing Checklist

After each code change, verify:

- [ ] Home page loads and lookup works
- [ ] Can complete booking for multi-staff business
- [ ] Can complete booking for single-staff business
- [ ] Service selection works
- [ ] Staff selection works
- [ ] Date/calendar navigation works
- [ ] Time slot selection works
- [ ] Form validation works
- [ ] Error scenarios handled
- [ ] Success page shows
- [ ] Responsive on mobile/tablet
- [ ] API calls returning correct data
- [ ] No console errors
- [ ] Performance acceptable (< 2s page load)

---

## UAT (User Acceptance Testing)

### Test with Real Users

1. Provide test business slug
2. Have users complete bookings
3. Collect feedback on:
   - Ease of use
   - Clear instructions
   - Time to complete
   - Any confusion points
4. Verify booking confirmation emails received
5. Verify bookings appear in provider dashboard

### Success Criteria

- [ ] Users can complete booking without help
- [ ] All bookings created successfully
- [ ] Confirmation emails delivered
- [ ] No reported bugs
- [ ] Positive feedback on UX

---

## Performance Baselines

Set and track these metrics:

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Home page load | < 2s | - | ⬜ |
| Booking page load | < 3s | - | ⬜ |
| Slot generation | < 1s | - | ⬜ |
| Booking submission | < 2s | - | ⬜ |
| Largest CSS | < 50KB | - | ⬜ |
| Largest JS | < 200KB | - | ⬜ |
| Lighthouse score | > 80 | - | ⬜ |
| Core Web Vitals | Good | - | ⬜ |

Use Lighthouse audit to measure: `npm run build && npm run preview`

