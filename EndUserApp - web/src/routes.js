import React from 'react';
import { Navigate } from 'react-router-dom';
import MainLayout from 'src/layouts/MainLayout';
import DashboardView from 'src/views/reports/DashboardView';
import OffersView from 'src/views/offers';
import StoreOffersView from 'src/views/storeOffers';
import SearchStoreView from 'src/views/SearchStoreView';
import LoginView from 'src/views/auth/LoginView';
import NotFoundView from 'src/views/errors/NotFoundView';
import RegisterView from 'src/views/auth/RegisterView';
import VerificationView from 'src/views/auth/VerificationView';
import UpdatePasswordView from 'src/views/auth/UpdatePasswordView';


const routes = [
  // {
  //   path: 'app',
  //   element: <DashboardLayout />,
  //   children: [
  //     { path: 'account', element: <AccountView /> },
  //     { path: 'customers', element: <CustomerListView /> },
  //     { path: 'dashboard', element: <DashboardView /> },
  //     { path: 'products', element: <ProductListView /> },
  //     { path: 'settings', element: <SettingsView /> },
  //     { path: '*', element: <Navigate to="/404" /> }
  //   ]
  // },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/login', element: <LoginView /> },
      { path: '/', element: <DashboardView /> },
      { path: '/offers/:type', element: <OffersView key="category" /> },
      { path: '/offers/:type/:category', element: <OffersView key="subcategory"/> },
      { path: '/store/:storeID/:offerID', element: <StoreOffersView key="storeAndOffersData"/> },
      { path: '/store/:storeID', element: <StoreOffersView key="storeData"/> },
      { path: '/searchstore/:storeID', element: <SearchStoreView /> },
      { path: 'user/verify/:token/:userid', element: <VerificationView /> },
      { path: 'user/updatepassword/:token/:email', element: <UpdatePasswordView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
