import { Router } from 'express';
import { query } from '../config/db.js';
import { authenticate, allowRoles } from '../middleware/auth.js';
const router=Router();
router.get('/',authenticate,allowRoles('admin'),async(req,res,next)=>{try{const r=await query(`SELECT a.id,a.action,a.entity_type,a.entity_id,a.details,a.created_at,u.name AS user_name,u.email FROM activity_logs a LEFT JOIN users u ON u.id=a.user_id ORDER BY a.created_at DESC LIMIT 100`);res.json({activities:r.rows});}catch(e){next(e);}});
export default router;
