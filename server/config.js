import dotenv from "dotenv";
dotenv.config()
export const serverPort = 55089;
export const rate = {
  windowMs: 5 * 60 * 1000,
  max: 500
};
export const apiHost = process.env.API_HOST||"http://localhost:5016";
export const publicApiHost = process.env.PUBLIC_API_HOST||"http://localhost:5018";
export const backendApiHost = process.env.BACKEND_API_HOST||"http://localhost:50122";
export const secureGw = process.env.SECURE_API_GW||"http://localhost:7000"
export const redisHost = process.env.REDIS_HOST||"127.0.0.1"

