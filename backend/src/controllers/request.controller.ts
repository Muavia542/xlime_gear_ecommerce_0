import type { Request, Response } from "express";
import { prisma } from "../config/prisma.js";
import { makeReference } from "../utils/numbers.js";
import { createNotification } from "../services/notification.service.js";

export const requestController = {
  team: async (req: Request, res: Response) => {
    const input = { ...req.body, deadline: req.body.deadline ? new Date(req.body.deadline) : null };
    const request = await prisma.teamOrderRequest.create({ data: { ...input, requestNumber: makeReference("TEAM") } });
    await createNotification({ type:"TEAM_ORDER", title:"New team order request", message:`${request.organisation} submitted ${request.requestNumber}.`, entityType:"TeamOrderRequest", entityId:request.id });
    res.status(201).json({ request });
  },
  customKit: async (req: Request, res: Response) => {
    const request = await prisma.customKitRequest.create({ data: { ...req.body, crestUrl:req.body.crestUrl||null, userId: req.authUser?.id, requestNumber: makeReference("KIT") } });
    await createNotification({ type:"CUSTOM_KIT", title:"New custom kit request", message:`${request.teamName||"A customer"} submitted ${request.requestNumber}.`, entityType:"CustomKitRequest", entityId:request.id });
    res.status(201).json({ request });
  }
};
