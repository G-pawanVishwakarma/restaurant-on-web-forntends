import { useMemo } from 'react';
import { filter } from 'lodash';
import { Chance } from 'chance';
import useSWR, { mutate } from 'swr';

// types
import { Address, CartCheckoutStateProps, PaymentCardProps } from 'types/cart';

const chance = new Chance();
const LOCAL_STORAGE = 'able-pro-material-next-ts';

export const endpoints = {
  key: 'cart'
};

const initialState: CartCheckoutStateProps = {
  step: 0,
  Payments: [],
  subtotal: 0,
  total: 0,
  discount: 0,
  shipping: 0,
  billing: null,
  payment: {
    type: 'free',
    method: 'card',
    card: ''
  }
};

export function useGetCart() {
  const localPayments = localStorage.getItem(LOCAL_STORAGE);

  // to update local state based on key
  const { data, isLoading } = useSWR(
    endpoints.key,
    () => (localPayments ? (JSON.parse(localPayments) as CartCheckoutStateProps) : initialState),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      onSuccess(data) {
        localStorage.setItem(LOCAL_STORAGE, JSON.stringify(data));
      }
    }
  );

  const memoizedValue = useMemo(() => ({ cart: data!, cartLoading: isLoading }), [data, isLoading]);

  return memoizedValue;
}

export function addToCart(Payment: PaymentCardProps, Payments: PaymentCardProps[]) {
  // to update local state based on key
  let inCartPayment: PaymentCardProps[];
  let newPayment: PaymentCardProps;
  let subtotal: number = 0;
  let latestPayments: PaymentCardProps[];

  newPayment = { ...Payment, itemId: chance.timestamp() };
  subtotal = newPayment.quantity * newPayment.offerPrice!;

  inCartPayment = filter(Payments, {
    id: newPayment.id,
    color: newPayment.color,
    size: newPayment.size
  });
  if (inCartPayment && inCartPayment.length > 0) {
    const newPayments = Payments.map((item) => {
      if (newPayment.id === item.id && newPayment.color === item.color && newPayment.size === item.size) {
        return { ...newPayment, quantity: newPayment.quantity + inCartPayment[0].quantity };
      }
      return item;
    });
    latestPayments = newPayments;
  } else {
    latestPayments = [...Payments, newPayment];
  }

  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        Payments: latestPayments,
        subtotal: currentCart.subtotal + subtotal,
        total: currentCart.total + subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function updateCartPayment(id: string | number, quantity: number, Payments: PaymentCardProps[]) {
  // to update local state based on key
  let newPayment: PaymentCardProps;
  let subtotal: number = 0;
  let oldSubTotal: number = 0;
  let latestPayments: PaymentCardProps[];

  newPayment = filter(Payments, { itemId: id })[0];

  subtotal = quantity * newPayment.offerPrice!;
  oldSubTotal = 0;

  latestPayments = Payments.map((item) => {
    if (id === item.itemId) {
      oldSubTotal = item.quantity * (item.offerPrice || 0);
      return { ...item, quantity };
    }
    return item;
  });

  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        Payments: latestPayments,
        subtotal: currentCart.subtotal - oldSubTotal + subtotal,
        total: currentCart.total - oldSubTotal + subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function removeCartPayment(id: string | number, Payments: PaymentCardProps[]) {
  // to update local state based on key
  let newPayment: PaymentCardProps;
  let subtotal: number = 0;
  let latestPayments: PaymentCardProps[];

  newPayment = filter(Payments, { itemId: id })[0];

  subtotal = newPayment.quantity * newPayment.offerPrice!;
  latestPayments = filter(Payments, (item) => item.itemId !== id);

  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        Payments: latestPayments,
        subtotal: currentCart.subtotal - subtotal,
        total: currentCart.total - subtotal
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setCheckoutStep(step: number) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        step
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setNextStep() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        step: currentCart.step + 1
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setBackStep() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        step: currentCart.step - 1
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setBillingAddress(billing: Address | null) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        billing
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setCartDiscount(code: string, total: number) {
  // to update local state based on key
  let amount = 0;
  if (total > 0) {
    switch (code) {
      case 'BERRY50':
        amount = chance.integer({ min: 1, max: total < 49 ? total : 49 });
        break;
      case 'FLAT05':
        amount = total < 5 ? total : 5;
        break;
      case 'SUB150':
        amount = total < 150 ? total : 150;
        break;
      case 'UPTO200':
        amount = chance.integer({ min: 1, max: total < 199 ? total : 199 });
        break;
      default:
        amount = 0;
    }
  }

  let difference = 0;

  mutate(
    endpoints.key,
    (currentCart: any) => {
      if (currentCart.discount > 0) {
        difference = currentCart.discount;
      }

      const newCart = {
        ...currentCart,
        discount: amount,
        total: currentCart.total + difference - amount
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setShippingCharge(charge: string, shipping: number) {
  // to update local state based on key
  let newShipping = 0;
  if (shipping > 0 && charge === 'free') {
    newShipping = -5;
  }
  if (charge === 'fast') {
    newShipping = 5;
  }

  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = {
        ...currentCart,
        shipping,
        total: currentCart.total + newShipping,
        payment: {
          ...currentCart.payment,
          type: charge
        }
      };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setPaymentMethod(method: string) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = { ...currentCart, payment: { ...currentCart.payment, method } };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function setPaymentCard(card: string) {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      const newCart = { ...currentCart, payment: { ...currentCart.payment, card } };

      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(newCart));
      return newCart;
    },
    false
  );
}

export function resetCart() {
  // to update local state based on key
  mutate(
    endpoints.key,
    (currentCart: any) => {
      localStorage.setItem(LOCAL_STORAGE, JSON.stringify(initialState));
      return initialState;
    },
    false
  );
}
