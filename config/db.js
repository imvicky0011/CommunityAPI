const mongoose = require("mongoose")

const dbConnct = async () => {
    try {
        await mongoose.connect(process.env.MONGOURI)
        console.log("DB connected!")
    } catch (err) {
        console.log(err);
    }
}

module.exports = dbConnct