const router = require("express").Router()
const {getMe, signup, signin} = require("../Controllers/UserControllers")
const authorize = require("../middlewares/auth")

//defining the mapping of the endpoints
//Get me using my auth
router.get("/me", authorize, getMe)

//Post, create or register or SignUp a new user
router.post("/signup", signup)

//SignIn a user
router.get("/signin", signin)

module.exports = router