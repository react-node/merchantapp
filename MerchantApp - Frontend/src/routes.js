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
import AdminDashboardView from 'src/views/admin/dashboard';
import AdminUserManagementView from 'src/views/admin/userManagement';
import CreateAdminUserView from 'src/views/admin/userManagement/newUser';
import EditAdminUserView from 'src/views/admin/userManagement/newUser';
import MerchantUsersView from 'src/views/admin/merchantUsers/list';
import MerchantStoresView from 'src/views/admin/merchantStores/list';
import MerchantBannersView from 'src/views/admin/merchantBanners/list';
import MerchantStoresBannerInfoView from 'src/views/admin/merchantBanners/info';
import MerchantUsersInfoView from 'src/views/admin/merchantUsers/info';
import MerchantStoresInfoView from 'src/views/admin/merchantStores/info';
import MerchantStoresImageView from 'src/views/admin/merchantStores/images';

const RedirectProfile = <Navigate to="/app/Profile" />
const RedirectAdmin = <Navigate to="/app/admin/dashboard" />

const routes = (accessToken,isIDProofVerified,userType)=> {
  console.log("userType=======",userType)
  const children =  [
    { path: 'Profile', element:  <AccountView />  },
   // { path: 'customers', element: <CustomerListView /> },
    { path: 'dashboard', element: userType===3 ? (isIDProofVerified ? <DashboardView /> : RedirectProfile) : RedirectAdmin},
    { path: 'stores', element:  userType===3 ? (isIDProofVerified ? <StoreListView /> : RedirectProfile) : RedirectAdmin},
    { path: 'stores/addstore', element:  userType===3 ? (isIDProofVerified ? <AddStoreView /> : RedirectProfile) : RedirectAdmin},
    { path: 'store/details', element: userType===3 ? ( isIDProofVerified ? <StoreDetailView /> : RedirectProfile) : RedirectAdmin},
    { path: 'store/edit', element:  userType===3 ? (isIDProofVerified ? <StoreEditView /> : RedirectProfile) : RedirectAdmin},
    { path: 'offers', element:  userType===3 ? (isIDProofVerified ? <OffersListView /> : RedirectProfile) : RedirectAdmin},
    { path: 'offers/addoffer', element:  userType===3 ? (isIDProofVerified ? <AddOffersView /> : RedirectProfile) : RedirectAdmin},
    { path: 'offers/offerdetail', element:  userType===3 ? (isIDProofVerified ? <OfferDetailsView /> : RedirectProfile) : RedirectAdmin},
    { path: 'offer/editoffer', element:  userType===3 ? (isIDProofVerified ? <EditOffersView /> : RedirectProfile) : RedirectAdmin},
    { path: 'banner_images', element:  userType===3 ? (isIDProofVerified ? <BannerImageView /> : RedirectProfile) : RedirectAdmin},
    { path: 'banner_slot_booking/:type', element:  userType===3 ? (isIDProofVerified ? <SlotBookingView /> : RedirectProfile) : RedirectAdmin},
    { path: 'offer_slot_booking/:type', element:  userType===3 ? (isIDProofVerified ? <OfferSlotBookingView /> : RedirectProfile) : RedirectAdmin},
    { path: 'slot_booking/next', element:  userType===3 ? (isIDProofVerified ? <SlotBookingFinalView /> : RedirectProfile) : RedirectAdmin},
    { path: 'slot_history', element:  userType===3 ? (isIDProofVerified ? <SlotHistoryView /> : RedirectProfile) : RedirectAdmin},
    { path: 'slot-booking-status/:type/:orderID', element:  userType===3 ? (isIDProofVerified ? <SlotBookingStatusView /> : RedirectProfile) : RedirectAdmin},
    // { path: 'settings', element: <SettingsView /> },
    { path: '*', element: <Navigate to="/404" /> }
  ]
  const adminChildren =  [
    
    { path: 'admin/dashboard', element: <AdminDashboardView /> },
    { path: 'admin/users', element: <AdminUserManagementView /> },
    { path: 'admin/users/create', element: <CreateAdminUserView /> },
    { path: 'admin/users/edit/:id', element: <EditAdminUserView /> },
    { path: 'admin/merchant/users', element: <MerchantUsersView /> },
    { path: 'admin/merchant/users/info/:id', element: <MerchantUsersInfoView /> },
    { path: 'admin/merchant/stores', element: <MerchantStoresView type="stores" key="stores" /> },
    { path: 'admin/merchant/storeImages', element: <MerchantStoresView type="storeImages"  key="storeImages"/> },
    { path: 'admin/merchant/storeBanners', element: <MerchantBannersView type="storeBanners"  key="storeBanners"/> },
    { path: 'admin/merchant/stores/info/:storeID', element: <MerchantStoresInfoView /> },
    { path: 'admin/merchant/storeImages/:storeID', element: <MerchantStoresImageView /> },
    { path: 'admin/merchant/storeBanners/:bannerID', element: <MerchantStoresBannerInfoView /> },
    { path: '*', element: <Navigate to="/404" /> }
  ]

  const route = [
    {
      path: 'app',
      element: !accessToken  ? <Navigate to="/" /> : <DashboardLayout />,
      children: userType===3 ? children : adminChildren,
    },
    {
      path: '/',
      element: accessToken ? ( userType ===3 ? <Navigate to="/app/dashboard" /> : <Navigate to="/app/admin/dashboard" /> ) :  <MainLayout />,
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
  return route
}


export default routes;
