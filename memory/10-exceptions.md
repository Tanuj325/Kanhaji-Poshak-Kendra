# EXCEPTIONS & ERROR HANDLING - Complete Analysis

## Custom Exception Classes

| Exception | HTTP Status | When Thrown |
|---|---|---|
| `ResourceNotFoundException` | 404 | Entity not found by ID/slug |
| `DuplicateResourceException` | 409 | Duplicate email, phone, slug, SKU, etc. |
| `BadRequestException` | 400 | Invalid request parameters |
| `ForbiddenException` | 403 | User lacks permission |
| `UnauthorizedException` | 401 | Not authenticated |
| `BusinessException` | 422 | Business rule violation |
| `PaymentProcessingException` | 422 | Payment processing failure |
| `RazorpayException` | 422 | Razorpay API failure |
| `FileStorageException` | 422 | Cloudinary upload/delete failure |

## Error Response Format

### Standard Error (ErrorResponse)
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable error message",
  "path": "/api/some-endpoint"
}
```

### Validation Error (ValidationErrorResponse)
```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "validationErrors": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  },
  "path": "/api/auth/register"
}
```

## GlobalExceptionHandler - Exception Mapping

| Exception | Status | Response |
|---|---|---|
| `ResourceNotFoundException` | 404 | ErrorResponse |
| `DuplicateResourceException` | 409 | ErrorResponse |
| `BadRequestException` | 400 | ErrorResponse |
| `ForbiddenException` | 403 | ErrorResponse |
| `UnauthorizedException` | 401 | ErrorResponse |
| `BusinessException` | 422 | ErrorResponse |
| `AccessDeniedException` | 403 | "You do not have permission to perform this action" |
| `BadCredentialsException` | 401 | "Invalid email or password" |
| `MethodArgumentNotValidException` | 400 | ValidationErrorResponse (field errors) |
| `ConstraintViolationException` | 400 | ValidationErrorResponse |
| `HttpMessageNotReadableException` | 400 | "Malformed JSON request body" |
| `MethodArgumentTypeMismatchException` | 400 | "Invalid value 'x' for parameter 'y'" |
| `MissingServletRequestParameterException` | 400 | "Required parameter 'x' is missing" |
| `HttpRequestMethodNotSupportedException` | 405 | Method not allowed message |
| `MaxUploadSizeExceededException` | 413 | "Uploaded file is too large" |
| `DataIntegrityViolationException` | 409 | "conflicts with existing data" |
| `Exception` (fallback) | 500 | "An unexpected error occurred" |

