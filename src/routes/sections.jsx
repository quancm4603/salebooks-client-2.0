import { lazy, Suspense, useEffect, useState } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import DashboardLayout from 'src/layouts/dashboard';
import LoginView from 'src/sections/login/login-view';

import { API_BASE_URL } from '../../config';

export const IndexPage = lazy(() => import('src/pages/app'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

export const ForgetPage = lazy(() => import('src/pages/forget'));
export const VerifyPage = lazy(() => import('src/pages/verify-otp'))


// ----------------------------------------------------------------------

export default function Router() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
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
  }, []); // Empty dependency array for initial mount only
  

  const routes = useRoutes([
    {
      element: isAuthenticated ? (
        <DashboardLayout>
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
        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />
    },
    {
      path: 'forget',
      element: <ForgetPage />,
    },
    {
      path: 'verify',
      element: <VerifyPage/>,
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
