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
  accessToken:null,
  bannerSearchData : {},
  selectedSlotsData : [],
  slotsAvailability:[],
  historyData :[],
  refreshToken : null,
  isIDProofVerified : false
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
  function setBannerSearchData(data) {
    dispatch({
      type: "SET_BANNER_SEARCH_DATA",
      payload: data
    });
  }
  function setHistoryData(data) {
    dispatch({
      type: "SET_HISTORY_DATA",
      payload: data
    });
  }
  function setSelectedSlotsData(data) {
    dispatch({
      type: "SET_SELECTED_SLOTS_DATA",
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
  function setRefreshToken(data) {
    dispatch({
      type: "SET_REFRESH_TOKEN",
      payload: data
    });
  }
  function setIDProofVerified(data) {
    dispatch({
      type: "SET_IS_ID_VERIFIED",
      payload: data
    });
  }
  function setSlotsAvailability(data) {
    dispatch({
      type: "SET_SLOT_AVAILABILITY",
      payload: data
    });
  }
  function getAccessToken() {
    const token = window.sessionStorage.getItem("token")
    return token
  }
  function getRefreshToken() {
    const refreshToken = window.sessionStorage.getItem("refreshToken")
    return refreshToken
  }
  function getIDProofVerified() {
    const isIDProofVerified = window.sessionStorage.getItem("isIDProofVerified")
    return  JSON.parse(isIDProofVerified)
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
        accessToken:state.accessToken,
        bannerSearchData:state.bannerSearchData,
        setBannerSearchData,
        setSelectedSlotsData,
        selectedSlotsData : state.selectedSlotsData,
        setSlotsAvailability,
        slotsAvailability:state.slotsAvailability,
        historyData : state.historyData,
        setHistoryData,
        setRefreshToken,
        getRefreshToken,
        refreshToken : state.refreshToken,
        setIDProofVerified,
        getIDProofVerified
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};