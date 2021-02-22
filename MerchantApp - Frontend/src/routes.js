import React from 'react';
import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/layouts/DashboardLayout';
import MainLayout from 'src/layouts/MainLayout';
import AccountView from 'src/views/account/AccountView';
import DashboardView from 'src/views/reports/DashboardView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import StoreListView from 'src/views/store/StoreListView';
import AddStoreView from 'src/views/store/AddStoreView';
import StoreDetailView from 'src/views/store/StoreDetailView';
import StoreEditView from 'src/views/store/StoreEditView';
import RegisterView from 'src/views/auth/RegisterView';
import VerificationView from 'src/views/auth/VerificationView';
import ForgotPasswordView from 'src/views/auth/ForgotPasswordView';
import UpdatePasswordView from 'src/views/auth/UpdatePasswordView';
import OffersListView from 'src/views/offer/OffersListView';
import BannerImageView from 'src/views/bannerImages';
import SlotBookingView from 'src/views/slotBooking';
import OfferSlotBookingView from 'src/views/slotBooking/offerSlotBooking';
import SlotBookingFinalView from 'src/views/slotBooking/slotBookingFinal';
import OfferDetailsView from 'src/views/offer/OfferDetailsView';
import AddOffersView from 'src/views/offer/NewOffers';
import EditOffersView from 'src/views/offer/EditOffers';

const routes = (accessToken)=> [
  {
    path: 'app',
    element: !accessToken ? <Navigate to="/" /> : <DashboardLayout />,
    children: [
      { path: 'Profile', element: <AccountView /> },
     // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'stores', element: <StoreListView /> },
      { path: 'stores/addstore', element: <AddStoreView /> },
      { path: 'store/details', element: <StoreDetailView /> },
      { path: 'store/edit', element: <StoreEditView /> },
      { path: 'offers', element: <OffersListView /> },
      { path: 'offers/addoffer', element: <AddOffersView /> },
      { path: 'offers/offerdetail', element: <OfferDetailsView /> },
      { path: 'offer/editoffer', element: <EditOffersView /> },
      { path: 'banner_images', element: <BannerImageView /> },
      { path: 'banner_slot_booking', element: <SlotBookingView /> },
      { path: 'offer_slot_booking', element: <OfferSlotBookingView /> },
      { path: 'slot_booking/next', element: <SlotBookingFinalView /> },
      // { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: accessToken ? <Navigate to="/app/dashboard" /> :  <MainLayout />,
    children: [
      { path: '/', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: 'forgotPassword', element: <ForgotPasswordView /> },
      { path: 'user/verify/:token/:userid', element: <VerificationView /> },
      { path: 'user/updatepassword/:token/:email', element: <UpdatePasswordView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
