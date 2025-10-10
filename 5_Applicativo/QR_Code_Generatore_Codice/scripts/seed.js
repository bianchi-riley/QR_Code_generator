require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/users");
const QR_Code = require("../models/qr_code");

(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      await User.deleteMany({});
      await User.insertMany([
        {username: "marco", password: "nqjdld"},
        {username: "franco", password: "laownfl"},
        {username: "carlo", password: "owpfnal"}
  ]);
      await QR_Code.deleteMany({});
      await QR_Code.insertMany([
        {titolo: "di marco", contenuto: "ciao da marco", utente: "marco"},
        {titolo: "di franco", contenuto: "ciao da franco", utente: "franco"},
        {titolo: "di carlo", contenuto: "ciao da carlo", utente: "carlo"}
  ]);
      console.log('Seed completato');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
})();