# Manual Testing Checklist

Use the two seeded demo accounts from the README.

## Authentication and authorization
- [ ] Customer can sign in with the customer demo account.
- [ ] Admin can sign in with the admin demo account.
- [ ] Incorrect password returns an error.
- [ ] Customer cannot create/update/archive products (API should return 403).
- [ ] Registration creates a customer role even if a role field is submitted by the client.

## Product catalogue
- [ ] Product list loads from PostgreSQL.
- [ ] Search by product name and SKU works.
- [ ] Category filter works.
- [ ] Out-of-stock products cannot be added to cart.
- [ ] Admin can create and edit a product.
- [ ] Admin can archive a product; it disappears from active catalogue.
- [ ] Duplicate SKU is rejected.

## Cart and checkout
- [ ] Customer can add a product to cart and adjust quantity.
- [ ] Quantity cannot exceed the stock value shown in the UI.
- [ ] Checkout requires a shipping address.
- [ ] Successful checkout creates an order, order items, invoice and activity log.
- [ ] Product stock is reduced by the purchased quantity.
- [ ] Trying to order more than available stock is rejected and does not create a partial order.

## Orders and invoices
- [ ] Customer sees only their own order history.
- [ ] Customer can open their invoice and use Print / Save as PDF.
- [ ] Customer cannot view another customer's order or invoice.
- [ ] Admin can view all orders and update order status.
- [ ] Invalid order status is rejected.

## Audit and resilience
- [ ] Admin can view the latest activity records.
- [ ] Unknown API route returns 404 JSON.
- [ ] Stop PostgreSQL and confirm health endpoint returns 503.
- [ ] Restart PostgreSQL and confirm health endpoint returns database connected.

## Evidence to capture for internship submission
1. Customer dashboard and product catalogue.
2. Cart before checkout.
3. Successful order and customer order history.
4. Invoice preview.
5. Admin product management.
6. Admin order status update.
7. Activity log.
8. Terminal output for migration, seed and frontend production build.
