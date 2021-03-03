export default (state, action) => {
    switch (action.type) {
      case "REMOVE_EMPLOYEE":
        return {
          ...state,
          employees: state.employees.filter(
            employee => employee.id !== action.payload
          )
        };
      case "ADD_EMPLOYEES":
        return {
          ...state,
          employees: [...state.employees, action.payload]
        };
      case "ASSIGN_STORE_ID":
        return {
          ...state,
          storeID : action.payload
        };
      case "SET_STORE_DATA":
        return {
          ...state,
          selectedStore : action.payload
        };
      case "SET_ADD_STORE_DATA":
        return {
          ...state,
          addStoreData : action.payload
        };
      case "SET_OFFER_DATA":
        return {
          ...state,
          selectedOffer : action.payload
        };
      case "SET_BANNER_SEARCH_DATA":
        return {
          ...state,
          bannerSearchData : action.payload
        };
      case "SET_SELECTED_SLOTS_DATA":
        return {
          ...state,
          selectedSlotsData : action.payload
        };
      case "SET_SLOT_AVAILABILITY":
        return {
          ...state,
          slotsAvailability : action.payload
        };
      case "SET_HISTORY_DATA":
        return {
          ...state,
          historyData : action.payload
        };
      case "LOADING":
        return {
          ...state,
          isLoading : action.payload
        };
      case "SET_TOKEN":
        window.sessionStorage.setItem("token",action.payload)
        return {
          ...state,
          accessToken : action.payload
          
        };
      case "SET_REFRESH_TOKEN":
        window.sessionStorage.setItem("refreshToken",action.payload)
        return {
          ...state,
          refreshToken : action.payload
          
        };
      case "GET_TOKEN":
        const token = window.sessionStorage.getItem("token")
        return {
          ...state,
         accessToken : token
          
        };
      case "GET_REFRESH_TOKEN":
        const refreshToken = window.sessionStorage.getItem("refreshToken")
        return {
          ...state,
         refreshToken : refreshToken
          
        };
      case "EDIT_EMPLOYEE":
        const updatedEmployee = action.payload;
  
        const updatedEmployees = state.employees.map(employee => {
          if (employee.id === updatedEmployee.id) {
            return updatedEmployee;
          }
          return employee;
        });
  
        return {
          ...state,
          employees: updatedEmployees
        };
      default:
        return state;
    }
  };