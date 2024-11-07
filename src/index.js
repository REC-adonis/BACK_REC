import express from "express";
import prisma from "./prisma.js";
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser";

const app = express();
const port = 4006;

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res)=>{
    res.send("Hello world");
})

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