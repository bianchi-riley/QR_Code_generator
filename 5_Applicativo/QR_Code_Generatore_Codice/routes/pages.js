const express = require("express");
const router = express.Router();
const User = require("../models/users");
const QR_Code = require("../models/qr_code");
const Gen_QR = require("qrcode");
const multer = require("multer");
const { requireAuth } = require("../middleware/auth");

router.get("/", async(req, res) => {
    try {
        const { msg } = req.query;

        const homeQR = await QR_Code.find({privato: false}).lean();

        res.render("home", { title: "Home", msg, homeQR});
    }catch (err){
        console.error("An error as occured while searching pubblic QRs");
        res.status(500).send("An error as occured while loading the home page")
    }
});

router.post("/search", async(req, res) => {
    try{

        const { msg } = req.query;

        const searched = req.body.search;
    
        // Prendiamo un documento per capire quali campi contengono stringhe
        const sample = await QR_Code.findOne();
        if (!sample) return res.render("home", { qrCodes: [] });
    
        // Generiamo i campi su cui cercare
        const fields = Object.keys(sample.toObject()).filter(
            key => typeof sample[key] === "string"
        );
    
        // Creiamo la query $or con regex
        const orQuery = fields.map(field => ({
            [field]: { $regex: searched, $options: "i" }
        }));
    
        // Troviamo i documenti direttamente nel DB
        const homeQR = await QR_Code.find({ $or: orQuery });

        res.render("home", { title: "Home", msg, homeQR });

    } catch (err) {
        console.error("An error as occured while searching QRs")
        res.status(500).send("An error as occured while loading the home page")
    }
});

router.get("/generate_QR", requireAuth, (req, res) => {
    try {
        const { msg } = req.query;

        res.render("generate_QR", {title: "Generate_QR", msg});
    } catch (err) {
        next(err);
    }
});

router.post("/generate", requireAuth, async(req, res) =>{
    try{
        const { msg } = req.query;
        const { title, content} = req.body;
        const username = req.session.username;
        const public = req.body.checkboxP === "on";

        await Gen_QR.toFile("qr.png", content);
        console.log(qr);

        res.render("generate_QR", {title: "Generate_QR", msg});
    } catch (err) {
        next(err);
    }
})
    
module.exports = router;


//url = "https://public-api.qr-code-generator.com/v1/create/free?image_format=SVG&image_width=500&foreground_color=%23000000&frame_color=%23000000&frame_name=no-frame&qr_code_logo=&qr_code_pattern=&qr_code_text={$Text}"
