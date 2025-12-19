require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/users");
const QR_Code = require("../models/qr_code");
const bcrypt = require("bcrypt");
const Gen_QR = require("qrcode");

(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      await User.deleteMany({});
      // Dati fittizi con password in chiaro (verranno hashate dopo)
      const users = [
        { username: "marco", password: "nqjdldnqjdld" },
        { username: "franco", password: "laownfllaownfl" },
        { username: "carlo", password: "owpfnalowpfnal" },
        { username: "luca", password: "qerztiqerzti" },
        { username: "marta", password: "plxwenplxwen" },
        { username: "giulia", password: "ndtrsandtrsa" },
        { username: "andrea", password: "uvqleiuvqlei" },
        { username: "francesca", password: "tpsmdotpsmdo" },
        { username: "sofia", password: "lyqwenlyqwen" },
        { username: "giorgio", password: "fzupkofzupko" },
        { username: "valentina", password: "hmrsalhmrsal" },
        { username: "riccardo", password: "pejvtapejvta" },
        { username: "chiara", password: "slbqnoslbqno" },
        { username: "alessio", password: "rmxtyermxtye" },
        { username: "federica", password: "wqnplawqnpla" },
        { username: "davide", password: "tbxerotbxero" }
      ];

      // 🔐 Hash delle password prima dell’inserimento
      const saltRounds = 10;
      const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => ({
          username: user.username,
          password: await bcrypt.hash(user.password, saltRounds),
        }))
      );

      // Inserisci nel database
      
      await User.insertMany(usersWithHashedPasswords);

      await QR_Code.deleteMany({});
      await QR_Code.insertMany([
        {titolo: "di marco", qr_image: await Gen_QR.toDataURL("ciao da marco"), utente: "marco", pubblico: true},
        {titolo: "di franco", qr_image: await Gen_QR.toDataURL("ciao da franco"), utente: "franco", pubblico: true},
        {titolo: "di carlo", qr_image: await Gen_QR.toDataURL("ciao da carlo"), utente: "carlo", pubblico: true},
        {titolo: "di luca", qr_image: await Gen_QR.toDataURL("ciao da luca"), utente: "luca", pubblico: true},
        {titolo: "di marta", qr_image: await Gen_QR.toDataURL("ciao da marta"), utente: "marta", pubblico: true},
        {titolo: "di giulia", qr_image: await Gen_QR.toDataURL("ciao da giulia"), utente: "giulia", pubblico: true},
        {titolo: "di andrea", qr_image: await Gen_QR.toDataURL("ciao da andrea"), utente: "andrea", pubblico: true},
        {titolo: "di francesca", qr_image: await Gen_QR.toDataURL("ciao da francesca"), utente: "francesca", pubblico: true},
        {titolo: "di sofia", qr_image: await Gen_QR.toDataURL("ciao da sofia"), utente: "sofia", pubblico: true},
        {titolo: "di giorgio", qr_image: await Gen_QR.toDataURL("ciao da giorgio"), utente: "giorgio", pubblico: true},
        {titolo: "di valentina", qr_image: await Gen_QR.toDataURL("ciao da valentina"), utente: "valentina", pubblico: true},
        {titolo: "di riccardo", qr_image: await Gen_QR.toDataURL("ciao da riccardo"), utente: "riccardo", pubblico: true},
        {titolo: "di chiara", qr_image: await Gen_QR.toDataURL("ciao da chiara"), utente: "chiara", pubblico: true},
        {titolo: "di alessio", qr_image: await Gen_QR.toDataURL("ciao da alessio"), utente: "alessio", pubblico: true},
        {titolo: "di federica", qr_image: await Gen_QR.toDataURL("ciao da federica"), utente: "federica", pubblico: true},
        {titolo: "di davide", qr_image: await Gen_QR.toDataURL("ciao da davide"), utente: "davide", pubblico: true}
  ]);
      console.log('Seed completato');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
})();