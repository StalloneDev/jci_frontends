import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/shared/Layout';
import Dashboard from '@/pages/Dashboard';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

const Members = lazy(() => import('@/pages/Members'));
const Trainings = lazy(() => import('@/pages/Trainings'));
const Commissions = lazy(() => import('@/pages/Commissions'));
const Meetings = lazy(() => import('@/pages/Meetings'));
const Reports = lazy(() => import('@/pages/Reports'));
const Exports = lazy(() => import('@/pages/Exports'));
const VicePresidentsStats = lazy(() => import('@/pages/VicePresidentsStats'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const Login = lazy(() => import('@/pages/Auth/Login'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'members/*',
        element: <Suspense fallback={<div>Loading...</div>}><Members /></Suspense>
      },
      {
        path: 'trainings/*',
        element: <Suspense fallback={<div>Loading...</div>}><Trainings /></Suspense>
      },
      {
        path: 'commissions/*',
        element: <Suspense fallback={<div>Loading...</div>}><Commissions /></Suspense>
      },
      {
        path: 'meetings/*',
        element: <Suspense fallback={<div>Loading...</div>}><Meetings /></Suspense>
      },
      {
        path: 'reports/*',
        element: <Suspense fallback={<div>Loading...</div>}><Reports /></Suspense>
      },
      {
        path: 'exports/*',
        element: <Suspense fallback={<div>Loading...</div>}><Exports /></Suspense>
      },
      {
        path: 'vice-presidents-stats/*',
        element: <Suspense fallback={<div>Loading...</div>}><VicePresidentsStats /></Suspense>
      },
      {
        path: 'profile/*',
        element: <Suspense fallback={<div>Loading...</div>}><Profile /></Suspense>
      },
      {
        path: 'settings/*',
        element: <Suspense fallback={<div>Loading...</div>}><Settings /></Suspense>
      }
    ]
  },
  {
    path: 'login',
    element: <Suspense fallback={<div>Loading...</div>}><Login /></Suspense>
  }
]);
