const mongoose = require("mongoose")
const { Snowflake } = require('@theinternetfolks/snowflake');

const generateSnowflake = () => {
    return Snowflake.generate();
}

const CommunityModel = new mongoose.Schema({
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
    slug: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true,
        ref: "User",
        refPath: "userType"
    }
}, {timeStamps: true});

const Community = mongoose.model("Community", CommunityModel);


module.exports = Community;