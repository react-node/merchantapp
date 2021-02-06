const {format} = require('util')
const gc = require('../config/')
const bucket = gc.bucket(process.env.GCS_BUCKET) // should be your bucket name

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

const uploadImage = (file,userID,imagePath="") => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const offersPath = imagePath ? imagePath+"/":'/'
  console.log(`${userID}${offersPath}`+originalname.replace(/ /g, "_"))
  const blob = bucket.file(`${userID}${offersPath}`+originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    )
    resolve(publicUrl)
  })
  .on('error', (err) => {
    console.log(err)
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

module.exports = uploadImage