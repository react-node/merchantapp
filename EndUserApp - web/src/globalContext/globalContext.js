import createDataContext from '../utils/createDataContext';

import UserReducer from "./globalReducer";
const initialState = {
  userLocation :{},
  popularAreas:[],
  loginModel : false,
  searchModel : false,
  menuModel : false,
  offersPage : 1,
  storeImagePage : 1
}
console.log("context initial data-----",initialState)
const addBlogPost = (dispatch) => {
  return (title, content, callback) => {
    dispatch({ type: 'add_blogpost', payload: { title, content } });
    if (callback) {
      callback();
    }
  };
};
const setUserLocation = (dispatch) => {
  return (userLocation) => {
    dispatch({ type: 'SET_USER_LOCATION', payload: userLocation });
   
  };
};
const setAccessToken = () => {
  return (accessToken) => {
    sessionStorage.setItem("accessToken" ,accessToken )

   
  };
};
const getAccessToken = () => {
  return () => {
    const accesstoken  = sessionStorage.getItem("accessToken")

    return accesstoken
   
  };
};
const setLoginModel = (dispatch) => {
  return (val) => {
    dispatch({ type: 'SET_LOGIN_MODEL', payload: val });
   
  };
};
const setSearchModel = (dispatch) => {
  return (val) => {
    dispatch({ type: 'SET_SEARCH_MODEL', payload: val });
   
  };
};
const setMenuModel = (dispatch) => {
  return (val) => {
    dispatch({ type: 'SET_MENU_MODEL', payload: val });
   
  };
};
const setOffersPage = (dispatch) => {
  return (val) => {
    dispatch({ type: 'SET_OFFERS_PAGE', payload: val });
   
  };
};
const setStoreImagePage = (dispatch) => {
  return (val) => {
    dispatch({ type: 'SET_STORE_IMAGE_PAGE', payload: val });
   
  };
};


const getUserLocation = () => {
  return () => {
    const userLocation  = sessionStorage.getItem("userLocation")

    return JSON.parse(userLocation)
   
  };
};
const setPopularAreas = (dispatch) => {
  return (popularAreas) => {
    dispatch({ type: 'SET_POPULAR_AREAS', payload: popularAreas });
   
  };
};

const deleteBlogPost = (dispatch) => {
  return (id) => {
    dispatch({ type: 'delete_blogpost', payload: id });
  };
};
const editBlogPost = (dispatch) => {
  return (id, title, content, callback) => {
    dispatch({
      type: 'edit_blogpost',
      payload: { id, title, content },
    });
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  UserReducer,
  { addBlogPost,
    deleteBlogPost,
    editBlogPost ,
    setUserLocation,
    setPopularAreas,
    getUserLocation,
    setLoginModel,
    setAccessToken,
    getAccessToken,
    setOffersPage,
    setStoreImagePage,
    setSearchModel,
    setMenuModel

    },
  initialState
);
  