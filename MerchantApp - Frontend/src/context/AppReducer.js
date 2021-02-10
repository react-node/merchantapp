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
        case "GET_TOKEN":
        const token = window.sessionStorage.getItem("token")
        return {
          ...state,
         accessToken : token
          
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