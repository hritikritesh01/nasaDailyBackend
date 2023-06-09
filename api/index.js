import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

const DB = process.env.MONGO_URI

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then( () => console.log("DB connected"))
.catch((err) => console.log(err))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

// Routes
app.post("/login", (req,res) => {
    const {email, password} = req.body
    User.findOne({email : email})
    .then((user) => {
        if(user){
            if(password == user.password){
                res.send({message: "Login Successful", user: user})
            }else{
                res.send({message: "Password didn't match"})
            }
        }
        else{
           res.send({message: "User not registered"})
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

app.post("/register", (req,res) => {
    const {name, email, password} = req.body

    User.findOne({email : email})
    .then((user) => {
        if(user){
            res.send({message: "user already registered"})
        }
        else{
            const user = new User({
                name,
                email,
                password
            })
            
            user.save()
            .then(() => {
                res.send({message: "user successfully registered"})
            })
            .catch((err) => {
                console.log(err)
            })
        }
    })
    .catch((err) => {
        console.log(err)
    })
})

module.exports = app;