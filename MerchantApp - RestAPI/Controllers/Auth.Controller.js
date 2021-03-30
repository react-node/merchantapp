const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
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
  register: async (req, res, next) => {
    try {
      // const { email, password } = req.body
      // if (!email || !password) throw createError.BadRequest()
      const result = await authSchema.validateAsync(req.body)

      const doesExist = await User.findOne({ email: result.email })
      if (doesExist)
        throw createError.Conflict(`${result.email} is already been registered`)
      const randomString = Math.random().toString(36).slice(2)
      result.activationKey = randomString
      const user = new User(result)
      var savedUser = await user.save()
      console.log(savedUser._id)
      const encrypt_email =  cryptr.encrypt(savedUser._id);
      // const emailSend = await sendEmail(randomString,encrypt_email,result.firstName,result.email)
      // console.log(emailSend)

      // if(!emailSend.messageId ) throw createError.InternalServerError("email not sent")
      // const accessToken = await signAccessToken(savedUser.id)
      // const refreshToken = await signRefreshToken(savedUser.id)
      const responseData = {
        status:200,
        message : "Registered successfully",
        _id : savedUser._id
      }
      res.send(responseData)
    } catch (error) {
      if (error.isJoi === true) error.status = 422
      if(error.status === 500)
      var deleteUser = await User.findByIdAndDelete(savedUser._id)
      next(error)
    }
  },
  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)
      const user = await User.findOne({ email: result.email})
      if (!user) throw createError.NotFound('User not registered')
      if(!user.isVerified) throw createError.NotAcceptable('Account not verified') 
      const isMatch = await user.isValidPassword(result.password)
      if (!isMatch)
        throw createError.Unauthorized('Username/password not valid')

      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)
      const isIDProofVerified = user.isIDProofVerified
      const userType = user.userType
      res.send({ accessToken, refreshToken,isIDProofVerified ,userType})
    } catch (error) {
      if (error.isJoi === true)
        return next(createError.BadRequest('Invalid Username/Password'))
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
      const verification = await User.findOne({_id : decrypt_id}).or([{activationKey:token},{isVerified:true}])
      console.log(verification)
      if(!verification) throw createError.NotFound()
      //const userModel = Object.assign(verification, {activationKey: "valid",isVerified:true});
      // verification.activationKey= "valid"
      // verification.isVerified= true
      let response = {status:5001, message :"verified successfully"}
      if(!verification.isVerified){
        const updatedResponse = await User.updateOne({_id:decrypt_id},{activationKey: "valid",isVerified:true},{new:true})
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
      const verification = await User.findOne({email })
      console.log(verification)
      if(!verification) throw createError.NotFound()
      const randomString = Math.random().toString(36).slice(2)
    
      const encrypt_email =  cryptr.encrypt(email);
      const emailSend = await sendEmail(randomString,encrypt_email,verification.firstName,email,"forgotPassword")
      const updateToken = await User.updateOne({_id:verification._id},{forgotPasswordToken : randomString})
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
      const verification = await User.findOneAndUpdate({email : decrypt_email,forgotPasswordToken:token},{password,forgotPasswordToken:null},{new:true})
      console.log(verification)
      if(!verification) throw createError.NotFound()
      res.send(verification) 
    }catch(err){
      next(err)
    }

  }
}
