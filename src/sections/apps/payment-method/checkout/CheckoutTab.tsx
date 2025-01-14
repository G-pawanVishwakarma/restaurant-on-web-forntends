import { useEffect, useState, ReactNode } from 'react';

// MATIRIAL-UI
import { styled, Theme, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// PROJECT IMPORT
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import BillingAddress from 'sections/apps/payment-method/checkout/BillingAddress';
import Cart from 'sections/apps/payment-method/checkout/Cart';
import CartEmpty from 'sections/apps/payment-method/checkout/CartEmpty';
import Payment from 'sections/apps/payment-method/checkout/Payment';

import { updateAddress } from 'api/address';
import { openSnackbar } from 'api/snackbar';
import {
  removeCartpayment,
  setBackStep,
  setBillingAddress,
  setCheckoutStep,
  setNextStep,
  setShippingCharge,
  updateCartpayment
} from 'api/cart';

// TYPES
import { SnackbarProps } from 'types/snackbar';
import { CartCheckoutStateProps } from 'types/cart';
import { Address, TabsProps } from 'types/payment-method';

// ASSETS
import { TickCircle } from 'iconsax-react';

interface StyledProps {
  theme: Theme;
  value: number;
  cart: CartCheckoutStateProps;
  disabled?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
}

interface TabOptionProps {
  label: string;
}

const StyledTab = styled((props) => <Tab {...props} />)(({ theme, value, cart, ...others }: StyledProps) => ({
  minHeight: 'auto',
  minWidth: 250,
  padding: 16,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  textAlign: 'left',
  justifyContent: 'flex-start',
  '&:after': {
    backgroundColor: 'transparent !important'
  },

  '& > svg': {
    marginBottom: '0px !important',
    marginRight: 10,
    marginTop: 2,
    height: 20,
    width: 20
  },
  [theme.breakpoints.down('md')]: {
    minWidth: 'auto'
  }
}));

// tabs option
const tabsOption: TabOptionProps[] = [
  {
    label: 'Cart'
  },
  {
    label: 'Shipping Information'
  },
  {
    label: 'Payment'
  }
];

// tabs
function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

// ==============================|| payment - CHECKOUT MAIN ||============================== //

const CheckoutTab = ({ cart }: { cart: CartCheckoutStateProps }) => {
  const theme = useTheme();

  const isCart = cart.payments && cart.payments.length > 0;

  const [value, setValue] = useState(cart.step > 2 ? 2 : cart.step);
  const [billing, setBilling] = useState(cart.billing);

  const editBillingAddress = (addressEdit: Address) => {
    updateAddress(addressEdit.id, addressEdit).then(() => setBillingAddress(addressEdit));
  };

  const handleChange = (newValue: number) => {
    setValue(newValue);
    setCheckoutStep(newValue);
  };

  useEffect(() => {
    setValue(cart.step > 2 ? 2 : cart.step);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.step]);

  const removepayment = (id: string | number | undefined) => {
    removeCartpayment(id!, cart.payments);
    openSnackbar({
      open: true,
      message: 'Update Cart Success',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    } as SnackbarProps);
  };

  const updateQuantity = (id: string | number | undefined, quantity: number) => {
    updateCartpayment(id!, quantity, cart.payments);
  };

  const onNext = () => {
    setNextStep();
  };

  const onBack = () => {
    setBackStep();
  };

  const billingAddressHandler = (addressBilling: Address | null) => {
    if (billing !== null || addressBilling !== null) {
      if (addressBilling !== null) {
        setBilling(addressBilling);
      }

      setBillingAddress(addressBilling !== null ? addressBilling : billing);
      onNext();
    } else {
      openSnackbar({
        open: true,
        message: 'Please select delivery address',
        variant: 'alert',
        alert: {
          color: 'error'
        }
      } as SnackbarProps);
    }
  };

  const handleShippingCharge = (type: string) => {
    setShippingCharge(type, cart.shipping);
  };

  return (
    <Stack spacing={2}>
      <MainCard content={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Tabs
              value={value}
              onChange={(e, newValue) => handleChange(newValue)}
              aria-label="icon label tabs example"
              variant="scrollable"
              sx={{
                '& .MuiTabs-flexContainer': {
                  borderBottom: 'none'
                },
                '& .MuiTabs-indicator': {
                  display: 'none'
                },
                '& .MuiButtonBase-root + .MuiButtonBase-root': {
                  position: 'relative',
                  overflow: 'visible',
                  ml: 2,
                  '&:after': {
                    content: '""',
                    bgcolor: '#ccc',
                    width: 1,
                    height: 'calc(100% - 16px)',
                    position: 'absolute',
                    top: 8,
                    left: -8
                  }
                }
              }}
            >
              {tabsOption.map((tab, index) => (
                <StyledTab
                  theme={theme}
                  value={index}
                  cart={cart}
                  disabled={index > cart.step}
                  key={index}
                  label={
                    <Grid container>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar
                          type={index !== cart.step ? 'combined' : 'filled'}
                          size="xs"
                          color={index > cart.step ? 'secondary' : 'primary'}
                        >
                          {index === cart.step ? index + 1 : <TickCircle />}
                        </Avatar>
                        <Typography color={index > cart.step ? 'textSecondary' : 'inherit'}>{tab.label}</Typography>
                      </Stack>
                    </Grid>
                  }
                />
              ))}
            </Tabs>
          </Grid>
        </Grid>
      </MainCard>
      <Grid container>
        <Grid item xs={12}>
          <TabPanel value={value} index={0}>
            {isCart && <Cart checkout={cart} onNext={onNext} removepayment={removepayment} updateQuantity={updateQuantity} />}
            {!isCart && <CartEmpty />}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BillingAddress checkout={cart} onBack={onBack} removepayment={removepayment} billingAddressHandler={billingAddressHandler} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Payment
              checkout={cart}
              onBack={onBack}
              onNext={onNext}
              handleShippingCharge={handleShippingCharge}
              removepayment={removepayment}
              editAddress={editBillingAddress}
            />
          </TabPanel>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default CheckoutTab;
