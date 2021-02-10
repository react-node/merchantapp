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
  storeID : "",
  selectedStore : {},
  addStoreData : {},
  isLoading : false,
  selectedOffer : {},
  accessToken:null
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
  function setSelectedStore(storeData) {
    dispatch({
      type: "SET_STORE_DATA",
      payload: storeData
    });
  }
  function setAddStoreData(data) {
    dispatch({
      type: "SET_ADD_STORE_DATA",
      payload: data
    });
  }
  function setSelectedOffer(data) {
    dispatch({
      type: "SET_OFFER_DATA",
      payload: data
    });
  }
  function setLoading(data) {
    dispatch({
      type: "LOADING",
      payload: data
    });
  }
  function setAccessToken(data) {
    dispatch({
      type: "SET_TOKEN",
      payload: data
    });
  }
  function getAccessToken() {
    const token = window.sessionStorage.getItem("token")
    return token
  }
  return (
    <GlobalContext.Provider
      value={{
        employees: state.employees,
        removeEmployee,
        addEmployee,
        editEmployee,
        assignStoreID,
        storeID : state.storeID,
        setSelectedStore,
        selectedStore : state.selectedStore,
        addStoreData : state.addStoreData,
        setAddStoreData,
        isLoading : state.isLoading,
        setLoading,
        selectedOffer : state.selectedOffer,
        setSelectedOffer,
        setAccessToken,
        getAccessToken,
        accessToken:state.accessToken
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};