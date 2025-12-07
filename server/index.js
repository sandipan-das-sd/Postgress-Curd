import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
const app = express();
const port = process.env.PORT || 3000;
import errorHandling from './middlewires/errorhandler.js';
//Midllwwire
app.use(express.json());
app.use(cors());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.get("/",async(requestAnimationFrame,res)=>{
  const result=await pool.query("SELECT current_database()");
  res.send(`The databse name is:${result.rows[0].current_database}`)
})
//erroor handling
app.use(errorHandling)


//server running
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});