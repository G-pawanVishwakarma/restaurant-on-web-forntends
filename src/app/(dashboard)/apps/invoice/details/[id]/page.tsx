// import { Payments } from 'types/payment-method';
// import axios from 'utils/axios';
import InvoiceDetails from 'views/apps/InvoiceDetails';

// ==============================|| PAGE ||============================== //

type Props = {
  params: {
    id: string;
  };
};

// Multiple versions of this page will be statically generated
// using the `params` returned by `generateStaticParams`
export default function Page({ params }: Props) {
  const { id } = params;

  return <InvoiceDetails id={id} />;
}

// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  // todo: this need to look back again once we implemted SWR
  // const response = await axios.get('/api/Payments/list');

  // return response.data.Payments.map((prod: Payments) => ({
  //   id: prod.id
  // }));

  const response = [1, 2, 3, 5];

  return response.map((prodId: number) => ({
    id: prodId.toString()
  }));
}
