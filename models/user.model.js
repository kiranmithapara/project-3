const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default; //password and username schema ni andar automatic add kari dese
//password ni andar solt add kari ne tene hased value ma pan convert kari dese
//defult etle lagvayu ke passportLoacalMongoose object return kartu tu apde function joiye che

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;
