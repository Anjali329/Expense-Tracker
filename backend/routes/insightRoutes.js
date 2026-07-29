const express=require("express");

const router=express.Router();


const {
getSummary
}
=require("../controllers/insightController");



router.get(
"/summary",
getSummary
);



module.exports=router;