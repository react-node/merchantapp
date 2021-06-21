//export const API_URI = "https://api-dot-fifth-pact-312314.uc.r.appspot.com";
export const API_URI = "http://localhost:3001";
export const GOOGLE_MAP_API_KEY = "AIzaSyDz3Y3z9MGUfIaxdhRr8LJM9dy-8IYBMyc"
export const GOOGLE_STORAGE_PUBLIC_URL = "https://storage.googleapis.com/infydealz_bucket/"
export const OFFERS_PATH = "/offers/"
export const BANNER_PATH = "/banners/"

//END POINTS
const REST_V = "/rest/v1"

export const STORES = `${REST_V}/store`
export const CUSTOMER_AUTH = `${REST_V}/customer/auth`
export const CUST_FORGOT_PASSWORD = `${CUSTOMER_AUTH}/forgotpassword`
export const CUST_UPDATE_PASSWORD = `${CUSTOMER_AUTH}/updatepassword`
export const VERIFY_USER = `${CUSTOMER_AUTH}/verify`
export const OFFERS  = `${REST_V}/offers`
export const OFFERS_METADATA  = `${REST_V}/offers/updatemetadata`

const ANONYMOUS =  `${REST_V}/anonymous`
export const CITY_ZIPCODES = `${ANONYMOUS}/cityAndZipcodes`
export const STORETYPE = `${ANONYMOUS}/storetype`
export const BANNERS = `${ANONYMOUS}/getBanners`
export const PAID_OFFERS = `${ANONYMOUS}/getOffers`
export const NEARBY_OFFERS = `${ANONYMOUS}/getNearByOffers`
export const SEARCH_STORE = `${ANONYMOUS}/searchStore`
export const SEARCH_STORE_INSIDE_MALL = `${ANONYMOUS}/searchMalls`
export const GET_STORE_AND_OFFER = `${ANONYMOUS}/getSearchStores`
export const GET_ALL_STORE_BY_SEARCH = `${ANONYMOUS}/searchAllStorers`
export const SEARCH_PRODUCT_CATEGORY = `${ANONYMOUS}/searchCategory`
export const STORE_IMAGE_DB  = `${REST_V}/imageupload/storeimages`
