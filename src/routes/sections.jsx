import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import LoginView from 'src/sections/login/login-view';
import FirebaseImageUpload from 'src/utils/FirebaseImageUpload';

import { API_BASE_URL } from '../../config';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const CustomerPage = lazy(() => import('src/pages/customer'));

export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'))
export const QuotationsPage = lazy(() => import('src/pages/quotations'));
export const OrdersPage = lazy(() => import('src/pages/orders'));
export const ForgetPage = lazy(() => import('src/pages/forget'));
// ----------------------------------------------------------------------

export default function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accountInfo, setAccountInfo] = useState({}); 
  const updateAuthentication = (value) => {
    setIsAuthenticated(value);
  };

  useEffect(() => {
    console.log('Checking authentication...');
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        console.log(token);
        if (token) {
          console.log('1');
          const response = await fetch(`${API_BASE_URL}/api/account/isLogin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          });
          console.log('2');
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('jwttoken');
            sessionStorage.removeItem('email');
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('jwttoken');
          sessionStorage.removeItem('email');

        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('jwttoken');
        sessionStorage.removeItem('email');
      }
    };
  
    // Check authentication on component mount
    checkAuthentication();
    const getAccountInfo = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        if (token) {
          const response = await fetch(`${API_BASE_URL}/api/account/accountInfo`, {
            headers: {
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setAccountInfo({
              displayName: data.name,
              role: data.role ? 'Admin' : 'User',
              email: data.email,
            });
          } else {
            console.error('Error fetching account info:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching account info:', error.message);
      }
    };
  
    if (isAuthenticated) {
      getAccountInfo();
    }
  }, [isAuthenticated]); // Empty dependency array for initial mount only

    
  

  const routes = useRoutes([
    {
      element: isAuthenticated ? (
        <DashboardLayout accountInfo={accountInfo}>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ) : (
        // Redirect to login if not authenticated
        <Navigate to="/login" replace />
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: 'user', element: <UserPage /> },
        { path: 'customer', element: <CustomerPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
        { path: 'quotations', element: <QuotationsPage /> },
        { path: 'orders', element: <OrdersPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage isAuthenticated={isAuthenticated} updateAuthentication={updateAuthentication}/>
    },
    {
      path: 'forget',
      element: <ForgetPage />,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
    {
      path: '/upload',
      element: <FirebaseImageUpload/>,
    },
  ]);

  return routes;
}