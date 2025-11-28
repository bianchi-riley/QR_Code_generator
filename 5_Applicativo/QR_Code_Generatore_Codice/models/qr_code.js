const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
    titolo: {
      type: String,
      required: true
    },
    qr_image: {
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
    },
    pubblico: {
      type: Boolean,
      require: true
    }
  });

  module.exports = mongoose.model("QR_Code", qrCodeSchema);