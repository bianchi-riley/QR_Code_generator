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

        const listQR = (await QR_Code.find({pubblico: true})).reverse();

        res.render("home", { title: "Home", msg, listQR});
    }catch (err){
        console.error("An error as occured while searching pubblic QRs");
        res.status(500).send("An error as occured while loading the home page")
    }
});

router.post("/search_home", async(req, res) => {
    try{

        const { msg } = req.query;

        const searched = req.body.search;
    
        const listQR = (await QR_Code.find({$or: [
            { titolo: { $regex: searched, $options: "i" } },
            { utente: { $regex: searched, $options: "i" } }
          ], pubblico: true })).reverse();

        res.render("home", { title: "Home", msg, listQR });

    } catch (err) {
        console.error("An error as occured while searching QRs")
        res.status(500).send("An error as occured while loading the home page")
    }
});

router.post("/search_personal", async(req, res) => {
    try{

        const { msg } = req.query;

        const searched = req.body.search;
    
        const listQR = (await QR_Code.find({ utente: req.session.username, titolo: {$regex: searched, $options: "i"}})).reverse();

        res.render("your_QRs", { title: "Your QRs", msg, listQR });

    } catch (err) {
        console.error("An error as occured while searching QRs")
        res.status(500).send("An error as occured while loading the your QRs page")
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

        let finalContent = content.trim() || null;

        if (req.file) {
            const newFileName =  Date.now() + "-" + req.file.originalname
            const uploadPath = path.join("uploads", newFileName); // cartella uploads
            fs.writeFile(uploadPath, req.file.buffer, (err) => {
                if (err) {
                    return res.status(500).send("Error saving file");
                }
            });

            finalContent = `${req.protocol}://${req.get("host")}/uploads/${newFileName}`;
        }

        const qrBase64 = await Gen_QR.toDataURL(finalContent);

        const newQR = new QR_Code({titolo: title, qr_image: qrBase64, contenuto: finalContent, utente: username, pubblico: public});

        await newQR.save();

        res.redirect("/generate_QR?msg=Generation%20succesfull");

    } catch (err) {
        next(err);
    }
})

router.get("/your_QRs", async(req, res) => {
    try {
        const { msg } = req.query;

        const listQR = await QR_Code.find({utente: req.session.username}).lean();

        res.render("your_QRs", { title: "Your QRs", msg, listQR});
    }catch (err){
        console.error(`An error as occured while searching ${req.session.username} QRs`);
        res.status(500).send("An error as occured while loading the your QRs page")
    }
});
    
module.exports = router;
