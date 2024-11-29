'use client';

import { useEffect, useState, SyntheticEvent, useMemo } from 'react';

// MATERIAL - UI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

// TYPES
import { Payments, TabsProps } from 'types/payment-method';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';
import CircularLoader from 'components/CircularLoader';
import FloatingCart from 'components/cards/payment-method/FloatingCart';
import PaymentFeatures from 'sections/apps/payment-method/payment-details/PaymentFeatures';
import PaymentInfo from 'sections/apps/payment-method/payment-details/PaymentInfo';

import { resetCart, useGetCart } from 'api/cart';
import { handlerActiveItem, useGetMenuMaster } from 'api/menu';
import { useGetPayments } from 'api/payments';
import Relatedpayments from 'sections/apps/payment-method/payment-details/Listpayment';
import PaymentSpecifications from 'sections/apps/payment-method/payment-details/PaymentSpecifications';
import PaymentReviews from 'sections/apps/payment-method/payment-details/PaymentReviews';

function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`Payment-details-tabpanel-${index}`}
      aria-labelledby={`Payment-details-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `Payment-details-tab-${index}`,
    'aria-controls': `Payment-details-tabpanel-${index}`
  };
}

// ==============================|| Payment DETAILS - MAIN ||============================== //

type Props = {
  id: string;
};

const PaymentDetails = ({ id }: Props) => {
  const { menuMaster } = useGetMenuMaster();
  const { PaymentsLoading, Payments } = useGetPayments();
  const [Payment, setPayment] = useState<Payments | null>(null);

  const { cart } = useGetCart();

  useEffect(() => {
    if (menuMaster.openedItem !== 'Payment-details') handlerActiveItem('Payment-details');
    if (id && !PaymentsLoading && Array.isArray(Payments)) {
      setPayment(Payments.filter((item: Payments) => item.id!.toString() === id)[0] || Payments[0]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, PaymentsLoading]);

  // Payment description tabs
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    // clear cart if complete order
    if (cart && cart.step > 2) {
      resetCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const relatedPayments = useMemo(() => <Relatedpayments id={id} />, [id]);

  const loader = (
    <Box sx={{ height: 504 }}>
      <CircularLoader />
    </Box>
  );

  const isLoader = PaymentsLoading || Payment === null;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {isLoader && <MainCard>{loader}</MainCard>}
          {!isLoader && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7} lg={8}>
                <MainCard border={false} sx={{ height: '100%', bgcolor: 'secondary.lighter' }}>
                  <PaymentInfo Payment={Payment} />
                </MainCard>
              </Grid>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} md={7} xl={8}>
          <MainCard>
            <Stack spacing={3}>
              <Stack>
                <Tabs
                  value={value}
                  indicatorColor="primary"
                  onChange={handleChange}
                  aria-label="Payment description tabs example"
                  variant="scrollable"
                >
                  <Tab label="Features" {...a11yProps(0)} />
                  <Tab label="Specifications" {...a11yProps(1)} />
                  <Tab label="Overview" {...a11yProps(2)} />
                  <Tab
                    label={
                      <Stack direction="row" alignItems="center">
                        Reviews{' '}
                        <Chip
                          label={isLoader ? <Skeleton width={30} /> : String(Payment.offerPrice?.toFixed(0))}
                          size="small"
                          sx={{
                            ml: 0.5,
                            color: value === 3 ? 'primary.main' : 'grey.0',
                            bgcolor: value === 3 ? 'primary.lighter' : 'grey.400',
                            borderRadius: '10px'
                          }}
                        />
                      </Stack>
                    }
                    {...a11yProps(3)}
                  />
                </Tabs>
                <Divider />
              </Stack>
              <TabPanel value={value} index={0}>
                <PaymentFeatures />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <PaymentSpecifications />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Stack spacing={2.5}>
                  <Typography color="textSecondary">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard
                    dummy text ever since the 1500s,{' '}
                    <Typography component="span" variant="subtitle1">
                      {' '}
                      &ldquo;When an unknown printer took a galley of type and scrambled it to make a type specimen book.&rdquo;
                    </Typography>{' '}
                    It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                  <Typography color="textSecondary">
                    It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently
                    with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </Typography>
                </Stack>
              </TabPanel>
              <TabPanel value={value} index={3}>
                {!isLoader && <PaymentReviews Payment={Payment} />}
              </TabPanel>
            </Stack>
          </MainCard>
        </Grid>
        <Grid item xs={12} md={5} xl={4} sx={{ position: 'relative' }}>
          <MainCard
            title="Related Payments"
            sx={{
              height: 'calc(100% - 16px)',
              position: { xs: 'relative', md: 'absolute' },
              top: 16,
              left: { xs: 0, md: 16 },
              right: 0
            }}
            content={false}
          >
            {relatedPayments}
          </MainCard>
        </Grid>
      </Grid>

      <FloatingCart />
    </>
  );
};

export default PaymentDetails;
