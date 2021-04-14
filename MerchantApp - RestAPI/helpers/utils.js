const AssignedCities = require('../Models/AssignedCities.model')

const getAssignedZipcodes = async (_id) =>{
  try {
    user = await AssignedCities.findOne({ assignedTo: _id })
   
    return user
  } catch (error) {
    throw error
  }
    
}

module.exports = {
  getAssignedZipcodes
}