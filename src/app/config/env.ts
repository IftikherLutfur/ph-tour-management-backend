/* eslint-disable @typescript-eslint/no-wrapper-object-types */
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string,
  DB_URL: string,
  NODE_ENV: "developement" | "production",
  BCRYPT_SALT_ROUND: string;
  JWT_ACCESS_SECRET: string;
  JWT_TOKEN_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CALLBACK_URL: string;
  EXPRESS_SESSION_SECCRET: string;
  FRONTEND_URL: string;
  SSL: {
    STORE_ID: string;
    STORE_PASSWORD: string;
    SSL_PAYMENT_API: string;
    SSL_vALIDATION_API: string;
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAILED_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAILED_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;

  },
  EMAIL_SENDER: {
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FORM: string;
  },
  CLOUDINARY_NAME: string,
  CLOUDINARY_API_KEY: string,
  CLOUDINARY_API_SECRET: string,

  REDIS_HOST: string,
  REDIS_USERNAME: string,
  REDIS_PASS: string,
  REDIS_PORT: number,
}

const loadEnvVariables = (): EnvConfig => {
  const requredEnvVariables: string[] = ["PORT", "DB_URL", "NODE_ENV", "JWT_ACCESS_SECRET", "JWT_TOKEN_EXPIRES", "BCRYPT_SALT_ROUND", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URL", "EXPRESS_SESSION_SECCRET", "FRONTEND_URL",
    "STORE_ID", "STORE_PASSWORD", "SSL_PAYMENT_API", "SSL_vALIDATION_API",
    "SSL_SUCCESS_BACKEND_URL", "SSL_FAILED_BACKEND_URL", "SSL_CANCEL_BACKEND_URL",
    "SSL_SUCCESS_FRONTEND_URL", "SSL_FAILED_FRONTEND_URL", "SSL_CANCEL_FRONTEND_URL",
    "CLOUDINARY_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FORM",
    "REDIS_HOST", "REDIS_USERNAME", "REDIS_PASS", "REDIS_PORT",]

  requredEnvVariables.forEach(key => {
    if (!process.env[key]) {
      throw new Error(`Missing require environment variable ${key}`)
    }
  })

  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL as string,
    NODE_ENV: process.env.NODE_ENV as "developement" | "production",
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_TOKEN_EXPIRES: process.env.JWT_TOKEN_EXPIRES as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
    EXPRESS_SESSION_SECCRET: process.env.EXPRESS_SESSION_SECCRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
    CLOUDINARY_NAME: process.env.CLOUDINARY_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,

    SSL: {
      STORE_ID: process.env.STORE_ID as string,
      STORE_PASSWORD: process.env.STORE_PASSWORD as string,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
      SSL_vALIDATION_API: process.env.SSL_vALIDATION_API as string,
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
      SSL_FAILED_BACKEND_URL: process.env.SSL_FAILED_BACKEND_URL as string,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL as string,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
      SSL_FAILED_FRONTEND_URL: process.env.SSL_FAILED_FRONTEND_URL as string,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL as string,
    },
    EMAIL_SENDER: {
      SMTP_HOST: process.env.SMTP_HOST as string,
      SMTP_PORT: process.env.SMTP_PORT as string,
      SMTP_USER: process.env.SMTP_USER as string,
      SMTP_PASS: process.env.SMTP_PASS as string,
      SMTP_FORM: process.env.SMTP_FORM as string
    },
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_USERNAME: process.env.REDIS_USERNAME as string,
    REDIS_PASS: process.env.REDIS_PASS as string,
    REDIS_PORT: Number(process.env.REDIS_PORT),
  }
}


export const envVars: EnvConfig = loadEnvVariables()