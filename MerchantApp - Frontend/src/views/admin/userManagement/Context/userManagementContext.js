import createDataContext from '../../CommonComponents/createDataContext';

import UserReducer from "./UserReducer";
const initialState = {
  tableSortingDetails :{},
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
const updateSearchCriteria = (dispatch) => {
  return (tableSortingDetails) => {
    dispatch({ type: 'UPDATE_SEARCH_CRITERIA', payload: tableSortingDetails });
   
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
  { addBlogPost, deleteBlogPost, editBlogPost ,updateSearchCriteria},
  initialState
);
  