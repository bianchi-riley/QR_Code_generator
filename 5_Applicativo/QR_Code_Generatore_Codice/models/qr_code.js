const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
    titolo: {
      type: String,
      required: true
    },
    contenuto: {
      type: String,
      required: true
    },
    data: {
      type: Date,
      default: Date.now
    },
    utente: {
      type: String,
      required: true
    }
  });

  module.exports = mongoose.model("QR_Code", qrCodeSchema);