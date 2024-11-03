import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DB_URL,
    },
  },
});

export default prisma;
