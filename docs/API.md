# API Notes

Base URL: `http://localhost:5000/api`

Protected endpoints require `Authorization: Bearer <token>`.

## Register
`POST /auth/register`
```json
{"name":"Sample Customer","email":"sample@example.com","password":"Password123"}
```
Registration always creates a `customer`; clients cannot self-assign the admin role.

## Login
`POST /auth/login`
```json
{"email":"customer@arrowstack.demo","password":"Customer@123"}
```
Returns `{ "token": "...", "user": { "id": 2, "name": "...", "email": "...", "role": "customer" } }`.

## Create product (admin)
`POST /products`
```json
{"name":"Sample Product","sku":"SAMPLE-01","description":"Description","price":125.5,"stock":30,"category_id":1,"image_url":""}
```

## Checkout (customer)
`POST /orders`
```json
{"shipping_address":"12 Example Road, Pune, Maharashtra","items":[{"product_id":1,"quantity":2}]}
```
The server reloads prices from PostgreSQL, locks the product rows, verifies stock and performs order creation, stock deduction, invoice creation and audit logging in one transaction. Client-supplied prices are never trusted.

## Update order status (admin)
`PATCH /orders/:id/status`
```json
{"status":"processing"}
```
Allowed values: `processing`, `shipped`, `delivered`, `cancelled`.
