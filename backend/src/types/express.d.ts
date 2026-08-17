import type { Role } from "../generated/prisma/enums.js";

declare global {
  namespace Express {
    interface Request {
      authUser?: { id: string; email: string; role: Role; name: string };
    }
  }
}
export {};
