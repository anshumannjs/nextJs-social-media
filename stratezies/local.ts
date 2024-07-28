import passport from "passport"
import { Strategy } from "passport-local"

import {users} from "../database/schema/user"
import helper from "../utils/helper"
const {comparePassword} = helper

type userObjectType = {
    id?: string
}
passport.serializeUser((user: userObjectType, done: Function)=>{
    console.log("Serializing")
    console.log(user)
    done(null, user.id);
})

passport.deserializeUser( async (id: string, done: Function)=>{
    console.log("Deserializing")
    console.log(id)
    try{
        const user = await users.findById(id);
        if (!user) throw new Error("User Not Found");
        done(null, user);
    }
    catch(err){ 
        console.log(err);
        done(err, null);
    }
})

passport.use(
    new Strategy({
        usernameField: "email",
    }, async (email: string, password: string, done: Function) => {
        console.log("hello")
        try{
            if (!email || !password) {
                throw new Error("Bad Request, Missing Credentials")
            }
            else {
                type userDb = { password: string}
                const userDb: userDb | null = await users.findOne({ email });
                if (userDb) {
                    if (comparePassword(password, userDb?.password)) {
                        done(null, userDb);
                    }
                    else {
                        throw new Error("Wrong Password")
                    }
                }
                else {
                    throw new Error("No User Found")
                }
            }
        }
        catch(err){
            done(err, null);
        }
    })
)