import { Helmet } from 'react-helmet-async';

import { QuotationsView } from 'src/sections/orders/view';

// ----------------------------------------------------------------------

export default function OrdersPage() {
  return (
    <>
      <Helmet>
        <title> Orders | SaleBook </title>
      </Helmet>

      <QuotationsView />
    </>
  );
}
