# Pests API Spec

## Create Pest

Endpoint : POST /api/pests

Request Form Data:

```json
{
  "name": "string",
  "image": "file (jpg|jpeg|png|svg|tiff|webp) extension"
}
```

Response Body :

```json
{
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Get All Pests

Endpoint : GET /api/pests

Response Body :

```json
{
  "data": [
    {
      "id": "",
      "name": "",
      "imageUrl": "",
      "imageKey": "",
      "createdAt": "",
      "updatedAt": ""
    }
  ]
}
```

## Update Pest ById

Endpoint : PUT /api/pests/:pestId

Request Body:

```json
{
  "name": "string"
}
```

Response Body :

```json
{
  "data": {
    "id": "",
    "name": "",
    "imageUrl": "",
    "imageKey": "",
    "createdAt": "",
    "updatedAt": ""
  }
}
```

## Delete Pest ById

Endpoint : DELETE /api/pests/:pestId

Response Body :

```json
{
  "data": {
    "message": "Pest deleted successfully"
  }
}
```
