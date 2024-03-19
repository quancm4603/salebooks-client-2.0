import { Helmet } from 'react-helmet-async';

import VerifyOTP from 'src/sections/login/forget/input-verify-otp';

// ----------------------------------------------------------------------

export default function VerifyPage() {
  console.log("cc")
  return (
    <>
      <Helmet>
        <title> Verify | Minimal UI </title>
      </Helmet>

      < VerifyOTP/>
    </>
  );
}
