# Error Handling & Request Validation Guide

## Error Handling

The application uses a centralized error handling system with standardized error responses.

### Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "statusCode": 400
  },
  "timestamp": "2024-01-21T10:30:00.000Z",
  "path": "/api/endpoint",
  "requestId": "1234567890-abc123"
}
```

### Error Status Codes

| Status | Error | Meaning |
|--------|-------|---------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED_ERROR | Missing or invalid authentication |
| 404 | NOT_FOUND_ERROR | Resource not found |
| 409 | CONFLICT_ERROR | Resource conflict (e.g., duplicate) |
| 500 | INTERNAL_SERVER_ERROR | Unexpected server error |

### Error Classes

```typescript
// Custom error classes available
AppError              // Base error class
UnauthorizedError     // 401 - Authentication failed
NotFoundError         // 404 - Resource not found
ConflictError         // 409 - Conflict
ValidationError       // 400 - Validation failed
```

### Usage in Route Handlers

```typescript
import { asyncHandler } from '@/middlewares/errorHandler'
import { ValidationError, NotFoundError } from '@/utils/errors'

router.post('/users', asyncHandler(async (req, res) => {
  if (!req.body.email) {
    throw new ValidationError('Email is required')
  }

  const user = await findUser(req.body.email)
  if (!user) {
    throw new NotFoundError('User not found')
  }

  res.json(user)
}))
```

### Error Logging

- **Development**: Full error stack trace is logged and returned
- **Production**: Only error code and message are returned to client, full stack is logged server-side

## Request Validation

The application provides two validation middleware options: `validate` and `validateQuery`.

### Validation Rules

```typescript
export type ValidationRule = {
  field: string                              // Field name
  type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'array' | 'object'
  required?: boolean                         // Field is required
  minLength?: number                         // Min string length
  maxLength?: number                         // Max string length
  min?: number                               // Min number value
  max?: number                               // Max number value
  pattern?: RegExp                           // Custom regex pattern
  custom?: (value: any) => boolean | string // Custom validation function
}
```

### Body Validation Example

```typescript
import { validate } from '@/middlewares/validation'
import { asyncHandler } from '@/middlewares/errorHandler'

router.post('/users',
  validate([
    { field: 'email', type: 'email', required: true },
    { field: 'password', type: 'string', required: true, minLength: 8 },
    { field: 'age', type: 'number', min: 18, max: 120 },
    { field: 'terms', type: 'boolean', required: true },
  ]),
  asyncHandler(async (req, res) => {
    // Validation already passed
    const user = await createUser(req.body)
    res.status(201).json(user)
  })
)
```

### Query Validation Example

```typescript
import { validateQuery } from '@/middlewares/validation'

router.get('/users',
  validateQuery([
    { field: 'page', type: 'number', min: 1 },
    { field: 'limit', type: 'number', min: 1, max: 100 },
    { field: 'search', type: 'string', maxLength: 100 },
  ]),
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query
    const users = await findUsers({ page, limit, search })
    res.json(users)
  })
)
```

### Custom Validation

```typescript
router.post('/users',
  validate([
    {
      field: 'password',
      type: 'string',
      custom: (value) => {
        // Check password complexity
        if (!/[A-Z]/.test(value)) {
          return 'Password must contain at least one uppercase letter'
        }
        if (!/[0-9]/.test(value)) {
          return 'Password must contain at least one number'
        }
        return true
      }
    }
  ])
)
```

## Security Headers

All responses include security headers:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking
- **X-XSS-Protection**: `1; mode=block` - XSS protection
- **Content-Security-Policy**: Restricts resource loading
- **Strict-Transport-Security**: Enforces HTTPS (production only)
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Disables dangerous APIs

## CORS Configuration

### Allowed Origins (Development)

```
http://localhost:5173
http://localhost:3000
http://127.0.0.1:5173
http://127.0.0.1:3000
```

### Allowed Methods

```
GET, POST, PUT, DELETE, PATCH, OPTIONS
```

### Allowed Headers

```
Content-Type, Authorization, X-Requested-With
```

### Exposed Headers

```
Content-Length, X-Request-Id
```

## Request ID

Each request receives a unique ID for tracking:

- Header: `X-Request-Id`
- Format: `${Date.now()}-${randomString}` or custom from client
- Used in logs and error responses

```bash
# With custom request ID
curl -H "X-Request-Id: my-custom-id" http://localhost:3000/api/health
```

## Rate Limiting (Future)

Headers for rate limiting:

```
X-RateLimit-Limit: 100
X-RateLimit-Window: 60
X-RateLimit-Remaining: 42
```

## Examples

### Successful Response

```json
{
  "id": "user-123",
  "email": "user@example.com",
  "name": "John Doe"
}
```

### Validation Error

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "{\"email\":\"must be a valid email address\",\"password\":\"must be at least 8 characters\"}",
    "statusCode": 400
  },
  "timestamp": "2024-01-21T10:30:00.000Z",
  "path": "/api/auth/login",
  "requestId": "1234567890-abc123"
}
```

### Not Found Error

```json
{
  "error": {
    "code": "NOT_FOUND_ERROR",
    "message": "User not found",
    "statusCode": 404
  },
  "timestamp": "2024-01-21T10:30:00.000Z",
  "path": "/api/users/invalid-id",
  "requestId": "1234567890-abc123"
}
```

### Unauthorized Error

```json
{
  "error": {
    "code": "UNAUTHORIZED_ERROR",
    "message": "Invalid or expired token",
    "statusCode": 401
  },
  "timestamp": "2024-01-21T10:30:00.000Z",
  "path": "/api/owner/business/123",
  "requestId": "1234567890-abc123"
}
```

## Best Practices

1. **Always use asyncHandler for async routes** - Catches unhandled promise rejections
2. **Throw appropriate error types** - Use specific error classes (ValidationError, NotFoundError, etc.)
3. **Validate input early** - Use validation middleware at route level
4. **Log errors appropriately** - Different log levels for different error types
5. **Don't expose sensitive data** - Never include passwords or tokens in error messages
6. **Use request IDs** - For debugging and tracing issues
7. **Return consistent format** - All responses follow the same structure
8. **Include helpful messages** - Error messages should guide clients on what went wrong

## Integration

Import and use in your routes:

```typescript
// Backend route example
import { validate } from '@/middlewares/validation'
import { asyncHandler } from '@/middlewares/errorHandler'
import { ValidationError, NotFoundError } from '@/utils/errors'

router.post('/items',
  validate([
    { field: 'name', type: 'string', required: true, minLength: 3 },
    { field: 'price', type: 'number', required: true, min: 0.01 },
  ]),
  asyncHandler(async (req, res) => {
    try {
      const item = await createItem(req.body)
      res.status(201).json(item)
    } catch (err) {
      if (err.code === 'DUPLICATE_KEY') {
        throw new ConflictError('Item already exists')
      }
      throw err
    }
  })
)
```
