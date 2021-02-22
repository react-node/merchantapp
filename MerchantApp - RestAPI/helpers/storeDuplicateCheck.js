const Store = require('../Models/Store.model')

const validateStore = async ({owner,store_google_id,identity_proof}) =>{
    let duplicate = false
    if(store_google_id){
      const result = await Store.findOne({store_google_id})
      if(result) return true
    }
    const result = await Store.findOne({identity_proof , owner : {"$ne" : owner}})
      if(result) return true
    
    return duplicate
  }

  module.exports = {
      validateStore
  }