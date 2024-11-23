'use client';

import { SyntheticEvent, useState } from 'react';

// NEXT
import Link from 'next/link';
// Import useRouter for navigation

// MATERIAL - UI
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Links from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Formik } from 'formik';
import * as Yup from 'yup';

import AnimateButton from 'components/@extended/AnimateButton';
import IconButton from 'components/@extended/IconButton';
import useScriptRef from 'hooks/useScriptRef';
import { fetcher } from 'utils/axios';

// ASSETS
import { Eye, EyeSlash } from 'iconsax-react';
import { useRouter } from 'next/navigation';

// ============================|| JWT - LOGIN ||============================ //

const AuthLogin = ({ providers, csrfToken }: any) => {
  const scriptedRef = useScriptRef();
  const router = useRouter(); // Initialize useRouter for navigation
  const [checked, setChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null); // Track error messages

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        submit: ''
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          setSubmitting(true); // Ensure the submitting state is set to true on submit

          // Sending POST request to login API
          const response = await fetcher('api/auth/local', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              identifier: values.email,
              password: values.password
            })
          });

          if (response?.jwt) {
            // Handle successful login
            localStorage.setItem('jwt', response.jwt); // Save JWT token
            setSubmitting(false);
            if (scriptedRef.current) {
              // Use next/router's push to navigate to dashboard
              router.push('/dashboard/default'); // Redirect to dashboard page
            }
          } else {
            // Handle login failure (invalid credentials)
            setLoginError('Invalid credentials'); // Show custom error message
            setStatus({ success: false });
            setSubmitting(false);
          }
        } catch (err: any) {
          setSubmitting(false);
          if (scriptedRef.current) {
            setErrors({ submit: 'Something went wrong' });
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="email-login">Email Address</InputLabel>
                <OutlinedInput
                  id="email-login"
                  type="email"
                  value={values.email}
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  fullWidth
                  error={Boolean(touched.email && errors.email)}
                />
                {touched.email && errors.email && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.email}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack spacing={1}>
                <InputLabel htmlFor="password-login">Password</InputLabel>
                <OutlinedInput
                  fullWidth
                  error={Boolean(touched.password && errors.password)}
                  id="password-login"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        color="secondary"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </IconButton>
                    </InputAdornment>
                  }
                  placeholder="Enter password"
                />
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12} sx={{ mt: -1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(event) => setChecked(event.target.checked)}
                      name="checked"
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="h6">Keep me signed in</Typography>}
                />
                <Links variant="h6" component={Link} href="/forgot-password" color="text.primary">
                  Forgot Password?
                </Links>
              </Stack>
            </Grid>
            {loginError && (
              <Grid item xs={12}>
                <FormHelperText error>{loginError}</FormHelperText>
              </Grid>
            )}
            {errors.submit && (
              <Grid item xs={12}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Grid>
            )}
            <Grid item xs={12}>
              <AnimateButton>
                <Button disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                  Login
                </Button>
              </AnimateButton>
            </Grid>
          </Grid>
        </form>
      )}
    </Formik>
  );
};

export default AuthLogin;
