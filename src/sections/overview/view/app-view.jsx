import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { faker } from '@faker-js/faker';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

import AppTasks from '../app-tasks';
import AppNewsUpdate from '../app-news-update';
import AppOrderTimeline from '../app-order-timeline';
import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import AppTrafficBySite from '../app-traffic-by-site';
import AppCurrentSubject from '../app-current-subject';
import AppConversionRates from '../app-conversion-rates';

import { API_BASE_URL } from '../../../../config';

// ----------------------------------------------------------------------

export default function AppView() {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setQuotations(data);
      } else {
        console.error('Failed to fetch quotations');
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  // Count quotations with status "Fully Invoice"
  const countFullyInvoicedQuotations = () => quotations.filter(quotation => quotation.status === 'Fully Invoice').length;

    // Count quotations with status "Fully Invoice"
    const countQuotationQuotations = () => quotations.filter(quotation => quotation.status === 'Quotation').length;

  // Count quotations with status "Fully Invoice" for each month
  const countFullyInvoicedQuotationsByMonth = () => {
    const monthlyCounts = Array(12).fill(0);

    quotations.forEach(quotation => {
      const month = new Date(quotation.createdAt).getMonth();
      if (quotation.status === 'Fully Invoice') {
        monthlyCounts[month] += 1;
      }
    });

    return monthlyCounts;
  };

  const fullyInvoicedQuotationsByMonth = countFullyInvoicedQuotationsByMonth();


  // Count quotations with status "Fully Invoice" for each month
  const countCancelledQuotationsByMonth = () => {
    const monthlyCounts = Array(12).fill(0);

    quotations.forEach(quotation => {
      const month = new Date(quotation.createdAt).getMonth();
      if (quotation.status === 'Cancelled') {
        monthlyCounts[month] += 1;
      }
    });

    return monthlyCounts;
  };

  const cancelledQuotationsByMonth = countCancelledQuotationsByMonth();

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="New Users"
            total={1352831}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title="Item Orders"
            total={countFullyInvoicedQuotations()}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={6}>
          <AppWidgetSummary
            title="Quotation Needs To Be Confirmed"
            total={countQuotationQuotations()}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Spend Under Managerment"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
              ],
              series: [
                {
                  name: 'Rejected',
                  type: 'area',
                  fill: 'gradient',
                  data: cancelledQuotationsByMonth,
                },
                {
                  name: 'Ordered',
                  type: 'area',
                  fill: 'gradient',
                  data: fullyInvoicedQuotationsByMonth,
                },

              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title="Current Visits"
            chart={{
              series: [
                { label: 'America', value: 4344 },
                { label: 'Asia', value: 5435 },
                { label: 'Europe', value: 1443 },
                { label: 'Africa', value: 4443 },
              ],
            }}
          />
        </Grid>      
      </Grid>
    </Container>
  );
}
