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

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'Profile', element: <AccountView /> },
     // { path: 'customers', element: <CustomerListView /> },
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'stores', element: <StoreListView /> },
      { path: 'stores/addstore', element: <AddStoreView /> },
      { path: 'store/details', element: <StoreDetailView /> },
      { path: 'store/edit', element: <StoreEditView /> },
     // { path: 'settings', element: <SettingsView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <LoginView /> },
      { path: 'register', element: <RegisterView /> },
      { path: '404', element: <NotFoundView /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
