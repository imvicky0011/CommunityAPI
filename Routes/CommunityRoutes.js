const router = require("express").Router()
const {createCommunity, getAllCommunity, getCommunityMembers, getMyOwnedCommunity, getMyJoinedCommunity} = require("../Controllers/CommunityControllers")
const authorize = require("../middlewares/auth")

//defining the mapping of the endpoints
router.post("/", authorize, createCommunity)

router.get("/", getAllCommunity)

router.get("/:id/members", getCommunityMembers)

router.get("/me/owner",  authorize, getMyOwnedCommunity)

router.get("/me/members", authorize, getMyJoinedCommunity)

module.exports = router