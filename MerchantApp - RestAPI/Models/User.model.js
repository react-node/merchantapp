const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
  firstName: {
    type : String,
    required : true
  },
  lastName: {
    type:String,
    required : true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  policy : {
    type : Boolean,
    required:true
  },
  activationKey :{
    type:String,
    default:null
  },
  forgotPasswordToken :{
    type:String,
    default:null
  },
  phoneNumber :{
    type:Number,
    default:null
  },
  isVerified:{
    type:Boolean,
    default: false
  },
  identityProofs : [{
    id_type : String,
    id_number : String,
    upload_path : String
  }],
  isIDProofVerified : {
    type:Boolean,
    default : false
  },
  userType : {
    type:Number,
    default:3  // 1-super admin  2-admin 3-merchant
  },
  isDeleted : {
    type: Boolean,
    default:false
  }


},{
  timestamps: true
})

UserSchema.pre('save', async function (next) {
  try {
    console.log("pre save fucnction")
    /* 
    Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
    */
    if (this.isNew || this.isModified("password")) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(this.password, salt)
      this.password = hashedPassword
    }
    next()
  } catch (error) {
    next(error)
  }
})
UserSchema.pre('findOneAndUpdate', async function(next){
  try{
  console.log("pre update fucnction")
  /* 
  Here first checking if the document is new by using a helper of mongoose .isNew, therefore, this.isNew is true if document is new else false, and we only want to hash the password if its a new document, else  it will again hash the password if you save the document again by making some changes in other fields incase your document contains other fields.
  */
  if (this._update.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this._update.password, salt)
    this._update.password = hashedPassword
  }
  next()
} catch (error) {
  next(error)
}
})
UserSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    throw error
  }
}

const User = mongoose.model('user', UserSchema)
module.exports = User
