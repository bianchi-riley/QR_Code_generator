const express = require("express");
const router = express.Router();
const User = require("../models/users");
const QR_Code = require("../models/qr_code");
const Gen_QR = require("qrcode");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { requireAuth } = require("../middleware/auth");

const storage = multer.memoryStorage(); // il file rimane in RAM
const upload = multer({ storage: storage });

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

router.post("/generate", requireAuth, upload.single("file"), async(req, res) =>{
    try{
        const { msg } = req.query;
        const {title, content} = req.body;
        const username = req.session.username;
        const public = req.body.checkboxP === "on";

        // Controllo: niente input
        if (!content && !req.file) {
            return res.status(400).render("generate_QR", {
                title: "Generate_QR",
                errorC: "You have not entered any text or file. Please choose one of the two."
            });
        }

        // Controllo: entrambi presenti
        if (content && req.file) {
            return res.status(400).render("generate_QR", {
                title: "Generate_QR",
                errorC: "You've entered both text and file. Choose only one."
            });
        }

        let finalContent = content || null;

        if (req.file) {
            const newFileName =  Date.now() + "-" + req.file.originalname
            const uploadPath = path.join("uploads", newFileName); // cartella uploads
            fs.writeFile(uploadPath, req.file.buffer, (err) => {
                if (err) {
                    return res.status(500).send("Error saving file");
                }
            });

            finalContent = "/uploads/" + newFileName;
        }

        const qrBase64 = await Gen_QR.toDataURL(finalContent);

        const newQR = new QR_Code({titolo: title, qr_image: qrBase64, contenuto: finalContent, utente: username, pubblico: public});
        
        

        await newQR.save();


    } catch (err) {
        //next(err);
        console.log(err);
    }
})
    
module.exports = router;
