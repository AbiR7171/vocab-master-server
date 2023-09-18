const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_LOCK}@cluster0.hmmbger.mongodb.net/?retryWrites=true&w=majority`;


mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
}).then(()=> console.log(`connected To Mongoose`)).catch(err => console.log(err))