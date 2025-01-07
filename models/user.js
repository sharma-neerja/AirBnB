const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    }
});

// Passport-local-mongoose will automatically add 'username' and 'password' to the schema
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;


// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

// const userSchema = new mongoose.Schema({
//     email: {
//         type: String,
//         required: true,
//     }
// });

// userSchema.plugin(passportLocalMongoose);
// const User = mongoose.model("User", userSchema);
// module.exports = User;