'use client';

import { Key, ReactElement, useEffect, useState } from 'react';

// MATERIAL - UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled, Theme, useTheme } from '@mui/material/styles';

// PROJECT IMPORTS

import SkeletonpaymentPlaceholder from 'components/cards/skeleton/PaymentPlaceholder';

import { resetCart, useGetCart } from 'api/cart';
import { PaymentFilter } from 'api/payments';
import useConfig from 'hooks/useConfig';

// TYPES
import { useGetPayments } from 'api/payments';
import FloatingCart from 'components/cards/payment-method/FloatingCart';

import PaymentsHeader from 'sections/apps/payment-method/payments/PaymentssHeader';
import { PaymentsFilter, Payments as paymentsTypo } from 'types/payment-method';
import PaymentEmpty from 'sections/apps/payment-method/payments/PaymentEmpty';
import PaymentFilterDrawer from 'sections/apps/payment-method/payments/PaymentFilterDrawer';
import PaymentCard from 'sections/apps/payment-method/checkout/PaymentCard';

const drawerWidth = 320;

const Main = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' && prop !== 'container' })(
  ({ theme, open, container }: { theme: Theme; open: boolean; container: any }) => ({
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: -drawerWidth,
    ...(container && {
      [theme.breakpoints.only('lg')]: {
        marginLeft: !open ? -240 : 0
      }
    }),
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 0,
      marginLeft: 0
    },
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter
      }),
      marginLeft: 0
    })
  })
);

// ==============================|| ECOMMERCE - paymentS ||============================== //

const PaymentsPage = () => {
  const theme = useTheme();

  // payment data
  const { PaymentsLoading, Payments } = useGetPayments();

  const { cart } = useGetCart();
  const { container } = useConfig();

  useEffect(() => {
    // clear cart if complete order
    if (cart && cart.step > 2) {
      resetCart();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [openFilterDrawer, setOpenFilterDrawer] = useState(true);
  const handleDrawerOpen = () => {
    setOpenFilterDrawer((prevState) => !prevState);
  };

  // filter
  const initialState: PaymentsFilter = {
    search: '',
    sort: 'low',
    gender: [],
    categories: ['all'],
    colors: [],
    price: '',
    rating: 0
  };
  const [filter, setFilter] = useState(initialState);

  const filterData = () => {
    PaymentFilter(filter);
  };

  useEffect(() => {
    if (!PaymentsLoading) {
      filterData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  let paymentResult: ReactElement | ReactElement[] = [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
    <Grid key={item} item xs={12} sm={6} md={4} lg={4}>
      <SkeletonpaymentPlaceholder />
    </Grid>
  ));
  if (!PaymentsLoading && Payments && Payments.length > 0) {
    paymentResult = Payments.map((payment: paymentsTypo, index: Key | null | undefined) => (
      <Grid key={index} item xs={12} sm={6} md={4}>
        <PaymentCard
          id={payment.id}
          image={payment.image}
          name={payment.name}
          brand={payment.brand}
          offer={payment.offer}
          isStock={payment.isStock}
          description={payment.description}
          offerPrice={payment.offerPrice}
          salePrice={payment.salePrice}
          rating={payment.rating}
          color={payment.colors ? payment.colors[0] : undefined}
          open={openFilterDrawer}
        />
      </Grid>
    ));
  } else if (!PaymentsLoading && Payments && Payments.length === 0) {
    paymentResult = (
      <Grid item xs={12} sx={{ mt: 3 }}>
        <PaymentEmpty handelFilter={() => setFilter(initialState)} />
      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <PaymentFilterDrawer
        filter={filter}
        setFilter={setFilter}
        openFilterDrawer={openFilterDrawer}
        handleDrawerOpen={handleDrawerOpen}
        initialState={initialState}
      />
      <Main theme={theme} open={openFilterDrawer} container={container}>
        <Grid container spacing={2.5}>
          <Grid item xs={12}>
            <PaymentsHeader filter={filter} handleDrawerOpen={handleDrawerOpen} setFilter={setFilter} />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              {paymentResult}
            </Grid>
          </Grid>
        </Grid>
      </Main>
      <FloatingCart />
    </Box>
  );
};

export default PaymentsPage;
