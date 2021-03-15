const Store = require('../Models/Store.model')

const validateStore = async ({owner,store_google_id,identity_proof,name,identity_type,location}) =>{
    let duplicate = false
    if(store_google_id){
      const result = await Store.findOne({store_google_id})
      if(result) return true
    }
    
      const long = location.coordinates[0]
      const lat = location.coordinates[1]
    //  const result = await Store.aggregate({name })
      //checking store existed or not in 3km radius 
      const METERS_PER_MILE = 1609.34
      const isStoreExisted = await Store.aggregate([
        {
            $geoNear :  { near: { type: "Point", coordinates: [ long,lat] },distanceField: "distance", maxDistance: 3 * METERS_PER_MILE,spherical: true , query :{ name} }
        }
      ])
      console.log(isStoreExisted)
      if(identity_type !== "GST" && isStoreExisted.length > 0){
        return true
      }
      if(identity_type === "GST" && isStoreExisted.length > 3){
        return true
      }
    
    const result = await Store.findOne({identity_proof , owner : {"$ne" : owner}})
      if(result) return true
    
    return duplicate
  }

  module.exports = {
      validateStore
  }