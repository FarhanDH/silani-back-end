# Fields API Spec

## Create Field

Endpoint : POST /api/fields

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Form Data:

```json
  "name": "string"
  "location": "string"
  "area": "string" (m^2)
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension" (Optional)
```

Response Body :

```json
{
  "message": "Field created successfully",
  "data": {
    "id": "",
    "userId": "",
    "name": "",
    "location": "",
    "area": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Get All Fields

Endpoint : GET /api/fields

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Fields retrieved successfully",
  "data": [
    {
      "id": "",
      "userId": "",
      "name": "",
      "location": "",
      "area": "",
      "imageUrl": "",
      "imageKey": "",
      "createdAt": "",
      "updatedAt": ""
    }
  ]
}
```

## Get Field By Id

Endpoint : GET /api/fields/:id

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Field retrieved successfully",
  "data": {
    "id": "",
    "userId": "",
    "name": "",
    "location": "",
    "area": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Update Field By Id

Endpoint : PUT /api/fields/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Form Data:

```json
  "name": "string" (Optional)
  "location": "string" (Optional)
  "area": "string" (m^2) (Optional)
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension" (Optional)
```

Response Body :

```json
{
  "message": "Field updated successfully",
  "data": {
    "id": "",
    "userId": "",
    "name": "",
    "location": "",
    "area": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Delete Field By Id

Endpoint : DELETE /api/fields/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Field deleted successfully",
  "data": {
    "id": "",
    "userId": "",
    "name": "",
    "location": "",
    "area": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```
