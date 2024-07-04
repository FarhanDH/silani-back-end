# Planting Activity API Spec

## Create Planting Activity

Endpoint : POST /api/planting-activities

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Body:

```ts
{
  "fieldId": string (id of field belongs to the current user),
  "plantId": string (id of plant),
  "harvestEstimateDate": Date (Optional and must be greater than today),
  "harvestedAt": Date (Optional and must be greater than today),
  "harvestAmount": number (Optional)
}
```

Response Body :

```json
{
    "message": "Planting Activity created successfully",
    "data": {
        "id": "",
        "fieldId": "",
        "plantId": "",
        "harvestEstimateDate": "",
        "createdAt": "",
        "updatedAt": "",
        "harvestAmount": ,
        "harvestedAt":
    }
}
```

## Get All Planting Activities only belongs to the current user

Endpoint : GET /api/planting-activities

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body:

```json
{
    "message": "Planting Activities retrieved successfully",
    "data": [
        {
            "id": "",
            "fieldId": "",
            "plantId": "",
            "harvestEstimateDate": "",
            "createdAt": "",
            "updatedAt": "",
            "harvestAmount": ,
            "harvestedAt":
        }
    ]
}
```

## Get Planting Activity By Id only belongs to the current user

Endpoint : GET /api/planting-activities/:id

Request Header:

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
    "message": "Planting Activity retrieved successfully",
    "data": {
        "id": "",
        "fieldId": "",
        "plantId": "",
        "harvestEstimateDate": "",
        "createdAt": "",
        "updatedAt": "",
        "harvestAmount": ,
        "harvestedAt":
    }
}
```

## Update Planting Activity By Id and only user that created it

Endpoint : PUT /api/planting-activities/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Request Form Data:

Request Body:

```ts
{
  "fieldId": string (Optional and id of field belongs to the current user),
  "plantId": string (Optional and id of plant),
  "harvestEstimateDate": Date (Optional and must be greater than today),
  "harvestedAt": Date (Optional and must be greater than today),
  "harvestAmount": number (Optional)
}
```

Response Body :

```json
{
    "message": "Planting Activity updated successfully",
    "data": {
        "id": "",
        "fieldId": "",
        "plantId": "",
        "harvestEstimateDate": "",
        "createdAt": "",
        "updatedAt": "",
        "harvestAmount": ,
        "harvestedAt": ""
    }
}
```

## Delete Planting Activity By Id and only user that created it

Endpoint : DELETE /api/planting-activities/:id

```json
{
  "Authorization": "Bearer <token>"
}
```

Response Body :

```json
{
    "message": "Planting Activity deleted successfully",
    "data": {
        "id": "",
        "fieldId": "",
        "plantId": "",
        "harvestEstimateDate": "",
        "createdAt": "",
        "updatedAt": "",
        "harvestAmount": ,
        "harvestedAt": ""
    }
}
```
