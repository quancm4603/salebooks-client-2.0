import { Helmet } from 'react-helmet-async';
import { EnterEmail } from 'src/sections/login/forget';



// ----------------------------------------------------------------------

export default function ForgetPage() {
  return (
    <>
      <Helmet>
        <title> Forget | Minimal UI </title>
      </Helmet>

      < EnterEmail/>
    </>
  );
}
