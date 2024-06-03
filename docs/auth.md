# Auth API Spec

## Register User Using Password

Endpoint : POST /api/auth/register

Request Body :

```json
{
  "fullName": "Joko Pirang",
  "email": "joko@mail.com",
  "dateOfBirth": "2024-06-02" | null,
  "password": "rahasia"
}
```

Response Body :

```json
{
  "message": "User registered successfully",
  "data": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "fullName": "Joko Pirang",
    "email": "joko@mail.com",
    "avatarUrl": "https:...",
    "dateOfBirth": "2024-06-02",
    "createdAt": "2024-06-02T14:03:59.960Z",
    "updatedAt": "2024-06-02T14:03:59.960Z"
  }
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
  "message": "User logged in successfully",
  "data": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "fullName": "Joko Pirang",
    "email": "joko@mail.com",
    "avatarUrl": "https:...",
    "dateOfBirth": "2024-06-02",
    "createdAt": "2024-06-02T14:03:59.960Z",
    "updatedAt": "2024-06-02T14:03:59.960Z",
    "token": {
      "accessToken": "",
      "expiresIn": 12345678910
    }
  }
}
```

## Sign In User Using Google

Endpoint : POST /api/auth/google

Request Body :

```json
{
  "fullName": "Joko Pirang",
  "email": "joko@mail.com",
  "avatarUrl": "https:...",
  "googleId": "105203025571464766679"
}
```

Response Body :

```json
{
  "message": "User logged in successfully",
  "data": {
    "id": "12345678-1234-1234-1234-1234567890ab",
    "fullName": "Angin Malam",
    "email": "farhandwihartantu@gmail.com",
    "dateOfBirth": null,
    "googleId": "105203025571464766679",
    "avatarUrl": "https:...",
    "createdAt": "2024-06-01T08:46:57.171Z",
    "updatedAt": "2024-06-01T08:46:57.171Z",
    "token": {
      "accessToken": "",
      "expiresIn": 12345678910
    }
  }
}
```
