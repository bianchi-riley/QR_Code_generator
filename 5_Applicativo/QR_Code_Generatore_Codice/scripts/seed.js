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
        {username: "carlo", password: "owpfnal"},
        {username: "luca", password: "qerzti"},
        {username: "marta", password: "plxwen"},
        {username: "giulia", password: "ndtrsa"},
        {username: "andrea", password: "uvqlei"},
        {username: "francesca", password: "tpsmdo"},
        {username: "sofia", password: "lyqwen"},
        {username: "giorgio", password: "fzupko"},
        {username: "valentina", password: "hmrsal"},
        {username: "riccardo", password: "pejvta"},
        {username: "chiara", password: "slbqno"},
        {username: "alessio", password: "rmxtye"},
        {username: "federica", password: "wqnpla"},
        {username: "davide", password: "tbxero"}
  ]);
      await QR_Code.deleteMany({});
      await QR_Code.insertMany([
        {titolo: "di marco", contenuto: "ciao da marco", utente: "marco", privato: false},
        {titolo: "di franco", contenuto: "ciao da franco", utente: "franco", privato: false},
        {titolo: "di carlo", contenuto: "ciao da carlo", utente: "carlo", privato: false},
        {titolo: "di luca", contenuto: "ciao da luca", utente: "luca", privato: false},
        {titolo: "di marta", contenuto: "ciao da marta", utente: "marta", privato: false},
        {titolo: "di giulia", contenuto: "ciao da giulia", utente: "giulia", privato: false},
        {titolo: "di andrea", contenuto: "ciao da andrea", utente: "andrea", privato: false},
        {titolo: "di francesca", contenuto: "ciao da francesca", utente: "francesca", privato: false},
        {titolo: "di sofia", contenuto: "ciao da sofia", utente: "sofia", privato: false},
        {titolo: "di giorgio", contenuto: "ciao da giorgio", utente: "giorgio", privato: false},
        {titolo: "di valentina", contenuto: "ciao da valentina", utente: "valentina", privato: false},
        {titolo: "di riccardo", contenuto: "ciao da riccardo", utente: "riccardo", privato: false},
        {titolo: "di chiara", contenuto: "ciao da chiara", utente: "chiara", privato: false},
        {titolo: "di alessio", contenuto: "ciao da alessio", utente: "alessio", privato: false},
        {titolo: "di federica", contenuto: "ciao da federica", utente: "federica", privato: false},
        {titolo: "di davide", contenuto: "ciao da davide", utente: "davide", privato: false}
  ]);
      console.log('Seed completato');
      process.exit(0);
    } catch (e) {
      console.error(e);
      process.exit(1);
    }
})();