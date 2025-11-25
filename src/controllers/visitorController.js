// Import Prisma's client instantiated in '../config/database'
const prisma = require("../config/database");



// Validation



// 
async function visitorAll(req, res) {
  try {
    const allVisitors = await prisma.visitor.findMany();

    // if (allVisitors.length) {
    //   console.log(allVisitors.length);
    // }

    res.json(allVisitors);
  } catch (err) {
    console.error(err);
  }  
}

async function visitorById(req, res) {
  
}



module.exports = {
  visitorAll,
  visitorById,
};