import type { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { promises as fs } from "node:fs";
import { env } from "../config/env.js";

if (env.UPLOAD_PROVIDER === "cloudinary" && env.CLOUDINARY_CLOUD_NAME && env.CLOUDINARY_API_KEY && env.CLOUDINARY_API_SECRET) {
  cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET });
}

async function validImageSignature(filePath:string){
  const fh=await fs.open(filePath,"r");
  try{
    const buffer=Buffer.alloc(16); const {bytesRead}=await fh.read(buffer,0,16,0); const b=buffer.subarray(0,bytesRead);
    const jpeg=b.length>=3&&b[0]===0xff&&b[1]===0xd8&&b[2]===0xff;
    const png=b.length>=8&&b.subarray(0,8).equals(Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]));
    const webp=b.length>=12&&b.subarray(0,4).toString()==="RIFF"&&b.subarray(8,12).toString()==="WEBP";
    return jpeg||png||webp;
  } finally { await fh.close(); }
}

export const uploadController = {
  single: async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: { code: "FILE_REQUIRED", message: "Choose a JPEG, PNG or WebP image." } });
    const ok=await validImageSignature(req.file.path).catch(()=>false);
    if(!ok){await fs.unlink(req.file.path).catch(()=>{});return res.status(415).json({error:{code:"INVALID_IMAGE",message:"The uploaded file is not a valid JPEG, PNG or WebP image."}})}

    if (env.UPLOAD_PROVIDER === "cloudinary") {
      try{
        if(!env.CLOUDINARY_CLOUD_NAME||!env.CLOUDINARY_API_KEY||!env.CLOUDINARY_API_SECRET) return res.status(503).json({error:{code:"UPLOAD_NOT_CONFIGURED",message:"Cloud image storage is not configured."}});
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "xlime-gear", resource_type:"image", overwrite:false, unique_filename:true });
        res.status(201).json({ url: result.secure_url, width:result.width, height:result.height, bytes:result.bytes, format:result.format });
        return;
      } finally { await fs.unlink(req.file.path).catch(()=>{}); }
    }
    res.status(201).json({ url: `/uploads/${req.file.filename}`, bytes:req.file.size, mimeType:req.file.mimetype });
  }
};
