export default (state, action) => {
    switch (action.type) {
      case "UPDATE_SEARCH_CRITERIA":
        return {
          ...state,
          tableSortingDetails : action.payload
        };
      
      default:
        return state;
    }
  };