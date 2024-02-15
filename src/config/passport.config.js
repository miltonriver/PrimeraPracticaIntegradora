import passport from "passport";
import local from "passport-local";
// import usersModel from "../models/users.model.js"; //se hace a través del manager
import UserManagerMongo from "../manager/Mongo/userManagerMongo.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";

const LocalStrategy = local.Strategy
const userModel = new UserManagerMongo()

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, //para acceder al objeto req
        usernameField: 'username'
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, phone_number } = req.body
        try {
            let user = await userModel.getUser(username)

            if (user) return done(null, false)

            let newUser = {
                first_name,
                last_name,
                username,
                email,
                password: createHash(password),
                phone_number
            }

            let result = await userModel.createUser(newUser)

            return done(null, result)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport