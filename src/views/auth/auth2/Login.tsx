'use client';

// NEXT
import Link from 'next/link';

// MATERIAL - UI
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// PROJECT IMPORTS
import useUser from 'hooks/useUser';
import AuthWrapper2 from 'sections/auth/AuthWrapper2';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';
import RestaurantLogo from 'components/logo/RestaurantLogo';

// ================================|| LOGIN ||================================ //

const Login2Page = () => {
  const user = useUser();
  return (
    <AuthWrapper2>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <RestaurantLogo />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography
              component={Link}
              href={user ? '/auth/login3' : '/auth/login3'}
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin forgot="/auth/forgot-password2" />
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
};

export default Login2Page;
