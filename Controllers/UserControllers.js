// const {getme, signup, login} = require("../Controllers/UserControllers")

const User = require("../Models/UserModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserControllers = {
    getMe: async (req, res) => {
        try {
          const userId = req.user;
      
          // Fetch the user's details from the User model
          const user = await User.findOne({id: userId})
      
          if (!user) {
            return res.status(404).json({
              message: "User not found"
            });
          }
      
          // Return the user details
          return res.status(200).json(user);
        } 
        catch (err) {
          console.error(err);
          return res.status(500).json({
            message: "Internal Server Error",
            error: err
          });
        }
    },


    signup: async (req, res) => {
        const {name, email, password} = req.body

        try {
            let user = await User.findOne({email});
            if(user) {
                console.log(user)
                return res.status(400).json({
                    msg: "User ALready Exists"
                })
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            user = new User({
                name, 
                email, 
                password: hashPassword, 
            })
            await user.save()
    
            //whenever i create, the mongoDB assigns an unique _id to every user
            const payload = {
                user: user.id,
            }
    
            const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 360000});
    
            res.cookie("token", token, {httpOnly: true, expiresIn: 360000})
            
            //...rest is the spread operator, in this situation
            //we want to send back the user credentials, but not password
            //that is why, we are storing every details in the "rest" apart from password
            const {password: pass, ...rest} = user._doc
    
            res.status(201).json({
                msg: "User Created Successfully", 
                user: rest
            })
        }
        catch (err) {
            console.log(err.message)
            res.status(500).json({
                error: err,
                msg: "Internal Server Error"
            })
        }
    },

    signin: async (req, res) => {
        const {email, password} = req.body;
        try {
            let user = await User.findOne({'email' : email})
            if(!user) {
                return res.status(404).json({
                    msg: "User does not exists"
                })
            }
            const isMatch = await bcrypt.compare(password, user.password)
    
            if(!isMatch) {
                return res.status(400).json({
                    msg: "User Credentials did not match, please enter valid details"
                })
            }
    
            const payload = {
                user: user.id
            }
    
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: 360000
            })
    
            res.cookie("token", token, {httpOnly: true, expiresIn: 360000})
            
            const {password: pass, ...rest} = user._doc
    
            res.status(200).json({
                msg: "User Logged in Successfully",
                user: rest
            })
            console.log("Token generated and sent to the client side")
        }
        catch (err) {
            console.log(err);
            res.status(500).json({
                error: err.message,
                msg: "Internal Server Error"
            })
        }
    }
}

module.exports = UserControllers