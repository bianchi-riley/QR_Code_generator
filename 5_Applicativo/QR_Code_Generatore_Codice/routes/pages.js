const express = require("express");
const router = express.Router();
const User = require("../models/users");
const QR_Code = require("../models/qr_code");

router.get("/", async(req, res) => {
    try {
        const { msg } = req.query;

        const publicQR = await QR_Code.find({privato: false}).lean();

        res.render("home", { title: "Home", msg, publicQR});
    }catch (err){
        console.error("An error as occured while searching pubblic QRs");
        res.status(500).send("An error as occured while loading the home page")
    }
    
    
});



module.exports = router;