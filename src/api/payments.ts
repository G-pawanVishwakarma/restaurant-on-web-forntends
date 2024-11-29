import { useMemo } from 'react';

// THIRD_PARTY
import useSWR, { mutate } from 'swr';

// PROJECT_IMPORTS
import axios, { fetcher, fetcherPost } from 'utils/axios';

// TYPES
import { Payments, PaymentsFilter, Reviews } from 'types/payment-method';

export const endpoints = {
  key: 'api/payment-methods',
  list: 'api/payment-methods', // server URL
  filter: '/filter', // server URL
  related: 'api/Payment/related', // server URL
  review: 'api/review/list' // server URL
};

export function useGetPayments() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.key + endpoints.list, fetcher, {
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  const memoizedValue = useMemo(
    () => ({
      Payments: data?.Payments as Payments[],
      PaymentsLoading: isLoading,
      PaymentsError: error,
      PaymentsValidating: isValidating,
      PaymentsEmpty: !isLoading && !data?.Payments?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function PaymentFilter(filter: PaymentsFilter) {
  const newPayments = await axios.post(endpoints.key + endpoints.filter, { filter });

  // to update local state based on key
  mutate(
    endpoints.key + endpoints.list,
    (currentPayments: any) => {
      return {
        ...currentPayments,
        Payments: newPayments.data
      };
    },
    false
  );
}

export function useGetReleatedPayments(id: string) {
  const URL = [endpoints.related, { id, endpoints: 'Payments' }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcherPost, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      relatedPayments: data as Payments[],
      relatedPaymentsLoading: isLoading,
      relatedPaymentsError: error,
      relatedPaymentsValidating: isValidating,
      relatedPaymentsEmpty: !isLoading && !data?.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetPaymentReviews() {
  const { data, isLoading, error, isValidating } = useSWR(endpoints.review, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      PaymentReviews: data?.PaymentReviews as Reviews[],
      PaymentReviewsLoading: isLoading,
      PaymentReviewsError: error,
      PaymentReviewsValidating: isValidating,
      PaymentReviewsEmpty: !isLoading && !data?.PaymentReviews.length
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
