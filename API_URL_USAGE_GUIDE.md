# API URL Usage Guide

## Overview

Based on the API documentation, your backend provides a comprehensive REST API. Here's when to use each URL configuration:

## URL Configuration

```javascript
// environment.js
API_BASE_URL: "http://wc4kscgkwookowksgcs0g48s.213.199.60.135.sslip.io/api";
DJANGO_BASE_URL: "http://wc4kscgkwookowksgcs0g48s.213.199.60.135.sslip.io";
```

## **When to use API_BASE_URL** ✅

Use `API_BASE_URL` for **ALL** API endpoints documented in your API docs:

### Authentication Endpoints

- **Login**: `${API_BASE_URL}/token/` (POST)
- **Token Refresh**: `${API_BASE_URL}/token/refresh/` (POST)
- **Signup**: `${API_BASE_URL}/signup/` (POST)
- **Email Verification**: `${API_BASE_URL}/verify-email/` (GET)

### Core Business Endpoints

- **Dashboard**: `${API_BASE_URL}/dashboard/` (GET)
- **Products**: `${API_BASE_URL}/products/` (GET, POST, PUT, PATCH, DELETE)
- **Customers**: `${API_BASE_URL}/customers/` (GET, POST, PUT, PATCH, DELETE)
- **Orders**: `${API_BASE_URL}/orders/` (GET, POST, PUT, PATCH, DELETE)
- **Order Items**: `${API_BASE_URL}/order-items/` (GET, POST, PUT, PATCH, DELETE)
- **Inventory**: `${API_BASE_URL}/inventory/` (GET, POST, PUT, PATCH, DELETE)
- **Suppliers**: `${API_BASE_URL}/suppliers/` (GET, POST, PUT, PATCH, DELETE)
- **Users**: `${API_BASE_URL}/users/` (GET, POST, PUT, PATCH, DELETE)

### Payment & Delivery

- **Payments**: `${API_BASE_URL}/payments/` (GET, POST, PUT, PATCH, DELETE)
- **Paystack Init**: `${API_BASE_URL}/paystack/init/` (POST)
- **Paystack Callback**: `${API_BASE_URL}/paystack/callback/` (GET)
- **Deliveries**: `${API_BASE_URL}/deliveries/` (GET, POST, PUT, PATCH, DELETE)
- **Delivery Status**: `${API_BASE_URL}/deliveries/{id}/update-status/` (POST)
- **Delivery ETA**: `${API_BASE_URL}/deliveries/{id}/estimate-eta/` (GET)
- **Delivery History**: `${API_BASE_URL}/deliveries/{id}/history/` (GET)

### Reports

- **Inventory Reports**:
  - `${API_BASE_URL}/reports/inventory/csv/` (GET)
  - `${API_BASE_URL}/reports/inventory/pdf/` (GET)
- **Order Reports**:
  - `${API_BASE_URL}/reports/orders/csv/` (GET)
  - `${API_BASE_URL}/reports/orders/pdf/` (GET)
- **Payment Reports**:
  - `${API_BASE_URL}/reports/payments/csv/` (GET)
  - `${API_BASE_URL}/reports/payments/pdf/` (GET)

### Special Endpoints

- **Expiring Products**: `${API_BASE_URL}/expiring-products/` (GET)

## **When to use DJANGO_BASE_URL** ⚠️

Use `DJANGO_BASE_URL` for **non-API** Django resources:

### Admin Interface

- **Django Admin**: `${DJANGO_BASE_URL}/admin/`

### Static Resources

- **Media Files**: `${DJANGO_BASE_URL}/media/uploaded-file.jpg`
- **Static Files**: `${DJANGO_BASE_URL}/static/css/admin.css`

### Direct Django Views (if any)

- **Custom Django templates**: `${DJANGO_BASE_URL}/custom-view/`

## Service Implementation Examples

### ✅ Correct Usage

```javascript
// authService.js
async login(username, password) {
  const response = await fetch(`${config.API_BASE_URL}/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
}

// productService.js
async getProducts() {
  const response = await fetch(`${config.API_BASE_URL}/products/`);
}

// orderService.js
async createOrder(orderData) {
  const response = await fetch(`${config.API_BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });
}
```

### ❌ Incorrect Usage

```javascript
// DON'T use DJANGO_BASE_URL for API endpoints
const response = await fetch(`${config.DJANGO_BASE_URL}/api/products/`); // Wrong!
const response = await fetch(`${config.DJANGO_BASE_URL}/accounts/signup/`); // Wrong!
```

## Current Service Files to Update

Based on your current implementation, ensure these services use `API_BASE_URL`:

1. **authService.js** ✅ (Fixed)

   - login() → `/api/token/`
   - signup() → `/api/signup/`
   - refreshToken() → `/api/token/refresh/`

2. **customerService.js**

   - All endpoints → `/api/customers/*`

3. **deliveryService.js**

   - All endpoints → `/api/deliveries/*`

4. **employeeService.js**

   - All endpoints → `/api/users/*` (employees are users)

5. **inventoryService.js**

   - All endpoints → `/api/inventory/*`

6. **paymentService.js**

   - All endpoints → `/api/payments/*`
   - Paystack → `/api/paystack/*`

7. **reportsService.js**

   - All endpoints → `/api/reports/*`

8. **salesService.js**

   - Orders → `/api/orders/*`
   - Order Items → `/api/order-items/*`

9. **supplierService.js**
   - All endpoints → `/api/suppliers/*`

## Key Points

1. **ALL documented API endpoints use `/api/` prefix** → Use `API_BASE_URL`
2. **Django admin and static resources** → Use `DJANGO_BASE_URL`
3. **Your API provides comprehensive functionality** - no need for custom Django views
4. **Authentication is JWT-based** through the API endpoints
5. **All business logic** goes through the REST API

## Environment Variables

For production, you can override these in your `.env`:

```bash
VITE_API_BASE_URL=https://your-production-domain.com/api
VITE_DJANGO_BASE_URL=https://your-production-domain.com
```
