// improt nv variable only if the env is not production 
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

// importing the passport functionality 
const initializePassport = require('./stratagies/passport-config')

// creating users variable 
const users = []

// instantiating express router
const app = express()


// initializing the passport functionality 
initializePassport(passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
)

app.set('view-engine', 'ejs')

// to use data from request body 
app.use(express.urlencoded({extended: false})) 

// to flash error or success messages
app.use(flash()) 

// configuring session keys 
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false
}))

// initializing passport 
app.use(passport.initialize())
app.use(passport.session())
// require('./passport-config')(passport.initialize)


// home page
app.get('/', (req, res) => {
    res.render('index.ejs')
})

// login page
app.get('/login', (req, res) => {
    res.render('login.ejs')
})

// registration page
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

// post registeraion data is hashed and stored in the 'users' array
app.post('/register', async (req, res) => {
    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id : Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        // if data is saved successfully, redirect to the login page
        res.redirect('/login')
    }catch{
        // redirect back to register page if there is any error
        res.redirect('/register')
    }
    console.log(users)
})


app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true
}), )

// listens to app on the port
app.listen(process.env.PORT)

module.exports = users;