import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { pool } from '../src/config/db.js';
dotenv.config();
try {
 const adminHash=await bcrypt.hash('Admin@123',12), customerHash=await bcrypt.hash('Customer@123',12);
 await pool.query(`INSERT INTO users(name,email,password_hash,role) VALUES ('Arrowstack Admin','admin@arrowstack.demo',$1,'admin') ON CONFLICT(email) DO NOTHING`,[adminHash]);
 await pool.query(`INSERT INTO users(name,email,password_hash,role) VALUES ('Demo Customer','customer@arrowstack.demo',$1,'customer') ON CONFLICT(email) DO NOTHING`,[customerHash]);
 const categories=['Office Supplies','Electronics','Packaging','Industrial'];
 for(const name of categories) await pool.query('INSERT INTO categories(name) VALUES($1) ON CONFLICT(name) DO NOTHING',[name]);
 const cat=await pool.query('SELECT id,name FROM categories');const ids=Object.fromEntries(cat.rows.map(x=>[x.name,x.id]));
 const products=[
 ['A4 Copier Paper (500 sheets)','PAP-A4-500','Premium 80 GSM A4 copier paper for everyday office printing.',285,120,'Office Supplies'],
 ['Wireless Keyboard & Mouse','ELC-KM-210','Ergonomic wireless keyboard and mouse combo.',1199,35,'Electronics'],
 ['Corrugated Shipping Box','PKG-BOX-M','Medium 5-ply corrugated box for safe shipping.',42,500,'Packaging'],
 ['Laser Printer Toner','ELC-TNR-04','High-yield black laser printer toner cartridge.',2499,18,'Electronics'],
 ['Packing Tape Roll','PKG-TAPE-48','Strong 48 mm transparent packaging tape.',58,240,'Packaging'],
 ['Safety Gloves (Pair)','IND-GLV-01','Reusable industrial safety gloves.',145,75,'Industrial'],
 ['Desktop Monitor 24-inch','ELC-MON-24','Full HD 24-inch business monitor.',8999,12,'Electronics'],
 ['Lever Arch File','OFF-FILE-02','Durable A4 lever arch file for document storage.',95,160,'Office Supplies']
 ];
 for(const p of products) await pool.query('INSERT INTO products(name,sku,description,price,stock,category_id) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(sku) DO NOTHING',[...p.slice(0,5),ids[p[5]]]);
 console.log('Seed completed. Demo admin and customer accounts are ready.');
} catch(e){console.error('Seed failed:',e.message);process.exitCode=1;} finally{await pool.end();}
