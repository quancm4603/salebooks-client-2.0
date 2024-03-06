import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

import { LoginView } from 'src/sections/login';


// ----------------------------------------------------------------------

export default function LoginPage({ isAuthenticated, updateAuthentication }) {
  return (
    <>
      <Helmet>
        <title> Login | SaleBooks </title>
      </Helmet>

      <LoginView isAuthenticated = {isAuthenticated} updateAuthentication={updateAuthentication} />
    </>
  );
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  updateAuthentication: PropTypes.func.isRequired,
};