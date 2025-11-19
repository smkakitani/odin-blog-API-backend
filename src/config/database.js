// Import Prisma's Client 
const { PrismaClient } = require("../../generated/prisma");

const prisma = new PrismaClient({
  errorFormat: "pretty",
  log: ["error"],  // Display error's log on console
});

// You need to re-run the prisma generate command after every change that's made to your Prisma schema to update the generated Prisma Client code.

module.exports = prisma;