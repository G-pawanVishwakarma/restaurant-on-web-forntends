/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// NEXT
import { useRouter } from 'next/navigation';

// MATERIAL - UI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';
import { ChangeEvent, useState } from 'react';

// ==============================|| ECOMMERCE - ADD payment ||============================== //

function AddNewpayment() {
  const router = useRouter();

  // State to hold the payment form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sequence: ''
  });

  // State to handle loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form field changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    const { name, description, sequence } = formData;
    let errorMessage = '';

    // Check if name is empty
    if (!name) {
      errorMessage = 'Name is required.';
    }
    // Check if description is empty
    else if (!description) {
      errorMessage = 'Description is required.';
    }
    // Check if sequence is empty or not a valid number
    else if (!sequence || isNaN(Number(sequence))) {
      errorMessage = 'Sequence must be a valid number.';
    }

    if (errorMessage) {
      setError(errorMessage);
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return; // Skip if validation fails

    setIsLoading(true);
    setError(null);

    try {
      // Replace with your actual Strapi API URL
      const response = await fetch('http://localhost:1337/api/payment-methods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`
        },
        body: JSON.stringify({
          data: {
            name: formData.name,
            description: formData.description,
            sequence: formData.sequence
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add payment');
      }

      // Redirect to payment list page upon success
      router.push('/apps/payment-method/payment-list');
    } catch (err: any) {
      setError(err.message || 'An error occurred while adding the payment');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle cancel action (redirect to payment list)
  const handleCancel = () => {
    router.push('/apps/payment-method/payment-list');
  };

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <MainCard>
            <Grid container spacing={1} direction="column">
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Name</InputLabel>
                <TextField name="name" value={formData.name} onChange={handleChange} placeholder="Enter payment name" fullWidth />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Description</InputLabel>
                <TextField
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter payment description"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel sx={{ mb: 1 }}>Sequence</InputLabel>
                <TextField name="sequence" value={formData.sequence} onChange={handleChange} placeholder="Enter sequence" fullWidth />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <p style={{ color: 'red' }}>{error}</p>
                </Grid>
              )}
              <Grid container direction="column" spacing={2}>
                <Grid item xs={12}>
                  <Stack direction="row" spacing={2} justifyContent="right" alignItems="center" sx={{ mt: 6 }}>
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={handleSubmit} disabled={isLoading}>
                      {isLoading ? 'Adding...' : 'Add New payment'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default AddNewpayment;
