const router = require("express").Router()
const {getRole, createRole} = require("../Controllers/RoleControllers")

//defining the mapping of the endpoints
router.get("/", getRole)

router.post("/", createRole)

module.exports = router