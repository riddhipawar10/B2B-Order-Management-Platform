import { Router } from 'express';
import { query } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
const router=Router();
router.get('/:orderId',authenticate,async(req,res,next)=>{try{const r=await query(`SELECT i.*,o.id AS order_id,o.user_id,o.created_at AS order_date,o.subtotal,o.tax,o.total,o.shipping_address,u.name AS customer_name,u.email AS customer_email FROM invoices i JOIN orders o ON o.id=i.order_id JOIN users u ON u.id=o.user_id WHERE o.id=$1 AND (o.user_id=$2 OR $3='admin')`,[req.params.orderId,req.user.id,req.user.role]);if(!r.rows[0])return res.status(404).json({message:'Invoice not found.'});const items=await query('SELECT product_name,sku,unit_price,quantity,line_total FROM order_items WHERE order_id=$1',[req.params.orderId]);res.json({invoice:{...r.rows[0],items:items.rows}});}catch(e){next(e);}});
export default router;
