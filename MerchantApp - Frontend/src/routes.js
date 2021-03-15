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
import SlotHistoryView from 'src/views/slotHistory';
import OfferSlotBookingView from 'src/views/slotBooking/offerSlotBooking';
import SlotBookingFinalView from 'src/views/slotBooking/slotBookingFinal';
import OfferDetailsView from 'src/views/offer/OfferDetailsView';
import AddOffersView from 'src/views/offer/NewOffers';
import EditOffersView from 'src/views/offer/EditOffers';
import SlotBookingStatusView from 'src/views/slotBooking/slotStatus';

const routes = (accessToken,isIDProofVerified)=> [
  {
    path: 'app',
    element: !accessToken ? <Navigate to="/" /> : <DashboardLayout />,
    children: [
      { path: 'Profile', element: <AccountView /> },
     // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: isIDProofVerified ? <DashboardView /> : <Navigate to="/app/Profile" /> },
      { path: 'stores', element: isIDProofVerified ? <StoreListView /> : <Navigate to="/app/Profile" />},
      { path: 'stores/addstore', element: isIDProofVerified ? <AddStoreView /> : <Navigate to="/app/Profile" />},
      { path: 'store/details', element: isIDProofVerified ? <StoreDetailView /> : <Navigate to="/app/Profile" />},
      { path: 'store/edit', element: isIDProofVerified ? <StoreEditView /> : <Navigate to="/app/Profile" />},
      { path: 'offers', element: isIDProofVerified ? <OffersListView /> : <Navigate to="/app/Profile" />},
      { path: 'offers/addoffer', element: isIDProofVerified ? <AddOffersView /> : <Navigate to="/app/Profile" />},
      { path: 'offers/offerdetail', element: isIDProofVerified ? <OfferDetailsView /> : <Navigate to="/app/Profile" />},
      { path: 'offer/editoffer', element: isIDProofVerified ? <EditOffersView /> : <Navigate to="/app/Profile" />},
      { path: 'banner_images', element: isIDProofVerified ? <BannerImageView /> : <Navigate to="/app/Profile" />},
      { path: 'banner_slot_booking/:type', element: isIDProofVerified ? <SlotBookingView /> : <Navigate to="/app/Profile" />},
      { path: 'offer_slot_booking/:type', element: isIDProofVerified ? <OfferSlotBookingView /> : <Navigate to="/app/Profile" />},
      { path: 'slot_booking/next', element: isIDProofVerified ? <SlotBookingFinalView /> : <Navigate to="/app/Profile" />},
      { path: 'slot_history', element: isIDProofVerified ? <SlotHistoryView /> : <Navigate to="/app/Profile" />},
      { path: 'slot-booking-status/:type/:orderID', element: isIDProofVerified ? <SlotBookingStatusView /> : <Navigate to="/app/Profile" />},
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
