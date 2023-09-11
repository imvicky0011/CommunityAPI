const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const dbConnct = require("./config/db")
const UserRoutes = require("./Routes/UserRoutes")
const RoleRoutes = require("./Routes/RoleRoutes")
const MemberRoutes = require("./Routes/MemberRoutes")
const CommunityRoutes = require("./Routes/CommunityRoutes")
const {Snowflake} = require("@theinternetfolks/snowflake")

app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({extended: true}))
dotenv.config()


dbConnct();
app.listen(3000, () => {
    console.log("server running!")
})


app.use("/v1/auth", UserRoutes)
app.use("/v1/role", RoleRoutes)
app.use("/v1/community", CommunityRoutes)
app.use("/v1/member", MemberRoutes)