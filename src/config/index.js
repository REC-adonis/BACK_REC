import dotenv from 'dotenv';

// Cargar las variables del archivo .env
dotenv.config();

// Configuración de tu aplicación
const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  clientUrl: process.env.CLIENT_URL,
};

export default config;
