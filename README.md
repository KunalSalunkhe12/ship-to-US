# Express Server Documentation

This document provides an overview of the Express server application, including its endpoints and functionalities.

## Table of Contents

1. [Server Setup](#server-setup)
2. [Endpoints](#endpoints)
   - [GET /](#get-)
   - [POST /rates](#post-rates)
   - [POST /section321-insights](#post-section321-insights)
   - [POST /ports-insights](#post-ports-insights)
   - [POST /compare-rates](#post-compare-rates)
3. [Error Handling](#error-handling)

## Server Setup

The server is built using Express.js and includes the following setup:

- JSON body parsing
- CORS enabled for cross-origin requests
- Static file serving from the 'public' directory
- Listening on PORT 3000 by default (can be overridden by setting the PORT environment variable)

## Endpoints

### GET /

Serves static files from the 'public' directory.

### POST /rates

Retrieves optimal shipping rates based on provided shipment details.

#### Request Body

```json
{
  "country_of_origin": "string",
  "product_description": "string",
  "weight": "number",
  "dimensions": "string",
  "shipping_method": "string",
  "us_destination": "string"
}
```

#### Response

```json
{
  "message": "Hello from the Express server!",
  "optimal_rates": "object"
}
```

### POST /section321-insights

Provides insights related to Section 321 based on shipment details.

#### Request Body

```json
{
  "country_of_origin": "string",
  "product_description": "string",
  "weight": "number",
  "dimensions": "string",
  "shipping_method": "string",
  "us_destination": "string",
  "shipping_value": "number"
}
```

#### Response

Returns insights from the AI model.

### POST /ports-insights

Provides insights about ports based on shipment details.

#### Request Body

```json
{
  "country_of_origin": "string",
  "product_description": "string",
  "weight": "number",
  "dimensions": "string",
  "shipping_method": "string",
  "us_destination": "string",
  "shipping_value": "number"
}
```

#### Response

Returns insights about ports from the AI model.

### POST /compare-rates

Compares different shipping rates for a given shipment.

#### Request Body

```json
{
  "rates": "array",
  "shipment": "object"
}
```

#### Response

Returns a comparison of rates from the AI model.

## Error Handling

- All endpoints include error handling for missing parameters (400 Bad Request) and internal server errors (500 Internal Server Error).
- Errors are logged to the console for debugging purposes.
