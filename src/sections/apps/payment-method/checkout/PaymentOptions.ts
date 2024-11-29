// PROJECT IMPORTS
import { PaymentOptionsProps } from 'types/payment-method';

// ASSETS
const paypal = '/assets/images/payment-method/paypal.png';
const card = '/assets/images/payment-method/card.png';

// ==============================|| CHECKOUT - PAYMENT OPTIONS ||============================== //

const PaymentOptions: PaymentOptionsProps[] = [
  {
    id: 2,
    value: 'card',
    title: 'Credit Card',
    caption: '10% off with master card',
    image: card,
    size: {
      width: 72,
      height: 24
    }
  },
  {
    id: 1,
    value: 'paypal',
    title: 'Pay with PayPal',
    caption: '5% off on first payment',
    image: paypal,
    size: {
      width: 50,
      height: 14
    }
  },
  {
    id: 3,
    value: 'cod',
    title: 'Cash on Delivery',
    caption: 'When you use this payment',
    size: {
      width: 46,
      height: 28
    }
  }
];

export default PaymentOptions;