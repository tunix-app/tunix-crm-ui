# Backend API Endpoints for Settings Integration

Your NestJS backend should implement the following endpoints to work with the Settings page:

## Authentication
All endpoints should require authentication via Bearer token in the Authorization header.

## User Profile Endpoints

### GET /api/user/profile
Returns the current user's profile information.

**Response:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "title": "Head Trainer",
  "bio": "Certified personal trainer with 8+ years of experience...",
  "profileImage": "https://example.com/profile.jpg"
}
```

### PUT /api/user/profile
Updates the current user's profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "(555) 123-4567",
  "title": "Head Trainer",
  "bio": "Updated bio text..."
}
```

## Notification Settings Endpoints

### GET /api/user/notifications
Returns the current user's notification preferences.

**Response:**
```json
{
  "emailNotifications": true,
  "pushNotifications": true,
  "sessionReminders": true,
  "clientUpdates": true,
  "marketingEmails": false
}
```

### PUT /api/user/notifications
Updates notification preferences.

**Request Body:** Same as response format

## Appearance Settings Endpoints

### GET /api/user/appearance
Returns the current user's appearance preferences.

**Response:**
```json
{
  "theme": "light",
  "compactMode": false,
  "showClientPhotos": true,
  "defaultCalendarView": "week"
}
```

### PUT /api/user/appearance
Updates appearance preferences.

**Request Body:** Same as response format

## Security Endpoints

### POST /api/user/change-password
Changes the user's password.

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

## Billing Endpoints (Optional - for future implementation)

### GET /api/user/billing
Returns billing information

### GET /api/user/payment-methods
Returns payment methods

### GET /api/user/billing-history
Returns billing history

## Error Handling
All endpoints should return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request (validation errors)
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error response format:
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "statusCode": 400
}
```
