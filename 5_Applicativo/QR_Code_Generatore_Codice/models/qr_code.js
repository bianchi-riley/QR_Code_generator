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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",   // riferimento all'utente creatore
      required: true
    }
  });

  const QR_Code = mongoose.model("QR_Code", qrCodeSchema);