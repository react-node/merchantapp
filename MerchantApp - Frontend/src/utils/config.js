//export const API_URI = "https://api-dot-api-project-908088024896.uc.r.appspot.com";
export const API_URI = "http://localhost:3001";
export const ACCESS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MTI4OTY5MDYsImV4cCI6MTYxMjkwNzcwNiwiYXVkIjoiNjAyMjUwZjlmOGFmNWUyNWEwMDNlZTM3IiwiaXNzIjoidGVjaGJpOCJ9.kM0fMieB0h0R9jb8P7H8s30xHf7GOD8A0R5KluiqSto"
export const GOOGLE_MAP_API_KEY = "AIzaSyAX1-u7kNBGOX1pAm79eDBXCb8KBU851TI"
//export const GOOGLE_MAP_API_KEY =  "AIzaSyBfE9S6nfEMD8mX3D4IVfuynq9AYnBz9Eo"
export const GOOGLE_STORAGE_PUBLIC_URL = "https://storage.googleapis.com/dileep06578/"
export const OFFERS_PATH = "/offers/"
export const IDENTITY_PROOF_PATH = "/idproof"
export const BANNER_PATH = "/banners/"

//END POINTS
const REST_V = "/rest/v1"
export const STORES = `${REST_V}/store`
export const GET_ALL_STORES = `${REST_V}/store/getAllStores`
export const IMAGE_UPLOAD =`${REST_V}/imageupload/`
export const STORE_IMAGE_DB  = `${REST_V}/imageupload/storeimages`
export const OFFERS  = `${REST_V}/offers`
export const GET_STORES_BY_ID = `${OFFERS}/storesbyoffer`
export const GET_ALL_OFFERS = `${OFFERS}/getAllOffers`
export const GET_OFFERS_BY_ZIPCODES = `${OFFERS}/getOfferByZipcodes`
export const USER_VERIFY = `/auth/user/verify`
export const FORGOT_PASSWORD = `/auth/user/forgotpassword`
export const RESET_PASSWORD = `/auth/user/updatepassword`
export const DASHBOARD = `${REST_V}/profile/dashboard`
export const PROFILE = `${REST_V}/profile/me`
export const CHECK_GST = `${REST_V}/profile/me/checkGST`
export const BANNER_API = `${REST_V}/imageupload/banner`
export const BANNER__BY_ZIPCODE = `${REST_V}/imageupload/bannerByzipcodes`
export const BANNER_SLOT_API = `${REST_V}/slotbooking/banner`
export const OFFER_SLOT_API = `${REST_V}/slotbooking/offer`
export const SEARCH_SLOT_API = `${REST_V}/slotbooking/searchbanneravailability`
export const SEARCH_OFFER_SLOT_API = `${REST_V}/slotbooking/searchofferavailability`
export const MALLS_DATA = `${REST_V}/utils/malls`
export const VALIDATE_IDENTITY = `${REST_V}/profile/me/validate_identity`
export const OFFER_HISTORY = `${REST_V}/slotbooking/offerHistory`
export const BANNER_HISTORY = `${REST_V}/slotbooking/bannerHistory`
export const INIT_PAYMENT = `${REST_V}/payment`
export const GET_ORDER_DETAILS = `${REST_V}/payment/orderDetails`
export const CITY_ZIPCODES = `${REST_V}/utils/cityAndZipcodes`
export const ASSIGN_CITY_ZIPCODES = `${REST_V}/utils/assignCityAndZipcodes`
export const GET_USERS = `${REST_V}/profile/users`
export const GET_USER = `${REST_V}/profile/getUser`
export const UPDATE_USER_STATUS = `${REST_V}/profile/updateStatus`
