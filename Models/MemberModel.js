const mongoose = require("mongoose")
const { Snowflake } = require('@theinternetfolks/snowflake');

//monogDB by default takes the objectID as the id type for reference ids
//we can explicitly mentions we want to keep the reference id tpe custom,
//now we are good to go!
const generateSnowflake = () => {
    return Snowflake.generate();
}

const MemberModel = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: generateSnowflake
    },
    user: {
        type: String,
        required: true,
        ref: "User",
        refPath: "userType"
    },
    community: {
        type: String,
        required: true,
        ref: "Community",
        refPath: "communityType"
    },
    role: {
        type: String,
        required: true,
        ref: "Role",
        refPath: "roleType"
    }
}, {timeStamps: true});

const Member = mongoose.model("Member", MemberModel);


module.exports = Member;