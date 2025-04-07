import { PrismaClient } from "@prisma/client";
import "server-only";
 
declare global {
  // eslint-disable-next-line no-var, no-unused-vars
  var cachedPrisma: PrismaClient;
}
 
export let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(
    {
      transactionOptions: {
        maxWait: 30000,  // 30 seconds
        timeout: 20000,  // 20 seconds
        isolationLevel: 'Serializable'
      },
      log: ['query', 'info', 'warn', 'error']
    });
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient();
  }
  prisma = global.cachedPrisma;
}