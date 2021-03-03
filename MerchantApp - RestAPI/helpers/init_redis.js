const redis = require('redis')
//test env cloud server details
// const client = redis.createClient({
//   port: 17289,
//   host: 'redis-17289.c238.us-central1-2.gce.cloud.redislabs.com',
//   auth_pass : "tdRFlU7XdnvjmDq7mY8XKiVxw9oopkKe"

// })
//local environment
const client = redis.createClient({
  port: 6379,
  host: '127.0.0.1',
})

client.on('connect', () => {
  console.log('Client connected to redis...')
})

client.on('ready', () => {
  console.log('Client connected to redis and ready to use...')
})

client.on('error', (err) => {
  console.log(err.message)
})

client.on('end', () => {
  console.log('Client disconnected from redis')
})

process.on('SIGINT', () => {
  client.quit()
})

module.exports = client
