const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
// schema
const footballSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmpassword: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// jwt token generation middleware
footballSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    ); //this.id is object so it is converted into string
    // console.log(token);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

// bcrypt middleware , password sent here
// before saving into database , password is converted into hash code
footballSchema.pre("save", async function (next) {

  // console.log(this.password);
  if(this.isModified("password")){
    this.password = await bcryptjs.hash(this.password, 10); //10 is the round intensity
    // console.log(this.password);
    this.confirmpassword = await bcryptjs.hash(this.password, 10); //10 is the round intensity
    // this.confirmpassword = undefined; //after user registered cnf pss will never be used so it will be left blank
  }
  
  next();
});

// collections or model
const footballModel = new mongoose.model("FootballerFan", footballSchema);

module.exports = footballModel;
