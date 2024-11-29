/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// MATERIAL-UI imports
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import useMediaQuery from '@mui/material/useMediaQuery';

// ICONS
import { Add, Edit, Eye, Trash } from 'iconsax-react';
import { useSession } from 'next-auth/react';

// STRAPI API URL
const STRAPI_API_URL = 'http://localhost:1337/api/payment-methods'; // Update with your Strapi API URL

const PaymentList = () => {
  const { data: session } = useSession();
  // console.log(session, status);
  const [paymentsData, setPaymentsData] = useState<any[]>([]); // Using any type for simplicity
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();

  const getAuthHeader = () => {
    if (session && session.jwt) {
      return { Authorization: `Bearer ${session.jwt}` }; // Include JWT token in header
    }
    return {};
  };

  // Fetch data from Strapi API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(STRAPI_API_URL, {
          headers: getAuthHeader() // Add JWT token to the headers
        });
        setPaymentsData(response.data.data); // Adjust based on your Strapi response structure
        setLoading(false);
      } catch (err) {
        setError('Error fetching payments data');
        setLoading(false);
      }
    };

    fetchPayments();
  }, [session]);

  const handleAddPayment = () => {
    router.push(`/apps/payment-method/add-new-payment`);
  };

  const handleEdit = (paymentId: string) => {
    router.push(`/apps/payment-method/edit/:${paymentId}`);
  };

  const handleView = (paymentId: string) => {
    router.push(`/apps/payment-method/view/:${paymentId}`);
  };

  const handleDelete = async (paymentId: string) => {
    try {
      // Confirm deletion action
      const isConfirmed = window.confirm('Are you sure you want to delete this payment?');
      if (!isConfirmed) return; // If user cancels, do nothing

      // Make an API call to delete the payment
      const response = await axios.delete(`http://localhost:1337/api/payment-methods/:${paymentId}`, {
        headers: getAuthHeader() // Add JWT token to the headers
      });
      console.log('API Response:', response);
      if (response.status === 200) {
        // If deletion is successful, update the state
        setPaymentsData((prevData) => prevData.filter((payment) => payment.id !== paymentId));

        // Optionally, show a success message or notification
        alert('Payment deleted successfully!');
      } else {
        throw new Error('Failed to delete payment');
      }
    } catch (error) {
      alert('There was an error deleting the payment. Please try again later.');
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id'
      },
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Description',
        accessor: 'description'
      },
      {
        Header: 'Sequence',
        accessor: 'sequence'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }: { row: any }) => {
          const paymentId = row.original.id;
          return (
            <Stack direction="row" spacing={1} justifyContent="center">
              <Tooltip title="View">
                <Button color="secondary" onClick={() => handleView(paymentId)}>
                  <Eye />
                </Button>
              </Tooltip>
              <Tooltip title="Edit">
                <Button color="primary" onClick={() => handleEdit(paymentId)}>
                  <Edit />
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button color="error" onClick={() => handleDelete(paymentId)}>
                  <Trash />
                </Button>
              </Tooltip>
            </Stack>
          );
        }
      }
    ],
    []
  );

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <Stack spacing={3}>
      {/* Header Section with 'Add Payment' Button */}
      <Stack direction={{ sm: 'row', xs: 'column' }} justifyContent="space-between" spacing={1} alignItems="center" sx={{ p: 3, pb: 0 }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddPayment} size="large">
          Add Payment
        </Button>
      </Stack>

      {/* Table Section */}
      <Table sx={{ width: '100%' }}>
        <TableHead>
          <TableRow sx={{ '& > th:first-of-type': { width: '58px' } }}>
            {columns.map((column, index) => (
              <TableCell key={index}>{column.Header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {paymentsData.map((payment, i) => (
            <TableRow key={i}>
              <TableCell>{payment.id}</TableCell>
              <TableCell>{payment.name}</TableCell>
              <TableCell>{payment.description}</TableCell>
              <TableCell>{payment.sequence}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Tooltip title="View">
                    <Button color="secondary" onClick={() => handleView(payment.id)}>
                      <Eye />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <Button color="primary" onClick={() => handleEdit(payment.id)}>
                      <Edit />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button color="error" onClick={() => handleDelete(payment.id)}>
                      <Trash />
                    </Button>
                  </Tooltip>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Stack>
  );
};

export default PaymentList;
