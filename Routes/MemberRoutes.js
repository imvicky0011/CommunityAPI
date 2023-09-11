const router = require("express").Router()
const {addMember, deleteMember} = require("../Controllers/MemberControllers")
const authorize = require("../middlewares/auth")

//defining the mapping of the endpoints
router.post("/", authorize, addMember)

router.delete("/:userId", authorize, deleteMember)

module.exports = router