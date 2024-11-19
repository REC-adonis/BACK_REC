import express from "express";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from 'dotenv';

const app = express();
const port = 4006;

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("Hello world");
})

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(port, async()=>{
    console.log(`Server is running on port ${port}`);
    console.log("\n---[Test db conection]---");
    try {
        await prisma.$connect();

        const user = await prisma.user.findFirst({
            where: {
              isVerified: false,
            },
            orderBy: {
              user_id: 'asc',
            },
          });
        console.log(user);
    } catch (error) {
        //throw new Error('Error connecting to database');
        console.error('Error connecting to the database:', error);
    }
});