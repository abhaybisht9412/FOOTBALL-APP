const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/AllFootballDB')
.then(() => console.log("connection to DB successful"))
.catch((err) => console.log(err));


