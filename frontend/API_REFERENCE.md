# Public Booking API Reference

## Overview

The Public Booking API provides endpoints for customers to browse businesses, view services and staff, and create bookings. All endpoints are public (no authentication required).

**Base URL:** `https://api.example.com/api`

**Response Format:** JSON

**Rate Limiting:** 100 requests per minute per IP

---

## Authentication

Public booking endpoints do NOT require authentication. No token needed.

**Note:** Protected endpoints (for admin operations) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Get Business by Slug

Retrieve business information using a unique slug.

**Endpoint:**
```
GET /owner/business/public/{slug}
```

**Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| slug | string (path) | Yes | Unique business identifier (URL slug) |

**Example Request:**
```bash
curl https://api.example.com/api/owner/business/public/john-barbershop
```

**Success Response (200):**
```json
{
  "id": "abc123",
  "name": "John's Barbershop",
  "description": "Professional barber services",
  "slug": "john-barbershop",
  "email": "john@barbershop.com",
  "phone": "+1-555-1234",
  "website": "https://johnbarbershop.com",
  "timezone": "America/New_York",
  "isSingleStaff": false,
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

**Error Responses:**

*404 Not Found*
```json
{
  "status": 404,
  "message": "Business not found",
  "error": "NOT_FOUND"
}
```

*500 Internal Server Error*
```json
{
  "status": 500,
  "message": "Server error",
  "error": "INTERNAL_SERVER_ERROR"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique business ID |
| name | string | Business name |
| description | string | Business description |
| slug | string | URL-friendly identifier |
| email | string | Business contact email |
| phone | string | Business phone number |
| website | string | Business website URL |
| timezone | string | Business timezone (e.g., "America/New_York") |
| isSingleStaff | boolean | Whether business has single staff member |
| address | object | Physical address information |

---

### 2. Get Available Slots

Generate available appointment slots for a specific service, staff, and date.

**Endpoint:**
```
GET /public/slots
```

**Query Parameters:**
| Name | Type | Required | Description |
|------|------|----------|-------------|
| businessSlug | string | Yes | Business slug |
| serviceId | string | Yes | Service ID |
| date | string (YYYY-MM-DD) | Yes | Target date |
| staffId | string | No | Staff ID (required for multi-staff) |
| timezone | string | No | Timezone for slot generation |

**Example Request:**
```bash
curl 'https://api.example.com/api/public/slots?businessSlug=john-barbershop&serviceId=abc123&date=2024-01-25&staffId=staff1&timezone=America/New_York'
```

**Success Response (200):**
```json
{
  "date": "2024-01-25",
  "availableSlots": [
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "11:00",
    "11:15"
  ],
  "timezone": "America/New_York",
  "dayOfWeek": "Thursday"
}
```

**Error Responses:**

*400 Bad Request*
```json
{
  "status": 400,
  "message": "Missing required parameter: serviceId",
  "error": "BAD_REQUEST"
}
```

*404 Not Found*
```json
{
  "status": 404,
  "message": "Business, service, or staff not found",
  "error": "NOT_FOUND"
}
```

*Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| date | string | The requested date (YYYY-MM-DD) |
| availableSlots | string[] | Array of available time slots (HH:MM format) |
| timezone | string | The business timezone used |
| dayOfWeek | string | Name of day (Monday, Tuesday, etc.) |

**Important Notes:**
- Slots are generated at 15-minute intervals
- Only returns slots within staff's availability window
- Only returns slots that don't overlap with existing bookings
- Respects service duration (slot + duration must fit within availability)
- Returns empty array if no slots available
- Times are in business timezone, converted to user timezone on display

---

### 3. Create Booking

Create a new appointment booking.

**Endpoint:**
```
POST /bookings
```

**Request Body:**
```json
{
  "businessSlug": "john-barbershop",
  "serviceId": "service123",
  "staffId": "staff456",
  "startTimeUtc": "2024-01-25T14:00:00Z",
  "clientName": "John Doe",
  "clientEmail": "john.doe@example.com",
  "clientPhone": "+1-555-9876",
  "notes": "First time customer, prefer less talking"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| businessSlug | string | Yes | Business slug |
| serviceId | string | Yes | Service ID |
| staffId | string | Yes | Staff ID |
| startTimeUtc | string (ISO 8601) | Yes | Booking start time in UTC |
| clientName | string | Yes | Customer name (1-100 chars) |
| clientEmail | string | Yes | Customer email (valid email format) |
| clientPhone | string | No | Customer phone number |
| notes | string | No | Additional notes (max 500 chars) |

**Example Request:**
```bash
curl -X POST https://api.example.com/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{
    "businessSlug": "john-barbershop",
    "serviceId": "service123",
    "staffId": "staff456",
    "startTimeUtc": "2024-01-25T14:00:00Z",
    "clientName": "John Doe",
    "clientEmail": "john.doe@example.com",
    "clientPhone": "+1-555-9876",
    "notes": "First time customer"
  }'
```

**Success Response (201):**
```json
{
  "bookingId": "booking789",
  "confirmationNumber": "BK-2024-1234",
  "businessName": "John's Barbershop",
  "serviceName": "Haircut",
  "staffName": "John Doe",
  "startTime": "2024-01-25T14:00:00Z",
  "endTime": "2024-01-25T14:30:00Z",
  "clientName": "Jane Smith",
  "clientEmail": "jane@example.com",
  "status": "pending",
  "createdAt": "2024-01-20T10:30:00Z"
}
```

**Error Responses:**

*400 Bad Request* (Invalid input)
```json
{
  "status": 400,
  "message": "Invalid email format",
  "error": "VALIDATION_ERROR",
  "details": {
    "field": "clientEmail",
    "reason": "must be a valid email"
  }
}
```

*409 Conflict* (Slot taken)
```json
{
  "status": 409,
  "message": "Slot is no longer available",
  "error": "SLOT_UNAVAILABLE",
  "availableAlternatives": [
    "2024-01-25T14:30:00Z",
    "2024-01-25T15:00:00Z",
    "2024-01-25T15:30:00Z"
  ]
}
```

*422 Unprocessable Entity* (Business logic error)
```json
{
  "status": 422,
  "message": "Staff member is not available on this date",
  "error": "STAFF_UNAVAILABLE"
}
```

*500 Internal Server Error*
```json
{
  "status": 500,
  "message": "Failed to create booking",
  "error": "INTERNAL_SERVER_ERROR"
}
```

**Response Fields:**
| Field | Type | Description |
|-------|------|-------------|
| bookingId | string | Unique booking ID |
| confirmationNumber | string | Human-readable confirmation (e.g., BK-2024-1234) |
| businessName | string | Business name |
| serviceName | string | Service name |
| staffName | string | Staff member name |
| startTime | string | Appointment start time (ISO 8601 UTC) |
| endTime | string | Appointment end time (ISO 8601 UTC) |
| clientName | string | Customer name |
| clientEmail | string | Customer email |
| status | string | Booking status (pending, confirmed, completed, cancelled) |
| createdAt | string | When booking was created (ISO 8601 UTC) |

**Important Notes:**
- `startTimeUtc` must be in UTC timezone (ISO 8601 format)
- Email validation is strict (RFC 5322)
- Phone is optional but should be in international format if provided
- Double-booking prevention at database level (unique constraint + transaction)
- Confirmation email automatically sent to clientEmail
- If slot taken between selection and submission, returns 409 with alternatives

---

## Protected Endpoints (Dashboard)

These endpoints require authentication. Used by provider dashboard.

### Get Services

**Endpoint:**
```
GET /owner/services/{businessId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "services": [
    {
      "id": "service1",
      "name": "Haircut",
      "description": "Professional haircut",
      "duration": 30,
      "price": 50.00,
      "isActive": true
    }
  ]
}
```

### Get Staff

**Endpoint:**
```
GET /owner/staff/{businessId}
```

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "staff": [
    {
      "id": "staff1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "isActive": true
    }
  ]
}
```

---

## Data Types

### Business
```typescript
interface PublicBusiness {
  id: string
  name: string
  description?: string
  slug: string
  email: string
  phone?: string
  website?: string
  timezone: string          // e.g., "America/New_York"
  isSingleStaff: boolean
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
}
```

### Service
```typescript
interface PublicService {
  id: string
  name: string
  description?: string
  duration: number         // in minutes
  price: number           // decimal price
  isActive: boolean
}
```

### Staff
```typescript
interface PublicStaff {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  bio?: string
  isActive: boolean
  specialties?: string[]
}
```

### Booking
```typescript
interface CreateBookingRequest {
  businessSlug: string
  serviceId: string
  staffId: string
  startTimeUtc: string     // ISO 8601: "2024-01-25T14:00:00Z"
  clientName: string       // 1-100 chars
  clientEmail: string      // valid email
  clientPhone?: string     // optional
  notes?: string          // max 500 chars
}

interface BookingResponse {
  bookingId: string
  confirmationNumber: string
  businessName: string
  serviceName: string
  staffName: string
  startTime: string       // ISO 8601 UTC
  endTime: string        // ISO 8601 UTC
  clientName: string
  clientEmail: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  createdAt: string      // ISO 8601 UTC
}
```

### Slot
```typescript
interface SlotsResponse {
  date: string           // "2024-01-25"
  availableSlots: string[] // ["09:00", "09:15", "09:30"]
  timezone: string       // "America/New_York"
  dayOfWeek: string     // "Thursday"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Slot generation, business lookup |
| 201 | Created | Booking successfully created |
| 400 | Bad Request | Invalid parameters, missing fields |
| 404 | Not Found | Business or service doesn't exist |
| 409 | Conflict | Slot taken, double-booking attempt |
| 422 | Unprocessable Entity | Business logic violation (staff unavailable) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "status": 400,
  "message": "Human-readable error message",
  "error": "ERROR_CODE",
  "timestamp": "2024-01-20T10:30:00Z",
  "path": "/api/bookings"
}
```

### Common Error Codes

| Code | Meaning | Resolution |
|------|---------|------------|
| VALIDATION_ERROR | Input validation failed | Check all required fields and formats |
| NOT_FOUND | Resource doesn't exist | Verify business slug, IDs are correct |
| SLOT_UNAVAILABLE | Slot taken | Fetch slots again, select different time |
| STAFF_UNAVAILABLE | Staff not available | Check availability rules or select different date |
| RATE_LIMITED | Too many requests | Wait and retry after 1 minute |
| INTERNAL_SERVER_ERROR | Server error | Try again later or contact support |

---

## Request/Response Examples

### Complete Booking Flow

**1. Lookup business**
```bash
$ curl https://api.example.com/api/owner/business/public/john-barbershop
→ Returns business info including isSingleStaff=false and timezone
```

**2. Fetch available slots**
```bash
$ curl 'https://api.example.com/api/public/slots?businessSlug=john-barbershop&serviceId=service123&date=2024-01-25&staffId=staff456&timezone=America/New_York'
→ Returns ["09:00", "09:15", "10:00", "10:30", "14:00", "14:30", "15:00"]
```

**3. Create booking**
```bash
$ curl -X POST https://api.example.com/api/bookings \
  -H 'Content-Type: application/json' \
  -d '{
    "businessSlug": "john-barbershop",
    "serviceId": "service123",
    "staffId": "staff456",
    "startTimeUtc": "2024-01-25T14:00:00Z",
    "clientName": "Jane Smith",
    "clientEmail": "jane@example.com"
  }'
→ Returns booking confirmation with ID and confirmation number
```

---

## Timezone Handling

### Important Concepts

1. **Storage:** All times stored in UTC (Z suffix)
2. **Input:** `startTimeUtc` parameter must be ISO 8601 with Z suffix
3. **Business Timezone:** Business has configured timezone (e.g., "America/New_York")
4. **Display:** Frontend converts UTC to user's browser timezone
5. **DST:** Automatically handled by Intl API

### Example

Business is in New York (EST -5 hours from UTC)

```
Scenario: User books 2:00 PM EST appointment on 2024-01-25

1. Frontend calculates UTC time: 2024-01-25T19:00:00Z (2 PM EST = 7 PM UTC)
2. Frontend sends: startTimeUtc: "2024-01-25T19:00:00Z"
3. Backend stores in database: 2024-01-25 19:00:00 UTC
4. Backend's availability check uses business timezone:
   - Check staff is available at 2:00 PM EST (the local time)
   - Check no overlap with existing bookings
5. Confirmation email shows: "January 25, 2024 at 2:00 PM EST"
```

### Daylight Saving Time

The system automatically handles DST transitions:
- March 2024: EST → EDT (2 AM → 3 AM, lose 1 hour)
- November 2024: EDT → EST (2 AM → 1 AM, gain 1 hour)

When generating slots, the system correctly accounts for these transitions.

---

## Rate Limiting

**Limits:**
- 100 requests per minute per IP address
- 1000 requests per hour per IP address

**Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1643021400
```

**When Limited (429):**
```json
{
  "status": 429,
  "message": "Rate limit exceeded. Retry after 1 minute",
  "error": "RATE_LIMITED",
  "retryAfter": 60
}
```

---

## Pagination

Currently endpoints return all results. Future versions may implement pagination:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## Webhooks (Future)

Plan to add webhooks for events:

```typescript
// Events to be added
- booking.created
- booking.confirmed
- booking.cancelled
- booking.completed
- availability.changed
```

Setup details coming soon.

---

## SDKs & Libraries

### JavaScript/TypeScript

```typescript
// Direct implementation in frontend/src/hooks/publicApi.ts
const getBusinessBySlug = async (slug: string) => {
  const response = await publicApi.get(`/owner/business/public/${slug}`)
  return response.data
}

const getAvailableSlots = async (
  businessSlug: string,
  serviceId: string,
  date: string,
  staffId?: string,
  timezone?: string
) => {
  const params = new URLSearchParams({
    businessSlug,
    serviceId,
    date,
    ...(staffId && { staffId }),
    ...(timezone && { timezone }),
  })
  const response = await publicApi.get(`/public/slots?${params}`)
  return response.data.availableSlots
}

const createBooking = async (booking: CreateBookingRequest) => {
  const response = await publicApi.post('/bookings', booking)
  return response.data
}
```

### cURL Template

```bash
# Get business
curl -X GET "https://api.example.com/api/owner/business/public/{slug}"

# Get slots
curl -X GET "https://api.example.com/api/public/slots?businessSlug=&serviceId=&date=&staffId=&timezone="

# Create booking
curl -X POST "https://api.example.com/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "businessSlug": "",
    "serviceId": "",
    "staffId": "",
    "startTimeUtc": "",
    "clientName": "",
    "clientEmail": ""
  }'
```

---

## Testing

### Test Credentials

Use these for testing:

```
Business Slug: demo-business
Service ID: demo-service-1
Staff ID: demo-staff-1
```

### Test Data

```json
{
  "businessSlug": "demo-business",
  "serviceId": "demo-service-1",
  "staffId": "demo-staff-1",
  "startTimeUtc": "2024-01-30T14:00:00Z",
  "clientName": "Test User",
  "clientEmail": "test@example.com",
  "clientPhone": "+1-555-1234"
}
```

### Testing Tools

- **Postman:** Import from `/postman/collections/PublicBooking.json`
- **Curl:** See examples above
- **Browser DevTools:** Network tab shows all API calls
- **Frontend:** Visit http://localhost:5173 and test booking flow

---

## API Version

**Current Version:** 1.0.0

**Last Updated:** January 2024

**Endpoint Pattern:** `/api/v1/*` (for future versioning)

---

## Support & Issues

- **Documentation:** See PUBLIC_BOOKING_GUIDE.md
- **Bug Reports:** Create issue on GitHub
- **Feature Requests:** Email product@example.com
- **Security Issues:** security@example.com

---

## Changelog

### Version 1.0.0 (January 2024)
- Initial release
- Public business lookup
- Slot generation
- Booking creation
- Multi-staff and single-staff support
- Timezone-aware scheduling

### Planned for Future Versions

- [ ] Payment processing (Stripe/PayPal)
- [ ] Booking modification (reschedule, cancel)
- [ ] Webhooks for business events
- [ ] Advanced filtering and search
- [ ] Batch slot generation
- [ ] Review/rating system
- [ ] SMS notifications
