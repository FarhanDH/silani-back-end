# Auth API Spec

## Register User Using Password

Endpoint : POST /api/auth/register

Request Body :

```json
{
  "fullName": "Joko Pirang",
  "email": "joko@mail.com",
  "password": "rahasia"
}
```

Response Body :

```json
{
  "id": "12345678-1234-1234-1234-1234567890ab",
  "fullName": "Joko Pirang",
  "email": "joko@mail.com"
}
```

## Login User Using Password

Endpoint : POST /api/auth/login

Request Body :

```json
{
  "email": "joko@mail.com",
  "password": "rahasia"
}
```

Response Body :

```json
{
  "user": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "fullName": "Joko Pirang",
    "email": "joko@mail.com",
    "dateOfBirth": null,
    "avatarUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  "backendTokens": {
    "accessToken": "JWT Token",
    "expiresIn": 12345
  }
}
```

## Sign In User Using Google

Endpoint : GET /api/auth/google

Response Body :

```json
{
  "user": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "fullName": "Joko Pirang",
    "email": "joko@mail.com",
    "dateOfBirth": null,
    "googleId": "1234567",
    "avatarUrl": "",
    "createdAt": "",
    "updatedAt": ""
  },
  "backendTokens": {
    "accessToken": "JWT Token",
    "expiresIn": 12345
  }
}
```
