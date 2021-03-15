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

export const STORES = "/rest/v1/store"
export const GET_ALL_STORES = "/rest/v1/store/getAllStores"
export const IMAGE_UPLOAD ="/rest/v1/imageupload/"
export const STORE_IMAGE_DB  = "/rest/v1/imageupload/storeimages"
export const OFFERS  = "/rest/v1/offers"
export const GET_STORES_BY_ID = `${OFFERS}/storesbyoffer`
export const GET_ALL_OFFERS = `${OFFERS}/getAllOffers`
export const USER_VERIFY = `/auth/user/verify`
export const FORGOT_PASSWORD = `/auth/user/forgotpassword`
export const RESET_PASSWORD = `/auth/user/updatepassword`
export const DASHBOARD = `/rest/v1/profile/dashboard`
export const PROFILE = `/rest/v1/profile/me`
export const CHECK_GST = `/rest/v1/profile/me/checkGST`
export const BANNER_API = `/rest/v1/imageupload/banner`
export const BANNER_SLOT_API = `/rest/v1/slotbooking/banner`
export const OFFER_SLOT_API = `/rest/v1/slotbooking/offer`
export const SEARCH_SLOT_API = `/rest/v1/slotbooking/searchbanneravailability`
export const SEARCH_OFFER_SLOT_API = `/rest/v1/slotbooking/searchofferavailability`
export const MALLS_DATA = `/rest/v1/utils/malls`
export const VALIDATE_IDENTITY = `/rest/v1/profile/me/validate_identity`
export const OFFER_HISTORY = `/rest/v1/slotbooking/offerHistory`
export const BANNER_HISTORY = `/rest/v1/slotbooking/bannerHistory`
export const INIT_PAYMENT = `/rest/v1/payment`
export const GET_ORDER_DETAILS = `/rest/v1/payment/orderDetails`
