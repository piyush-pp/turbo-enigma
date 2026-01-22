# Appoint Backend - Architecture & Design Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Principles](#architecture-principles)
4. [System Design](#system-design)
5. [Database Schema](#database-schema)
6. [Module Design](#module-design)
7. [Authentication & Authorization](#authentication--authorization)
8. [Double-Booking Prevention](#double-booking-prevention)
9. [Timezone Handling](#timezone-handling)
10. [Email Notification System](#email-notification-system)
11. [Error Handling](#error-handling)
12. [Development Guide](#development-guide)

---

## Project Overview

**Appoint** is a production-ready appointment management system backend designed for service businesses. It enables businesses to manage staff, services, availability rules, and customer bookings with built-in protection against double-booking and timezone-aware slot generation.

### Key Features

- **Multi-business Support**: Handle multiple businesses from one platform
- **Staff Management**: Single or multi-staff mode support
- **Smart Slot Generation**: 15-minute intervals with timezone awareness and UTC storage
- **Double-Booking Prevention**: Three-layer protection mechanism
- **Email Notifications**: Async queue-based system with retry logic
- **JWT Authentication**: Secure token-based access control
- **Transactional Safety**: Serializable isolation for critical operations

---

## Technology Stack

### Backend Framework
- **Node.js 18+**: JavaScript runtime
- **Express.js 4.18.2**: HTTP server framework
- **TypeScript 5.3.3**: Strongly-typed JavaScript with strict mode enabled

### Database & ORM
- **PostgreSQL 13+**: Relational database
- **Prisma 5.8.0**: Type-safe ORM with migrations

### Authentication & Security
- **jsonwebtoken 9.0.2**: JWT token generation and verification
- **crypto**: Built-in PBKDF2 password hashing (no external bcrypt dependency)

### Job Queue & Background Processing
- **BullMQ 5.1.11**: Redis-backed job queue with consumer workers
- **Redis 4.6.14**: In-memory data store for job queue

### Email Service
- **Nodemailer 6.9.9**: SMTP email delivery
- **HTML Templating**: Built-in HTML generation for booking confirmations

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Concurrently**: Run multiple processes (dev server + worker)

---

## Architecture Principles

### 1. **Modular Monolith Pattern**

Each feature domain is organized as a complete module:

```
src/modules/
├── auth/           # Authentication and user management
├── business/       # Business creation and configuration
├── staff/          # Staff management
├── service/        # Service offerings
├── availability/   # Recurring availability rules
├── slots/          # Slot generation engine
└── booking/        # Booking management
```

Each module contains:
- `types.ts` - TypeScript interfaces and data structures
- `service.ts` - Business logic and database operations
- `controller.ts` - HTTP request/response handling
- Route integration in `src/routes/`

### 2. **Separation of Concerns**

- **Controllers**: Handle HTTP parsing, validation, authorization
- **Services**: Execute business logic and database queries
- **Types**: Define data structures and API contracts
- **Middleware**: Cross-cutting concerns (auth, logging, error handling)
- **Utilities**: Shared functions (JWT, password hashing, email templates)

### 3. **Type Safety**

- Strict TypeScript compilation enabled
- All database operations typed through Prisma
- Custom error classes for specific error scenarios
- Request/response validation at controller layer

### 4. **Transaction Safety**

- Critical operations use Prisma transactions
- Serializable isolation level for slot generation and booking
- Unique database constraints prevent race conditions

---

## System Design

### High-Level Architecture

```
┌─────────────────┐
│   HTTP Client   │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────────────────┐
│  Express.js Router          │
│  ├─ /auth                   │
│  ├─ /owner/* (protected)    │
│  ├─ /public/* (public)      │
│  └─ /bookings/*             │
└────────┬────────────────────┘
         │
    ┌────┴─────────────────────┐
    │                           │
    ▼                           ▼
┌──────────────┐        ┌──────────────────┐
│  Controllers │        │  Auth Middleware │
│  (HTTP)      │        │  (JWT verify)    │
└────────┬─────┘        └──────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  Services (Business Logic)       │
│  ├─ authService                  │
│  ├─ businessService              │
│  ├─ staffService                 │
│  ├─ serviceService               │
│  ├─ availabilityService          │
│  ├─ slotsService                 │
│  └─ bookingService               │
└────────┬─────────────────────────┘
         │
    ┌────┴─────────────────┐
    │                      │
    ▼                      ▼
┌──────────────┐   ┌──────────────────┐
│   Prisma     │   │  Email Queue     │
│   (ORM)      │   │  (BullMQ)        │
└────────┬─────┘   └──────┬───────────┘
         │                 │
    ┌────┴─────┐      ┌────┴──────┐
    │           │      │            │
    ▼           ▼      ▼            ▼
┌──────────┐ ┌──────────────┐  ┌─────────┐
│PostgreSQL│ │ Migrations   │  │ Nodemailer
│ Database │ │              │  │ + SMTP
└──────────┘ └──────────────┘  └─────────┘
                                    ▲
                                    │
                            ┌───────┴────────┐
                            │                │
                        ┌───────┐  ┌──────────────┐
                        │ Redis │  │ Worker Process
                        └───────┘  │ (Job Consumer)
                                   └──────────────┘
```

### API Layer Organization

**Protected Routes** (Require Authentication):
- `/owner/*` - Owner/admin operations (business, staff, services, availability)
- `/bookings` - Get bookings (owner only)

**Public Routes**:
- `/auth/*` - Authentication (signup, login, refresh)
- `/public/slots` - Slot availability (public viewing)
- `/bookings` - Create bookings (customer)

---

## Database Schema

### Entity Relationships

```
User (1) ──┐
           ├─→ (1) Business
Staff ─────┘
           
Business (1) ──→ (M) Service
               ├─→ (M) Staff
               └─→ (M) AvailabilityRule
               
Service (1) ──┐
              ├─→ (M) StaffService ←─ (M) Staff
              │
              └─→ (M) Booking
              
Staff (1) ──→ (M) AvailabilityRule
           ├─→ (M) Booking
           └─→ (M) StaffService ←─ (M) Service
```

### Tables

#### `users`
```sql
id (UUID, PK)
email (STRING, UNIQUE)
passwordHash (STRING)
name (STRING)
role (ENUM: 'OWNER', 'STAFF')
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `businesses`
```sql
id (UUID, PK)
ownerId (UUID, FK→users)
name (STRING)
slug (STRING, UNIQUE)
description (TEXT)
timezone (STRING, DEFAULT: 'UTC')
isSingleStaff (BOOLEAN, DEFAULT: false)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `staff`
```sql
id (UUID, PK)
userId (UUID, FK→users, UNIQUE)
businessId (UUID, FK→businesses)
isActive (BOOLEAN, DEFAULT: true)
deletedAt (TIMESTAMP, NULL for soft delete)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `services`
```sql
id (UUID, PK)
businessId (UUID, FK→businesses)
name (STRING)
description (TEXT)
duration (INTEGER, minutes)
price (DECIMAL)
isActive (BOOLEAN, DEFAULT: true)
deletedAt (TIMESTAMP, NULL for soft delete)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `staffServices`
```sql
staffId (UUID, FK→staff, PK)
serviceId (UUID, FK→services, PK)
createdAt (TIMESTAMP)
```

#### `availabilityRules`
```sql
id (UUID, PK)
staffId (UUID, FK→staff)
dayOfWeek (INTEGER, 0-6, Monday-Sunday)
startTime (TIME)
endTime (TIME)
isWorkingDay (BOOLEAN)
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
```

#### `bookings`
```sql
id (UUID, PK)
businessId (UUID, FK→businesses)
serviceId (UUID, FK→services)
staffId (UUID, FK→staff)
clientName (STRING)
clientEmail (STRING)
clientPhone (STRING, NULLABLE)
notes (TEXT, NULLABLE)
startTimeUtc (TIMESTAMP)
endTimeUtc (TIMESTAMP)
status (ENUM: 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')
createdAt (TIMESTAMP)
updatedAt (TIMESTAMP)
UNIQUE (staffId, startTimeUtc)  ← Prevents double-booking
```

### Key Indexes

```sql
-- For fast lookups
INDEX: staff(businessId, isActive)
INDEX: services(businessId)
INDEX: bookings(businessId, status)
INDEX: bookings(staffId, startTimeUtc)
INDEX: availabilityRules(staffId)
```

---

## Module Design

### 1. **Authentication Module** (`src/modules/auth/`)

**Purpose**: User registration, login, and token management

**Endpoints**:
- `POST /auth/signup` - Register owner account
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

**Key Features**:
- PBKDF2 password hashing with random salt
- JWT token generation (access: 15 min, refresh: 7 days)
- Automatic business creation on signup
- Default staff for single-staff businesses

**Security**:
- Passwords never returned in responses
- Refresh tokens validated before issuing new access token
- Tokens include userId, email, role, and businessId

**Database Operations**:
```typescript
// User creation with validation
const user = await prisma.user.create({
  data: { email, passwordHash, name, role: 'OWNER' }
})

// Login validation
const user = await prisma.user.findUnique({ where: { email } })
const isValid = verifyPassword(password, user.passwordHash)
```

### 2. **Business Module** (`src/modules/business/`)

**Purpose**: Multi-business management with configuration

**Endpoints**:
- `POST /owner/business` - Create business
- `GET /owner/business` - List owner's businesses
- `PUT /owner/business/{businessId}` - Update business
- `GET /owner/business/public/{slug}` - Public business lookup

**Key Features**:
- Slug-based public URL for booking page
- Timezone configuration (affects all slots)
- Single vs multi-staff mode toggle
- Automatic default staff creation for single-staff mode

**Single vs Multi-Staff Mode**:
- **Single-staff**: One staff member per business, auto-created at business creation
- **Multi-staff**: Multiple staff with manual assignment to services

**Database Operations**:
```typescript
// Create business with slug validation
const business = await prisma.business.create({
  data: {
    ownerId,
    name,
    slug, // Must be unique
    timezone,
    isSingleStaff
  }
})

// Auto-create default staff if single-staff mode
if (isSingleStaff) {
  await createDefaultStaff(business.id, ownerId)
}
```

### 3. **Staff Module** (`src/modules/staff/`)

**Purpose**: Staff member management and activation

**Endpoints**:
- `POST /owner/staff/{businessId}` - Create staff
- `GET /owner/staff/{businessId}` - List staff
- `PATCH /owner/staff/{businessId}/{staffId}` - Activate/deactivate

**Key Features**:
- One-to-one relationship with users
- Soft delete support (isActive flag)
- Staff-service assignment tracking
- Default availability rules per staff

**Default Availability**:
- Monday-Friday: 9:00 AM - 5:00 PM
- Saturday-Sunday: Non-working days

**Database Operations**:
```typescript
// Create staff with default availability
const staff = await prisma.staff.create({
  data: {
    userId,
    businessId,
    isActive: true
  }
})

// Create default availability rules
for (const day of 0 to 6) {
  const isWorkingDay = day < 5 // Mon-Fri
  await createAvailabilityRule({
    staffId: staff.id,
    dayOfWeek: day,
    startTime: '09:00',
    endTime: '17:00',
    isWorkingDay
  })
}
```

### 4. **Service Module** (`src/modules/service/`)

**Purpose**: Service offering management

**Endpoints**:
- `POST /owner/services/{businessId}` - Create service
- `GET /owner/services/{businessId}` - List services
- `PATCH /owner/services/{businessId}/{serviceId}` - Update service
- `PATCH /owner/services/{businessId}/{serviceId}/toggle` - Enable/disable

**Key Features**:
- Fixed duration per service (in minutes)
- Many-to-many staff assignment
- Soft delete for deactivation
- Price tracking

**Staff Assignment**:
- In multi-staff mode: Explicitly assign staff to services
- In single-staff mode: Automatically assigned to default staff

**Database Operations**:
```typescript
// Create service with staff assignment
const service = await prisma.service.create({
  data: {
    businessId,
    name,
    duration,
    price,
    staffServices: {
      create: staffIds.map(id => ({ staffId: id }))
    }
  }
})
```

### 5. **Availability Module** (`src/modules/availability/`)

**Purpose**: Define recurring weekly availability rules

**Endpoints**:
- `PUT /owner/availability/{staffId}` - Set availability
- `GET /owner/availability/{staffId}` - Get availability

**Key Features**:
- Weekly recurrence (Monday-Sunday)
- Per-staff customization
- Working/non-working day toggles
- Integration with slot generation

**Availability Rule Structure**:
```typescript
{
  dayOfWeek: 0-6 (0=Monday, 6=Sunday),
  startTime: "HH:mm",    // 24-hour format
  endTime: "HH:mm",
  isWorkingDay: boolean  // true = staff works, false = day off
}
```

**Database Operations**:
```typescript
// Upsert availability rules for the week
for (const rule of rules) {
  await prisma.availabilityRule.upsert({
    where: {
      staffId_dayOfWeek: { staffId, dayOfWeek: rule.dayOfWeek }
    },
    create: { staffId, ...rule },
    update: rule
  })
}
```

### 6. **Slots Module** (`src/modules/slots/`)

**Purpose**: Generate available booking slots

**Endpoints**:
- `GET /public/slots` - Generate slots for date

**Key Features**:
- 15-minute interval generation
- Timezone-aware calculations
- Excludes existing bookings
- Respects availability rules
- Serializable transaction isolation

**Slot Generation Algorithm**:

```
1. Get business timezone
2. Convert requested date to UTC start/end
3. Get staff availability rules
4. For each 15-minute interval in the day:
   a. Check if within availability window
   b. Query existing bookings for conflicts
   c. Calculate end time = start + service duration
   d. Check if entire slot is available (no overlaps)
   e. If available, add to slots array
5. Return sorted available slots
```

**Conflict Detection**:
```sql
-- For each potential slot (startTime to startTime + duration)
SELECT COUNT(*) as conflicts FROM bookings
WHERE staffId = ? 
  AND status IN ('PENDING', 'CONFIRMED')
  AND (
    -- Booking overlaps with proposed slot
    (startTimeUtc, endTimeUtc) OVERLAPS (?, ?)
  )
```

**Transaction Safety**:
```typescript
const slots = await prisma.$transaction(async (tx) => {
  // Get all bookings within date range
  const bookings = await tx.booking.findMany({
    where: {
      staffId,
      startTimeUtc: { gte: dayStartUtc, lt: dayEndUtc }
    }
  })

  // Generate slots with conflict detection
  return generateSlots(/* ... */, bookings)
}, { isolationLevel: 'Serializable' })
```

### 7. **Booking Module** (`src/modules/booking/`)

**Purpose**: Create and manage customer bookings

**Endpoints**:
- `POST /bookings` - Create booking (public)
- `GET /bookings` - List bookings (owner)
- `PATCH /bookings/{bookingId}` - Update booking status

**Key Features**:
- Double-booking prevention
- Email notifications
- Status tracking (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- UTC timestamp storage

**Booking Creation Flow**:

```
1. Validate input (service, staff, time, client info)
2. Verify slot is available:
   a. Check availability rules for the date
   b. Query existing bookings for time conflicts
3. Within SERIALIZABLE transaction:
   a. Create booking record
   b. Emit email notification event
4. Return booking details
```

**Database Operations**:
```typescript
const booking = await prisma.$transaction(async (tx) => {
  // Pre-check for availability
  const conflicts = await tx.booking.findMany({
    where: {
      staffId,
      startTimeUtc: { gte: startTimeUtc },
      endTimeUtc: { lte: endTimeUtc },
      status: { in: ['PENDING', 'CONFIRMED'] }
    }
  })

  if (conflicts.length > 0) {
    throw new ConflictError('Slot not available')
  }

  // Create booking (unique constraint prevents race condition)
  return tx.booking.create({
    data: {
      businessId,
      serviceId,
      staffId,
      clientName,
      clientEmail,
      startTimeUtc,
      endTimeUtc: new Date(startTimeUtc.getTime() + duration * 60000),
      status: 'PENDING'
    }
  })
}, { isolationLevel: 'Serializable' })

// Queue email notification
await emailQueue.add('booking-confirmation', { bookingId })
```

---

## Authentication & Authorization

### JWT Token Structure

**Access Token** (15 minutes):
```json
{
  "userId": "uuid",
  "email": "owner@example.com",
  "role": "OWNER",
  "businessId": "uuid",
  "iat": 1704067200,
  "exp": 1704068100
}
```

**Refresh Token** (7 days):
```json
{
  "userId": "uuid",
  "type": "refresh",
  "iat": 1704067200,
  "exp": 1704672000
}
```

### Authorization Flow

```
Request
  ↓
Authorization Header Present? ─[NO]→ Check if public route
  │
  [YES]
  ↓
Extract Token
  ↓
Verify Signature (JWT_SECRET)
  ↓
Token Valid? ─[NO]→ Return 401 Unauthorized
  │
  [YES]
  ↓
Extract Claims (userId, businessId, role)
  ↓
Check Request Authorization
  ├─ GET /owner/* requires role=OWNER
  ├─ POST /bookings allows public
  └─ GET /public/* allows public
  ↓
Attach User to Request Context
  ↓
Proceed to Controller
```

### Protected Endpoints

**Owner-Only Routes**:
- `/owner/business/*` - Business management
- `/owner/staff/*` - Staff management
- `/owner/services/*` - Service management
- `/owner/availability/*` - Availability configuration
- `GET /bookings` - View business bookings

**Public Routes**:
- `POST /auth/signup` - Registration
- `POST /auth/login` - Login
- `POST /auth/refresh` - Token refresh
- `GET /public/slots` - Slot availability
- `POST /bookings` - Create booking

---

## Double-Booking Prevention

### Three-Layer Protection Mechanism

#### Layer 1: Pre-Check Query (Performance)
```typescript
// Check if any booking conflicts with proposed time
const conflicts = await prisma.booking.findMany({
  where: {
    staffId,
    startTimeUtc: { gte: startTime, lt: endTime },
    status: { in: ['PENDING', 'CONFIRMED'] }
  },
  take: 1
})

if (conflicts.length > 0) {
  throw new ConflictError('Slot not available')
}
```

#### Layer 2: Transaction Isolation (Consistency)
```typescript
const booking = await prisma.$transaction(async (tx) => {
  // Re-check within transaction
  const conflicts = await tx.booking.findMany({
    where: {
      staffId,
      startTimeUtc: { gte: startTime, lt: endTime },
      status: { in: ['PENDING', 'CONFIRMED'] }
    }
  })

  if (conflicts.length > 0) {
    throw new ConflictError('Slot not available')
  }

  // Create booking
  return tx.booking.create({ data: { /* ... */ } })
}, { isolationLevel: 'Serializable' })
```

#### Layer 3: Database Constraint (Atomicity)
```sql
-- Unique constraint prevents simultaneous inserts
ALTER TABLE bookings ADD UNIQUE (staffId, startTimeUtc);

-- Triggers ensure no overlapping bookings
CREATE TRIGGER check_no_overlapping_bookings
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION validate_no_overlapping_bookings();
```

### Why Three Layers?

| Layer | Purpose | Prevents |
|-------|---------|----------|
| Pre-Check Query | Fast detection (99% of cases) | Obvious conflicts |
| Serializable Isolation | Consistency across concurrent requests | Phantom reads |
| DB Unique Constraint | Atomic conflict detection | Race conditions on exact same startTime |

### Race Condition Scenario

```
Time  Thread 1                      Thread 2
────────────────────────────────────────────────
T0    Pre-check (no conflicts) ✓    
T1                                 Pre-check (no conflicts) ✓
T2    Begin transaction             
T3                                 Begin transaction
T4    Create booking (success) ✓    
T5    Commit                        
T6                                 Create booking attempt
T7                                 Unique constraint violation ✗
T8                                 Rollback + ConflictError
```

Result: One succeeds, one fails gracefully with clear error message.

---

## Timezone Handling

### Design Principles

1. **Store in UTC**: All timestamps stored in UTC
2. **Accept in Client Timezone**: Slots API accepts local datetime and timezone name
3. **Convert for Display**: Return results in original timezone

### Slot Generation with Timezone

**Example**: Business in America/New_York, request slots for Dec 25, 2024

```
Input:
  date: "2024-12-25" (in client's local timezone)
  timezone: "America/New_York"
  
Step 1: Find UTC boundaries for the date
  2024-12-25 00:00 ET = 2024-12-25 05:00 UTC
  2024-12-26 00:00 ET = 2024-12-26 05:00 UTC
  
Step 2: Query availability for this business (in ET)
  Staff works 9:00 AM - 5:00 PM ET
  = 2024-12-25 14:00 UTC - 2024-12-25 22:00 UTC
  
Step 3: Generate 15-min slots within availability
  14:00 UTC (9:00 AM ET)
  14:15 UTC (9:15 AM ET)
  14:30 UTC (9:30 AM ET)
  ... continuing through 22:00 UTC (5:00 PM ET)
  
Step 4: Exclude booked slots
  Check bookings table for existing reservations
  
Output: Array of slots in ISO 8601 UTC format
  [
    "2024-12-25T14:00:00Z",
    "2024-12-25T14:15:00Z",
    ...
  ]
```

### Daylight Saving Time (DST)

The system handles DST automatically through the Intl API:

```typescript
// Get availability start/end in business timezone
const formatter = new Intl.DateTimeFormat('en-US', {
  timeZone: business.timezone,
  hour: '2-digit',
  minute: '2-digit'
})

// On Mar 12, 2024 (DST starts): 2:00 AM → 3:00 AM
// System automatically accounts for the 1-hour jump
```

### Configuration

**Set business timezone on creation**:
```typescript
POST /owner/business
{
  "name": "Salon NYC",
  "timezone": "America/New_York",  // IANA timezone string
  "isSingleStaff": true
}
```

**Supported Timezone Formats**:
- IANA timezone strings: `America/New_York`, `Europe/London`, `Asia/Tokyo`
- UTC offset strings: `UTC+5:30`, `UTC-8`

---

## Email Notification System

### Architecture

```
Booking Created
     │
     ▼
┌──────────────────────────┐
│ BullMQ Email Job Queue   │
│ (Redis-backed)           │
└───────┬──────────────────┘
        │
    ┌───┴─────────────────────────┐
    │                             │
    ▼                             ▼
┌─────────────────────┐  ┌────────────────────┐
│ Job Processor       │  │ Job Retry Logic    │
│ (Nodemailer)        │  │ Exponential Backoff│
│                     │  │ (2s, 4s, 8s)       │
│ ├─ Render template  │  │ (Max 3 attempts)   │
│ ├─ Connect SMTP     │  └────────────────────┘
│ ├─ Send email       │
│ └─ Log result       │
└─────────────────────┘
```

### Job Queue Setup

**Queue Initialization**:
```typescript
// src/utils/queue.ts
const emailQueue = new Queue('email', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
})

// Worker that processes jobs
const worker = new Worker('email', async (job) => {
  await emailService.sendEmail(job.data)
}, { connection: /* ... */ })

// Error handling
worker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`)
})

worker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`)
})
```

### Email Job Types

**Booking Confirmation**:
```typescript
interface EmailJobData {
  type: 'booking-confirmation' | 'booking-cancellation',
  bookingId: string,
  clientEmail: string,
  clientName: string,
  serviceName: string,
  staffName: string,
  startTime: string,
  endTime: string
}
```

**Email Trigger**:
```typescript
// When booking is created
const booking = await bookingService.createBooking(/* ... */)

// Queue notification
await emailQueue.add('booking-confirmation', {
  type: 'booking-confirmation',
  bookingId: booking.id,
  clientEmail: booking.clientEmail,
  // ... other details
}, {
  // Retry on failure: 2s, 4s, 8s
  attempts: 3,
  backoff: {
    type: 'exponential',
    delay: 2000
  }
})
```

### HTML Email Templates

**Booking Confirmation Template**:
```html
<html>
  <body style="font-family: Arial, sans-serif; max-width: 600px;">
    <h2>Booking Confirmation</h2>
    <p>Hi [CLIENT_NAME],</p>
    <p>Your appointment has been confirmed!</p>
    
    <div style="background: #f5f5f5; padding: 15px; margin: 20px 0;">
      <p><strong>Service:</strong> [SERVICE_NAME]</p>
      <p><strong>Staff:</strong> [STAFF_NAME]</p>
      <p><strong>Date & Time:</strong> [DATE_TIME]</p>
      <p><strong>Duration:</strong> [DURATION] minutes</p>
    </div>
    
    <p>Thank you for booking with us!</p>
  </body>
</html>
```

### Retry Logic

**Default Retry Configuration**:
- **Max Attempts**: 3
- **Backoff Type**: Exponential
- **Backoff Delays**: 2 seconds, 4 seconds, 8 seconds

**Failure Scenarios**:
1. SMTP connection fails → Retry with backoff
2. Invalid email address → Fail immediately (no retry)
3. Timeout after 30s → Retry with backoff
4. After 3 attempts → Move to dead-letter queue

### Running the Email Worker

**Development**:
```bash
# Terminal 1: Start main server
npm run dev

# Terminal 2: Start email worker
npm run dev:worker
```

**Production**:
```bash
# Run both concurrently
npm start

# Or separately:
npm run start:server &
npm run start:worker &
```

---

## Error Handling

### Custom Error Hierarchy

All errors inherit from `AppError` base class:

```typescript
class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message)
    this.name = this.constructor.name
  }
}
```

### Error Types

| Error | Status | Use Case |
|-------|--------|----------|
| `ValidationError` | 400 | Invalid input format |
| `NotFoundError` | 404 | Resource doesn't exist |
| `ConflictError` | 409 | Double-booking, duplicate email |
| `UnauthorizedError` | 401 | Invalid/missing token |
| `ForbiddenError` | 403 | Insufficient permissions |
| `AppError` | 500 | Unexpected server error |

### Error Handling Flow

```
Request
  │
  ├─→ Validation Error
  │   └─→ 400 Bad Request
  │
  ├─→ Authentication Error (missing token)
  │   └─→ 401 Unauthorized
  │
  ├─→ Authorization Error (wrong role)
  │   └─→ 403 Forbidden
  │
  ├─→ Database Error
  │   ├─→ P2002 (unique constraint) → ConflictError (409)
  │   ├─→ P2025 (not found) → NotFoundError (404)
  │   └─→ Other → AppError (500)
  │
  └─→ Success
      └─→ 200/201 OK
```

### Error Response Format

```json
{
  "error": {
    "message": "Email already registered",
    "code": "EMAIL_CONFLICT",
    "statusCode": 409
  }
}
```

### Examples

**Validation Error**:
```typescript
if (!email || !password) {
  throw new ValidationError('Email and password are required')
}
// Returns: 400 Bad Request
```

**Conflict Error (Double-Booking)**:
```typescript
if (conflicts.length > 0) {
  throw new ConflictError('Time slot not available')
}
// Returns: 409 Conflict
```

**Not Found Error**:
```typescript
const service = await prisma.service.findUnique({
  where: { id: serviceId }
})
if (!service) {
  throw new NotFoundError(`Service ${serviceId} not found`)
}
// Returns: 404 Not Found
```

---

## Development Guide

### Project Structure

```
appoint/backend/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── index.ts               # Server entry point
│   ├── config/
│   │   └── env.ts             # Environment configuration
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT verification
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── types.ts
│   │   │   ├── service.ts
│   │   │   └── controller.ts
│   │   ├── business/
│   │   ├── staff/
│   │   ├── service/
│   │   ├── availability/
│   │   ├── slots/
│   │   └── booking/
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── business.ts
│   │   ├── staff.ts
│   │   ├── service.ts
│   │   ├── availability.ts
│   │   ├── slots.ts
│   │   └── booking.ts
│   └── utils/
│       ├── errors.ts          # Custom error classes
│       ├── jwt.ts             # Token generation
│       ├── password.ts        # PBKDF2 hashing
│       ├── queue.ts           # BullMQ setup
│       ├── email.service.ts   # Email templates
│       └── logger.ts          # Logging utility
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Auto-generated migrations
├── package.json
├── tsconfig.json
├── .env.example
├── .eslintrc.json
└── swagger.json               # API documentation
```

### Getting Started

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration:
#   - PostgreSQL connection
#   - Redis connection
#   - JWT secrets
#   - SMTP credentials
```

#### 3. Initialize Database
```bash
# Create database and run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

#### 4. Run Development Server
```bash
# Terminal 1: Start API server
npm run dev

# Terminal 2: Start email worker
npm run dev:worker

# Server runs on http://localhost:3000
# API docs: http://localhost:3000/docs/swagger.json
```

### NPM Scripts

```json
{
  "dev": "concurrently \"nodemon\" \"npm run dev:worker\"",
  "dev:worker": "nodemon --exec tsx src/worker.ts",
  "build": "tsc",
  "start": "node dist/index.js",
  "start:worker": "node dist/worker.js",
  "lint": "eslint src --ext .ts",
  "format": "prettier --write src",
  "migrate": "prisma migrate dev",
  "db:push": "prisma db push",
  "db:seed": "prisma db seed",
  "test": "jest"
}
```

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/appoint

# Server
NODE_ENV=development
PORT=3000
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Email (Nodemailer SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@appoint.local
```

### Database Migrations

**Create new migration**:
```bash
npx prisma migrate dev --name <migration-name>
```

**Apply migrations**:
```bash
npx prisma migrate deploy
```

**Reset database** (development only):
```bash
npx prisma migrate reset
```

### Code Quality

**Linting**:
```bash
npm run lint
```

**Formatting**:
```bash
npm run format
```

**TypeScript Checking**:
```bash
npx tsc --noEmit
```

### Testing

**Run tests**:
```bash
npm test
```

**Test coverage**:
```bash
npm test -- --coverage
```

---

## Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong JWT secrets (32+ chars, random)
- [ ] Configure PostgreSQL with SSL enabled
- [ ] Setup Redis with password authentication
- [ ] Configure SMTP credentials
- [ ] Enable CORS for allowed domains
- [ ] Setup rate limiting on public endpoints
- [ ] Configure database backups
- [ ] Setup logging/monitoring (Sentry, DataDog)
- [ ] Run database migrations
- [ ] Build TypeScript: `npm run build`
- [ ] Start both server and worker processes
- [ ] Verify health endpoint: `GET /health`
- [ ] Test authentication flow
- [ ] Test booking creation and email delivery

---

## Performance Optimization

### Database Indexes
Already configured for:
- Staff lookup by business
- Service lookup by business
- Booking lookup by staff and date
- Availability rule lookup

### Query Optimization
- Use `findUnique` for PK lookups
- Use `findMany` with filters for lists
- Avoid N+1 queries with `include`/`select`
- Use pagination for large result sets

### Caching Opportunities
- Business timezone (rarely changes)
- Availability rules (weekly recurrence)
- Service list (cached on frontend)

---

## Monitoring & Logging

### Key Metrics

- Request duration
- Database query time
- Email delivery success rate
- Failed job count
- User signup/login rate
- Booking creation rate

### Logging

```typescript
logger.info('Booking created', { bookingId, staffId, startTime })
logger.error('Email send failed', { error, jobId })
logger.warn('Slow query', { duration: '500ms', query })
```

---

## Troubleshooting

### Common Issues

**1. Double-booking still occurring**
- Check isolation level in transactions
- Verify unique constraint exists on bookings table
- Check if Serializable isolation is enabled

**2. Emails not sending**
- Verify Redis is running: `redis-cli ping`
- Check SMTP credentials in .env
- Check email worker process is running
- Review worker logs for job failures

**3. Slots not generating**
- Verify availability rules exist for staff
- Check if availability is marked `isWorkingDay: true`
- Verify timezone configuration
- Check for existing bookings

**4. Authentication failures**
- Verify JWT_SECRET is set
- Check token expiry time
- Verify refresh token is valid
- Check user role has permission

---

## Future Enhancements

- [ ] Webhook support for external integrations
- [ ] SMS notifications for bookings
- [ ] Recurring appointments
- [ ] Payment processing integration
- [ ] Customer review/rating system
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Calendar sync (Google, Outlook)
- [ ] Automated reminders before appointments
- [ ] Staff performance metrics

---

## Support & Contact

For issues or questions:
1. Check troubleshooting section above
2. Review error messages in logs
3. Consult database schema diagram
4. Contact development team

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Maintainer**: Piyush Pandey
