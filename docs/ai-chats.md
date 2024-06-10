# AI Chat API Spec

## Create Chat

Endpoint : POST /api/ai-chat

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Form Data:

```json
{
  "prompt": "string",
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension (required)"
}
```

Response Body :

```json
{
  "message": "AI chat sent successfully",
  "data": {
    "id": "",
    "userId": "",
    "prompt": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": ""
  }
}
```

## Get All Chats

Endpoint : GET /api/ai-chats

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "AI chats retrieved successfully",
  "data": {
    "id": "",
    "fullName": "",
    "email": "",
    "dateOfBirth": null,
    "avatarUrl": "",
    "googleId": null,
    "facebookId": null,
    "createdAt": "",
    "updatedAt": "",
    "aIChats": [
      {
        "id": "",
        "prompt": "",
        "response": "",
        "imageUrl": "",
        "imageKey": "",
        "createdAt": ""
      }
    ]
  }
}
```
