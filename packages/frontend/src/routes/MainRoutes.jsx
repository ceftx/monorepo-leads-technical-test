import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import ProtectedRoute from './ProtectedRoute';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// leads routing
const LeadsList = Loadable(lazy(() => import('views/leads')));

// users routing
const UsersList = Loadable(lazy(() => import('views/users')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <ProtectedRoute>
      <MainLayout />
    </ProtectedRoute>
  ),
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: 'leads',
      element: <LeadsList />
    },
    {
      path: 'users',
      element: (
        <ProtectedRoute requireAdmin>
          <UsersList />
        </ProtectedRoute>
      )
    }
  ]
};

export default MainRoutes;
