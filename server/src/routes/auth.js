import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { query } from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import { logActivity } from '../utils/activity.js';
const router = Router();
const validate = (req,res,next) => { const e=validationResult(req); if(!e.isEmpty()) return res.status(400).json({message:'Please correct the highlighted fields.',details:e.array()}); next(); };
function tokenFor(user) { return jwt.sign({ id:user.id, role:user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }); }
router.post('/register', [body('name').trim().isLength({min:2,max:80}), body('email').trim().isEmail().normalizeEmail(), body('password').isLength({min:8,max:72})], validate, async (req,res,next) => {
  try { const {name,email,password}=req.body; const exists=await query('SELECT id FROM users WHERE email=$1',[email]); if(exists.rowCount) return res.status(409).json({message:'An account with this email already exists.'}); const hash=await bcrypt.hash(password,12); const r=await query("INSERT INTO users(name,email,password_hash,role) VALUES($1,$2,$3,'customer') RETURNING id,name,email,role",[name,email,hash]); const user=r.rows[0]; await logActivity(user.id,'ACCOUNT_REGISTERED','user',user.id); res.status(201).json({token:tokenFor(user),user}); } catch(e){next(e);} });
router.post('/login', [body('email').trim().isEmail().normalizeEmail(),body('password').notEmpty()], validate, async(req,res,next)=>{ try { const r=await query('SELECT * FROM users WHERE email=$1',[req.body.email]); const user=r.rows[0]; if(!user || !(await bcrypt.compare(req.body.password,user.password_hash))) return res.status(401).json({message:'Email or password is incorrect.'}); await logActivity(user.id,'LOGIN','user',user.id); const safe={id:user.id,name:user.name,email:user.email,role:user.role}; res.json({token:tokenFor(safe),user:safe}); }catch(e){next(e);} });
router.get('/me',authenticate,(req,res)=>res.json({user:req.user}));
export default router;
