# Public Booking Integration - Quick Reference

## Quick Start

### For Customers

1. **Visit Booking Page**
   ```
   http://localhost:5173/
   ```

2. **Enter Business Slug**
   - Example: `my-salon` or `john-dental`
   - Click "Continue"

3. **Multi-Step Booking**
   - Step 1: Select a service
   - Step 2: Select staff (if multi-staff)
   - Step 3: Pick date and time
   - Step 4: Enter contact info
   - Step 5: Review and confirm

4. **Confirmation**
   - Get booking confirmation number
   - Email sent to provided address

### For Providers

1. **Ensure Backend is Running**
   ```bash
   cd backend
   npm run dev
   ```

2. **Frontend Development**
   ```bash
   cd frontend
   npm run dev
   # Opens at http://localhost:5173
   ```

3. **Direct Customers to**
   ```
   http://localhost:5173/booking/{business-slug}
   ```

4. **Example URLs**
   - `http://localhost:5173/booking/my-salon`
   - `http://localhost:5173/booking/john-dental-clinic`
   - `http://localhost:5173/booking/massage-studio`

## File Structure

### New Public Pages
```
src/pages/
├── PublicHomePage.tsx        # Landing page
└── PublicBookingPage.tsx     # Multi-step booking wizard
```

### New Booking Components
```
src/components/
├── BookingWizard.tsx              # Main wizard container
├── BookingSteps.tsx               # Service & Staff selection
├── DateTimeSelectionStep.tsx      # Calendar & slot selection
├── CustomerInfoStep.tsx           # Contact form
└── BookingReviewStep.tsx          # Booking review summary
```

### New API Hooks
```
src/hooks/
└── publicApi.ts    # Public (unauthenticated) API calls
```

## API Integration Points

### Business Lookup
- Backend: `GET /api/owner/business/public/{slug}`
- Called on: `PublicBookingPage` mount
- Used for: Business info, timezone, single-staff check

### Service Listing
- Backend: `GET /api/owner/services/{businessId}`
- Called on: After business loaded
- Used for: Service selection options

### Staff Listing
- Backend: `GET /api/owner/staff/{businessId}`
- Called on: After business loaded (if multi-staff)
- Used for: Staff selection options

### Slot Generation
- Backend: `GET /api/public/slots`
- Called on: Service/staff selected
- Parameters:
  - `businessSlug` - from URL param
  - `serviceId` - from selection
  - `date` - from calendar (YYYY-MM-DD)
  - `staffId` - optional, from selection
  - `timezone` - from business config
- Used for: Display available appointment times

### Booking Creation
- Backend: `POST /api/bookings`
- Called on: Review step confirmation
- Body includes:
  - Service, staff, date/time
  - Customer name, email, phone
  - Optional notes
- Response: Booking ID for confirmation

## Features Implemented

✅ **Public Home Page**
- Business lookup form
- Feature overview
- Call-to-action

✅ **Multi-Step Wizard**
- Service selection
- Staff selection (hidden for single-staff)
- Date & time selection with calendar
- Customer info collection
- Booking review

✅ **Smart Step Logic**
- Automatic staff selection for single-staff businesses
- Dynamic step count based on business type
- Smart "Next" button (becomes "Complete Booking" on last step)

✅ **Real-Time Validation**
- Email format validation
- Required field checking
- Slot availability checking
- Double-booking prevention

✅ **Responsive Design**
- Mobile-optimized
- Touch-friendly buttons
- Adjusted layouts per screen size
- Horizontal calendar swipe (on mobile)

✅ **Error Handling**
- Business not found errors
- Network error recovery
- Form validation errors
- Booking conflict handling

✅ **Success Confirmation**
- Booking confirmation page
- Confirmation number display
- Customer email shown
- Back to home link

## Testing the Integration

### Test Single-Staff Business

1. Backend: Create business with `isSingleStaff: true`
2. Frontend: Navigate to `/booking/business-slug`
3. Verify: Staff selection step is skipped
4. Expected: Only 4 steps instead of 5

### Test Multi-Staff Business

1. Backend: Create business with `isSingleStaff: false`
2. Add multiple staff members
3. Frontend: Navigate to `/booking/business-slug`
4. Verify: Staff selection step appears
5. Expected: 5 steps total

### Test Slot Generation

1. Set staff availability (e.g., Mon-Fri 9AM-5PM)
2. Select service and staff
3. Pick current date on calendar
4. Verify: Time slots appear (15-min intervals)
5. Expected: Slots within business hours only

### Test Booking Creation

1. Complete all steps
2. Click "Complete Booking"
3. Verify: Loading spinner appears
4. Expected: Redirect to success page with booking ID

## Troubleshooting

### Issue: Public routes not loading

**Solution:**
- Check App.tsx has public routes before dashboard routes
- Verify route order: `/` and `/booking/:slug` should be first
- Check browser console for navigation errors

### Issue: API calls fail with CORS error

**Solution:**
- Verify backend is running on port 3000
- Check backend CORS is enabled
- Check VITE_API_URL environment variable
- Backend should allow requests from localhost:5173

### Issue: Slots not appearing after date selection

**Solution:**
- Verify availability rules are set for staff
- Check availability has future dates
- Verify staff marked as active
- Check browser console for API errors

### Issue: Booking fails with "Slot not available"

**Solution:**
- Slot may have been booked by someone else (race condition handled)
- Select different time slot
- Refresh page to get latest slots
- Try different date

### Issue: Form validation failing on valid email

**Solution:**
- Check email regex pattern in CustomerInfoStep
- Try entering email without spaces
- Verify no special characters in email
- Check console for validation error message

## Environment Configuration

### Development (localhost)
```env
VITE_API_URL=http://localhost:3000/api
```

### Production (example)
```env
VITE_API_URL=https://api.appoint.example.com/api
```

## Performance Tips

1. **Slot Loading**
   - Slots only loaded when needed
   - Cached within session
   - Refresh on date change

2. **Component Rendering**
   - Form fields only render visible step
   - Calendar doesn't render all months at once
   - Loading states prevent re-rendering

3. **API Calls**
   - Business/services loaded once on mount
   - Slots loaded on service change
   - No unnecessary duplicate requests

## Security Notes

✅ **No sensitive data exposed**
- Public endpoints only (no auth required)
- Customer data validated before submission
- Double-booking prevention at database level

✅ **CSRF Protection**
- Axios same-origin by default
- POST requests use proper headers

✅ **Input Validation**
- Email format validation
- Required field validation
- Backend validates again on submission

⚠️ **Note**: Never expose admin tokens or credentials in public code

## Support & Help

### Common Questions

**Q: How do I get my booking link?**
- A: Your business slug is used in the URL
- A: Example: `/booking/my-business`
- A: Share: `http://yourdomain.com/booking/my-business`

**Q: Can customers change their bookings?**
- A: Not yet, but planned for future version
- A: Customers must contact provider to reschedule

**Q: How do time zones work?**
- A: Business timezone set in dashboard
- A: Slots displayed in customer's local browser time
- A: Stored in UTC in backend

**Q: What if no staff available?**
- A: No time slots will show for that date
- A: Customer sees "No available slots for this date"
- A: Staff needs to set availability or more staff added

## Next Steps

1. ✅ Test booking flow end-to-end
2. ✅ Customize branding/colors
3. ✅ Deploy to production
4. ✅ Share booking links with customers
5. 📋 Collect feedback for improvements

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Status**: Production Ready
