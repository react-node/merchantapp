import React, { createContext, useReducer } from "react";
import AppReducer from "./AppReducer";

const initialState = {
  employees: [
    {
      id: 1,
      name: "Ishan Manandhar",
      location: "Kathmandu",
      designation: "Frontend Developer"
    }
  ],
  storeID : ""
};

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  function removeEmployee(id) {
    dispatch({
      type: "REMOVE_EMPLOYEE",
      payload: id
    });
  }

  function addEmployee(employees) {
    dispatch({
      type: "ADD_EMPLOYEES",
      payload: employees
    });
  }

  function editEmployee(employees) {
    dispatch({
      type: "EDIT_EMPLOYEE",
      payload: employees
    });
  }
  function assignStoreID(id) {
    dispatch({
      type: "ASSIGN_STORE_ID",
      payload: id
    });
  }

  return (
    <GlobalContext.Provider
      value={{
        employees: state.employees,
        removeEmployee,
        addEmployee,
        editEmployee,
        assignStoreID,
        storeID : state.storeID
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};