# Krishana Poshak - Backend Blueprint

## Memory Directory

This directory contains a complete reverse-engineered analysis of the Krishana Poshak e-commerce backend (Spring Boot).

### Files Index

| File | Description |
|---|---|
| [01-entities.md](./01-entities.md) | All 20 entities with fields, relationships, cascade types, and business purpose |
| [02-enums.md](./02-enums.md) | All 9 enums with values and usage locations |
| [03-controllers.md](./03-controllers.md) | All 21 controllers with endpoints, auth, roles, request/response types |
| [04-dtos.md](./04-dtos.md) | All 50+ DTOs with fields, types, validations |
| [05-security.md](./05-security.md) | JWT flow, authentication, authorization, CORS |
| [06-exceptions.md](./06-exceptions.md) | Error handling, custom exceptions, response formats |
| [07-payment.md](./07-payment.md) | Razorpay integration, payment/refund/webhook flow |
| [08-email-notification.md](./08-email-notification.md) | Email service, templates, notification system |
| [09-cloudinary.md](./09-cloudinary.md) | Image upload/delete/update flow, folder structure |
| [10-exceptions.md](./10-exceptions.md) | Exception hierarchy and GlobalExceptionHandler mapping |
| [11-business-flow.md](./11-business-flow.md) | End-to-end business flows for customer and admin |
| [12-mappers.md](./12-mappers.md) | All 19 mappers with mapping methods |
| [13-repositories.md](./13-repositories.md) | All 22 repositories with custom query methods |

### Technology Stack
- **Backend**: Spring Boot 3.x, Java 17+
- **Database**: MySQL (JPA/Hibernate, ddl-auto=update)
- **Security**: JWT (io.jsonwebtoken), BCrypt, Spring Security
- **Payment**: Razorpay API
- **File Storage**: Cloudinary
- **Email**: Spring Mail + Thymeleaf templates
- **API Docs**: OpenAPI/Swagger (springdoc)

### Key Port: 9090 (configurable via SERVER_PORT)
### Frontend URL (dev): https://kanhajiposhak.vercel.app

