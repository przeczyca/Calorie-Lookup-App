require("dotenv").config()
var path = require('path')
const express = require("express")
const mysql = require("mysql")
const cors = require("cors")

const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const bcrypt = require("bcrypt")
const saltRounds = 10

const fetch = require("node-fetch")
const apiUSDA = {
    key: process.env.USDA_API_KEY,
    dataType: ["Survey (FNDDS)"],
    pageSize: process.env.PAGE_SIZE,
}

const app = express()

app.use(express.static(path.join(__dirname, 'build')))
app.use(express.json())
app.use(cors({
    //origin: [process.env.ORIGIN],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}))
app.use(session({
    key: "userID",
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: "/",
        maxAge: 3600000,
    },
}))

const db = mysql.createPool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: "heroku_e533b9d77e37da2",
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  })

//register new user
//inserts new username and password hash to database
app.post("/api/register", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const sqlRegister = "INSERT INTO heroku_e533b9d77e37da2.users (username, password) VALUES (?,?)"

    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err){
            console.log(err)
        }else {
            db.query(sqlRegister,
                [username, hash],
                (err, result) => {
                if (err) res.send(err.code)
                else res.send("new user added")
            })
        }
    })
})

//check cookies if user is logged in
//sends usernameloggedIn as true or loggedIn as false
app.get("/api/session", (req, res) => {
    if (req.session.user) {
        res.send({loggedIn: true, user: req.session.user[0].username})
    } else {
        res.send({loggedIn: false})
    }
})

//get saved user recipes
app.get("/api/getsavedfooddata", (req, res) => {
    const username = req.session.user ? req.session.user[0].username : "akqareuinvaadlckaiprenvakdnvpiaer"
    sqlRecipes = "Select * from heroku_e533b9d77e37da2.saved_foods WHERE username=?"

    db.query(sqlRecipes, username, (err, result) => {
        if (err) {
            res.send({err: err})
        } else {
            res.send(result)
        }
    })
})

//login as user
//sends username/hash or why login didn't work
app.post("/api/login", (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const sqlLogin = "SELECT * FROM heroku_e533b9d77e37da2.users WHERE username=?"

    db.query(sqlLogin,
        username,
        (err, result) => {

        if (err) {
            res.send({err: err})
        }
        if (result.length > 0) {
            bcrypt.compare(password, result[0].password, (error, response) => {
                if (response){
                    req.session.user = result
                    req.session.save()
                    res.send(result)
                } else{
                    res.send({message: "Wrong username or password"})
                }
            })
        }else {
            res.send({message: "User does not exist"})
        }
    })
})

//logout user
app.get("/api/logout", (req, res) => {
    req.session.destroy()
    res.clearCookie("userID")
})

//search USDA database
app.post("/api/search", (req, res) => {
    const searchTerm = req.body.searchTerm
    apiUrl = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiUSDA.key}&query=${encodeURIComponent(searchTerm)}&dataType=${encodeURIComponent(apiUSDA.dataType)}&pageSize=${encodeURIComponent(apiUSDA.pageSize)}`

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => res.send(data));
})

//Saves food data to specific user
app.post("/api/savefood", (req, res) => {
    const username = req.session.user ? req.session.user[0].username : "akqareuinvaadlckaiprenvakdnvpiaer"
    const foodName = req.body.name
    const calories = req.body.calories
    const proteins = req.body.proteins
    const fats = req.body.fats
    const carbs = req.body.carbs
    sqlSaveFood = `INSERT INTO heroku_e533b9d77e37da2.saved_foods (username, food_name, calories, proteins, fats, carbs) VALUES (?, ?, ?, ?, ?, ?)`

    db.query(sqlSaveFood, [username, foodName, calories, proteins, fats, carbs], (err, result) => {
        if (err) res.send(err)
    })
})

//removes saved food data from specific user
app.post("/api/removeFood", (req, res) => {
    const username = req.session.user ? req.session.user[0].username : "akqareuinvaadlckaiprenvakdnvpiaer"
    const foodName = req.body.foodName
    sqlRemoveSavedFood = `DELETE FROM heroku_e533b9d77e37da2.saved_foods WHERE username=? AND food_name=?`

    db.query(sqlRemoveSavedFood, [username, foodName], (err, result) => {
        if (err) res.send(err)
    })
})

app.listen(process.env.PORT, () => {
    console.log("server is running")
})