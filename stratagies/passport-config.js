const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const passport = require('passport')
const users = require('../server')

const initialize = (passport, getUserByEmail, getUserById) => { 

    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if (!user){
            return done(null, false, {message: 'No user with this email'})
        }
        try {
            if (await bcrypt.compare(password,user.password)){
    
            } else{
                return done(null, false, {message: 'Password incorrect'})
            }
        }
        catch (error) {
            return done(error)
        }
    }
    
    passport.use(new LocalStrategy('local',{usernameField: 'email'}), authenticateUser)
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })
}

module.exports = initialize;

