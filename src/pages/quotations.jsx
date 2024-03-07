import { Helmet } from 'react-helmet-async';

import { QuotationsView } from 'src/sections/quotations/view';

// ----------------------------------------------------------------------

export default function QuotationsPage() {
  return (
    <>
      <Helmet>
        <title> Quotations | SaleBook </title>
      </Helmet>

      <QuotationsView />
    </>
  );
}
