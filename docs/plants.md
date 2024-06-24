# Plants API Spec

## Create Plant

Endpoint : POST /api/plants

Request Form Data:

```json
  "name": "string",
  "plantCategoryId": "string",
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension"
```

Response Body :

```json
{
  "message": "Plant created successfully",
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": "",
    "plantCategory": {
      "id": "",
      "name": "",
      "createdAt": "",
      "updatedAt": ""
    }
  }
}
```

## Get All Plants

Endpoint : GET /api/plants

Response Body :

```json
{
  "message": "Plants retrieved successfully",
  "data": [
    {
      "id": "",
      "name": "",
      "imageUrl": "",
      "imageKey": "",
      "createdAt": "",
      "updatedAt": "",
      "plantCategory": {
        "id": "",
        "name": "",
        "createdAt": "",
        "updatedAt": ""
      }
    }
  ]
}
```

## Get Plant By Id

Endpoint : PUT /api/plants/:plantId

Response Body :

```json
{
  "message": "Plant retrieved successfully",
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": "",
    "plantCategory": {
      "id": "",
      "name": "",
      "createdAt": "",
      "updatedAt": ""
    }
  }
}
```

## Update Plant By Id

Endpoint : PUT /api/plants/:plantId

Request Form Data:

```json
  "name": "string", (Optional)
  "plantCategoryId": "string", (Optional)
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension" (Optional)
```

Response Body :

```json
{
  "message": "Plant updated successfully",
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": "",
    "plantCategory": {
      "id": "",
      "name": "",
      "createdAt": "",
      "updatedAt": ""
    }
  }
}
```

## Delete Plant By Id

Endpoint : DELETE /api/plants/:plantId

Response Body :

```json
{
  "message": "Plant deleted successfully",
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": "",
    "plantCategory": {
      "id": "",
      "name": "",
      "createdAt": "",
      "updatedAt": ""
    }
  }
}
```
