# Reminder API Spec

## Create Reminder

Endpoint : POST /api/reminders

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Body:

```json
{
  "plantingActivityId": "70b47b93-f9e7-4f08-9951-748a0af75fa8",
  "title": "Ingatkan Aku",
  "dateRemind": "2024-09-09 11:30:00"
}
```

Response Body :

```json
{
  "message": "Reminder created successfully",
  "data": {
    "id": "195a168d-ad91-4706-b53c-37b6862d42e6",
    "plantingActivityId": "70b47b93-f9e7-4f08-9951-748a0af75fa8",
    "title": "Ingatkan Aku",
    "dateRemind": "2024-09-09T03:30:00.000Z",
    "createdAt": "2024-07-08T12:34:51.852Z",
    "updatedAt": "2024-07-08T12:34:51.852Z"
  }
}
```

## Get All Reminders only belongs to the current user

Endpoint : GET /api/reminders

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body:

```json
{
  "message": "Reminders retrieved successfully",
  "data": [
    {
      "id": "e1af1329-2550-4a95-b97b-9f17de8b992d",
      "plantingActivityId": "8a4036a4-5aec-44b5-9ec6-ff3de0da90b9",
      "title": "Ingatkan Aku",
      "dateRemind": "2024-09-09T03:30:00.000Z",
      "createdAt": "2024-07-08T08:59:35.655Z",
      "updatedAt": "2024-07-08T08:59:35.655Z"
    }
  ]
}
```

## Get Reminder By Id only belongs to the current user

Endpoint : GET /api/reminders/:id

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Reminder retrieved successfully",
  "data": {
    "id": "ba269a65-f45a-48e0-b8f3-59e0133f867d",
    "plantingActivityId": "70b47b93-f9e7-4f08-9951-748a0af75fa8",
    "title": "Ingatkan Aku",
    "dateRemind": "2024-09-09T03:30:00.000Z",
    "createdAt": "2024-07-08T12:31:34.584Z",
    "updatedAt": "2024-07-08T12:31:34.584Z"
  }
}
```

## Update Reminder By Id and only user that created it

Endpoint : PUT /api/reminders/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Body:

```json
{
    "plantingActivityId": "8a4036a4-5aec-44b5-9ec6-ff3de0da90b9", (Optional)
    "title": "Ingatkan Aku", (Optional)
    "dateRemind": "2024-09-09 11:30:00" (Optional)
}
```

Response Body :

```json
{
  "message": "Reminder updated successfully",
  "data": {
    "id": "ba269a65-f45a-48e0-b8f3-59e0133f867d",
    "plantingActivityId": "70b47b93-f9e7-4f08-9951-748a0af75fa8",
    "title": "Ingatkan Aku",
    "dateRemind": "2024-09-09T03:30:00.000Z",
    "createdAt": "2024-07-08T12:31:34.584Z",
    "updatedAt": "2024-07-08T12:31:34.584Z"
  }
}
```

## Delete Reminder By Id and only user that created it

Endpoint : DELETE /api/reminders/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Reminder deleted successfully",
  "data": {
    "id": "a2e88f7b-83b9-4885-8d02-1862bce5b5e1",
    "plantingActivityId": "70b47b93-f9e7-4f08-9951-748a0af75fa8",
    "title": "Ingatkan Aku",
    "dateRemind": "2024-09-09T03:30:00.000Z",
    "createdAt": "2024-07-08T09:00:59.893Z",
    "updatedAt": "2024-07-08T09:00:59.893Z"
  }
}
```
