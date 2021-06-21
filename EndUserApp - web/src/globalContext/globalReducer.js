export default (state, action) => {
    switch (action.type) {
      case "SET_USER_LOCATION":
        sessionStorage.setItem("userLocation",JSON.stringify(action.payload))
        return {
          ...state,
          userLocation : action.payload
        };
      case "SET_POPULAR_AREAS":
        return {
          ...state,
          popularAreas : action.payload
        };
      case "SET_LOGIN_MODEL":
        return {
          ...state,
          loginModel : action.payload
        };
      case "SET_SEARCH_MODEL":
        return {
          ...state,
          searchModel : action.payload
        };
      case "SET_MENU_MODEL":
        return {
          ...state,
          menuModel : action.payload
        };
      case "SET_OFFERS_PAGE":
        return {
          ...state,
          offersPage : action.payload
        };
      case "SET_STORE_IMAGE_PAGE":
        return {
          ...state,
          storeImagePage : action.payload
        };
      default:
        return state;
    }
  };