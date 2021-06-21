const createError = require('http-errors')
const EndUser = require('../Models/EndUser.model')
const { endUserAuthSchema} = require('../helpers/validation_schema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/jwt_helper')
const Cryptr = require('cryptr');
const client = require('../helpers/init_redis')
const sendEmail = require('../helpers/email_send');
const cryptr = new Cryptr(process.env.ENCRYPT_SECRET_KEY);
module.exports = {
  
  // End user login or signup.
  // If email existed login directly or else create and login
   // Here we are going to use email as unique to store accesstoken and refreshtoken in redis.

  LoginORSignup: async (req, res, next) => {
    try {
      // const { email, password } = req.body
      // if (!email || !password) throw createError.BadRequest()
      const result = await endUserAuthSchema.validateAsync(req.body)
      var isNewUser = false

      var user = await EndUser.findOne({ email: result.email })
      if (user){
        if(!user.isVerified) throw createError.NotAcceptable('Account not verified') 
        const isMatch = await user.isValidPassword(result.password)
        if (!isMatch)
          throw createError.Unauthorized('Username/password not valid')
        var accessToken = await signAccessToken([user.email,user._id])
        var refreshToken = await signRefreshToken(user.email)
        
      }else{
        const randomString = Math.random().toString(36).slice(2)
        result.activationKey = randomString
        const newUser = new EndUser(result)
        user = await newUser.save()
        console.log(user._id)
        const encrypt_email =  cryptr.encrypt(user.email);
        const emailSend = await sendEmail(randomString,encrypt_email,"User",result.email)
        console.log(emailSend)
  
        if(!emailSend.messageId ) throw createError.InternalServerError("email not sent")
        // const accessToken = await signAccessToken(savedUser.id)
        // const refreshToken = await signRefreshToken(savedUser.id)
        isNewUser = true
      }
      if(isNewUser){
        res.send({isNewUser})

      }else{
        res.send({accessToken,refreshToken,isNewUser})

      }
     
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      if(error.message === "email not sent")
      var deleteUser = await EndUser.findByIdAndDelete(user._id)
      next(error)
    }
  },
  
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })
    } catch (error) {
      next(error)
    }
  },

  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      console.log(refreshToken)
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)
      client.DEL(userId, (err, val) => {
        if (err) {
          console.log(err.message)
          throw createError.InternalServerError()
        }
        console.log(val)
        res.sendStatus(204)
      })
    } catch (error) {
      next(error)
    }
  },
  verifyUser:async (req,res,next)=>{
    try{
      const { token,id } = req.body
      if (!token || !id ) throw createError.BadRequest()
      const decrypt_id =  cryptr.decrypt(id);
      console.log(decrypt_id)
      const verification = await EndUser.findOne({email : decrypt_id}).or([{activationKey:token},{isVerified:true}])
      console.log(verification)
      if(!verification) throw createError.NotFound()
      //const userModel = Object.assign(verification, {activationKey: "valid",isVerified:true});
      // verification.activationKey= "valid"
      // verification.isVerified= true
      let response = {status:5001, message :"verified successfully"}
      if(!verification.isVerified){
        const updatedResponse = await EndUser.updateOne({email:decrypt_id},{activationKey: "valid",isVerified:true},{new:true})
        console.log(updatedResponse)
        
      }else{
        response.message="Already verified"
        response.status = 5002
      }
     
      
      return res.send(response)

    }catch(error){
      next(error)
    }
  },
  forgotpassword : async (req,res,next)=>{
    try{
  
      const {email } = req.body
      if (!email) throw createError.BadRequest()
      const verification = await EndUser.findOne({email })
      console.log(verification)
      if(!verification) throw createError.NotFound()
      const randomString = Math.random().toString(36).slice(2)
    
      const encrypt_email =  cryptr.encrypt(email);
      const emailSend = await sendEmail(randomString,encrypt_email,"User",email,"forgotPassword")
      const updateToken = await EndUser.updateOne({_id:verification._id},{forgotPasswordToken : randomString})
      const responseData = {
        status :200,
        message: "Email sent to registerd email address."
      }
      res.send(responseData)
    }catch(e){
      next(e)
    }
  },
  updatepassword : async(req,res,next)=>{
    try{
      const { token,email,password } = req.body
      if (!token || !email ) throw createError.BadRequest()
      const decrypt_email =  cryptr.decrypt(email);
      console.log(decrypt_email)
      const verification = await EndUser.findOneAndUpdate({email : decrypt_email,forgotPasswordToken:token},{password,forgotPasswordToken:null},{new:true})
      console.log(verification)
      if(!verification) throw createError.NotFound()
      res.send(verification) 
    }catch(err){
      next(err)
    }

  }
}
