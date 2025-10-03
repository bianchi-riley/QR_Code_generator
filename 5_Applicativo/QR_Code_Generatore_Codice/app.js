const express = require("express");
const User = require("./models/users");

const app = express();

const newUser = User.create({username: "marco", password: "1234"});

app.get("/", (req, res) => {
    res.send(newUser);
})

app.listen(8080, () =>{
    console.log("attivo")
})