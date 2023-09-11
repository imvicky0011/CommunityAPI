const mongoose = require("mongoose")
const { Snowflake } = require('@theinternetfolks/snowflake');

const generateSnowflake = () => {
    return Snowflake.generate();
}

const RoleSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: generateSnowflake
    },
    name: {
        type: String,
        required: true,
        unique: true
    }
}, {timeStamps: true});

const Role = mongoose.model("Role", RoleSchema);


module.exports = Role;