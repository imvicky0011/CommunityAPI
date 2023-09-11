const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authorize = async (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        console.log("Token is not authorized yeah!")
        return res.status(401).json({msg: "Not Authorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //in the incoming request, jwt decode the token
        //and attaches the decoded user into the req header.
        //this way, the next middleware can easily access the userId
        //through this req.user
        req.user = decoded.user;

        //this decode.user sends the user ID to the client, for the sake of confirming that
        //user is validated, and to retrieve the informations required
        //or to do anything, because the protected routes will now have the user ID
        //and they can execute the requests came from the client side.
        next();
    }
    catch(err) {
        console.log(err.message);
        res.status(500).json({
            error: err
        })
    }
}

module.exports = authorize