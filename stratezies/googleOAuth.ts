import passport from "passport"
import googleStrategy from "passport-google-oauth20"
import User, {IUserSchema} from "../database/schema/user";

passport.use(new googleStrategy.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "http://localhost:3001/api/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    console.log("hello",profile)
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    // User.find({googleId: profile.id}, (err: string | null, user: IUserSchema | undefined, profile: object)=>{
      //     return cb(err, profile);
      // })
    const user = await User.findOne({googleId: profile.id});
    if (user){
       console.log(profile)
       console.log(user)
      return cb(null, user);
    }
    else {
      let username=`${profile.displayName}-${profile.id}`
      let firstname=`${profile.name?.givenName}`
      let toBeCreatedUser={
        email: `${profile._json.email}`,
        userName: `${username}`,
        firstName: `${firstname}`,
        googleId: `${profile._json.picture}`,
        image: `${profile.profileUrl}`,
      }
      const createdUser = await User.create(toBeCreatedUser);
      console.log(createdUser);
      return cb(null, createdUser)
    }
  }
));