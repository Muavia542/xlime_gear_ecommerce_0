import "dotenv/config";
import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4000),
  FRONTEND_ORIGIN: z.string().url().default("http://localhost:3000"),
  DATABASE_URL: z.string().min(10),
  JWT_SECRET: z.string().min(24),
  JWT_EXPIRES_IN: z.string().default("7d"),
  COOKIE_SECURE: z.string().default("false").transform(v => v === "true"),
  TRUST_PROXY: z.string().default("false"),
  UPLOAD_PROVIDER: z.enum(["local", "cloudinary"]).default("local"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional()
}).superRefine((value,ctx)=>{
  if(value.NODE_ENV!=="production") return;
  if(value.JWT_SECRET.startsWith("replace-this-")||value.JWT_SECRET.length<48) ctx.addIssue({code:"custom",path:["JWT_SECRET"],message:"Production JWT_SECRET must be a unique 48+ character secret."});
  if(!value.COOKIE_SECURE) ctx.addIssue({code:"custom",path:["COOKIE_SECURE"],message:"COOKIE_SECURE must be true in production."});
  if(!value.FRONTEND_ORIGIN.startsWith("https://")) ctx.addIssue({code:"custom",path:["FRONTEND_ORIGIN"],message:"Production FRONTEND_ORIGIN must use HTTPS."});
  if(value.UPLOAD_PROVIDER==="cloudinary"&&(!value.CLOUDINARY_CLOUD_NAME||!value.CLOUDINARY_API_KEY||!value.CLOUDINARY_API_SECRET)) ctx.addIssue({code:"custom",path:["UPLOAD_PROVIDER"],message:"Cloudinary credentials are required when UPLOAD_PROVIDER=cloudinary."});
});

export const env = schema.parse(process.env);
