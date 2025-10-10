require("dotenv").config();
const express = require("express");

const User = require("./models/users");
const QR_Code = require("./models/qr_code");

const PORT = process.env.PORT || 8080;
const SESSION_KEYS = (process.env.SESSION_KEYS || 'dev1,dev2').split(',').map(s => s.trim());
const app = express();

const hbs = require("hbs");
const path = require('path');
const cookieSession = require('cookie-session');

const mongoose = require("mongoose");

const pagesRouter = require("./routes/pages");

(async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        autoIndex: true
      });
      console.log('MongoDB connesso');
    } catch (err) {
      console.error('Errore connessione MongoDB:', err.message);
      process.exit(1); // esci se non c’è DB
    }
  })();

app.use(express.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(cookieSession({
    name: 'session',
    keys: SESSION_KEYS,
    maxAge: 24 * 60 * 60 * 1000
  }));

app.use(pagesRouter);

app.listen(PORT, () =>{
    console.log("attivo")
})