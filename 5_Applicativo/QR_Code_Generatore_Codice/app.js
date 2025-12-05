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

const { currentUserUser } = require('./middleware/auth');
const pagesRouter = require("./routes/pages");
const authRouter = require('./routes/auth');

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

app.use(express.json());

app.use(express.urlencoded({ extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.use("/uploads", express.static("uploads"));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));
// Helper personalizzato per formattare la data
hbs.registerHelper("formatDate", function (date) {
  if (!date) return "";
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
});

app.use(cookieSession({
    name: 'session',
    keys: SESSION_KEYS,
    maxAge: 24 * 60 * 60 * 1000
  }));

app.use(currentUserUser);

app.use(pagesRouter);
app.use(authRouter);

app.use((req, res) => {
  res.status(404).render('404', { title: '404'});
});

app.listen(PORT, () =>{
    console.log("attivo")
})