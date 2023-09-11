const mongoose = require("mongoose")
const { Snowflake } = require('@theinternetfolks/snowflake');

const generateSnowflake = () => {
    return Snowflake.generate();
}

const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: generateSnowflake
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
}, {timeStamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;