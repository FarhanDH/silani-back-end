# Field Pest API Spec

## Create Field Pest

Endpoint : POST /api/field-pests

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Body:

```json
{
  "fieldId": "",
  "pestId": ""
}
```

Response Body :

```json
{
  "message": "Field Pest created successfully",
  "data": {
    "id": "",
    "pestId": "",
    "fieldId": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Get All Field Pests

Endpoint : GET /api/field-pests

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Field Pests retrieved successfully",
  "data": [
    {
      "id": "",
      "pestId": "",
      "fieldId": "",
      "createdAt": "",
      "updatedAt": ""
    }
  ]
}
```

## Get Field Pest By Id

Endpoint : GET /api/field-pests/:id

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Field Pest retrieved successfully",
  "data": {
    "id": "",
    "pestId": "",
    "fieldId": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Update Field Pest By Id

Endpoint : PUT /api/field-pests/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Form Data:

```json
{
  "fieldId": "", (Optional)
  "pestId": "" (Optional)
}
```

Response Body :

```json
{
  "message": "Field Pest updated successfully",
  "data": {
    "id": "",
    "pestId": "",
    "fieldId": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Delete Field Pest By Id

Endpoint : DELETE /api/field-pests/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
  "message": "Field Pest deleted successfully",
  "data": {
    "id": "",
    "pestId": "",
    "fieldId": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```
