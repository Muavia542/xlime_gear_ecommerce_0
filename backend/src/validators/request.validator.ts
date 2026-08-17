import { z } from "zod";
const clean = (min:number,max:number)=>z.string().trim().min(min).max(max);
const optionalText = (max:number)=>z.string().trim().max(max).optional().or(z.literal(""));

export const teamOrderSchema = z.object({
  body: z.object({
    organisation: clean(2,180),
    contactName: clean(2,160),
    email: z.string().trim().toLowerCase().email().max(254),
    phone: optionalText(60),
    sport: clean(2,80).default("Football"),
    numberOfPlayers: z.coerce.number().int().min(1).max(100000).optional(),
    packageInterest: optionalText(120),
    deadline: z.string().datetime().optional().nullable(),
    requirements: clean(5,5000),
  }),
  params: z.object({}), query: z.object({})
});

export const customKitSchema = z.object({
  body: z.object({
    teamName: optionalText(180),
    sport: clean(2,80).default("Football"),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#C8FF00"),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#080A08"),
    playerName: optionalText(80),
    playerNumber: optionalText(20),
    crestUrl: z.string().url().max(3000).optional().or(z.literal("")),
    notes: optionalText(5000),
  }),
  params: z.object({}), query: z.object({})
});
