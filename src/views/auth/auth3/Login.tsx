'use client';

import { ReactNode, useState } from 'react';

// NEXT
import Link from 'next/link';

// MATERIAL-UI
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// PROJECT IMPORTS
import Logo from 'components/logo';
import useUser from 'hooks/useUser';
import AuthCard from 'sections/auth/AuthCard';
import AuthWrapper3 from 'sections/auth/AuthWrapper3';

// ASSETS
import { Home3, User } from 'iconsax-react';
import { useRouter } from 'next/navigation';
import { fetcherPost } from 'utils/axios';

// TYPES

const steps = ['1', '2', '3', '4'];

interface StepWrapperProps {
  children?: ReactNode;
  index: number;
  value: number;
}

function StepWrapper({ children, value, index, ...other }: StepWrapperProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Login3Page = () => {
  const theme = useTheme();
  const user = useUser();
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());
  const [selectedValue, setSelectedValue] = useState('Personal');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async () => {
    // Prepare data for the API calls
    const userData = {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      companyType: selectedValue
    };

    const companyData = {
      email,
      firstName,
      lastName,
      password,
      confirmPassword,
      companyType: selectedValue
    };

    try {
      // Call the User Registration API
      const userResponse = await fetcherPost('api/auth/local/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: userData.password
        })
      });

      if (!userResponse.ok) {
        throw new Error('User registration failed');
      }

      // Call the Company Registration API
      const companyResponse = await fetcherPost('/api/company/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: companyData.email,
          firstName: companyData.firstName,
          lastName: companyData.lastName,
          password: companyData.password
        })
      });

      if (!companyResponse.ok) {
        throw new Error('Company registration failed');
      }

      // After both API calls succeed, redirect to the login page
      router.push('/login');
    } catch (error) {
      alert('There was an issue with the registration process. Please try again.');
    }
  };

  return (
    <AuthWrapper3>
      <Grid container spacing={3} sx={{ minHeight: '100%', alignContent: 'space-between' }}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Logo />
            <Typography variant="h5" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
              Step
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: theme.palette.text.primary, display: 'inline-block', margin: '0 5px' }}
              >
                {activeStep + 1}
              </Typography>
              to {steps.length}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ '& > div': { margin: '24px auto' } }}>
          <AuthCard border={false}>
            {activeStep === steps.length ? (
              <>
                <Alert sx={{ my: 3 }}>All steps completed - you can now Login</Alert>
                <Button component={Link} href={user ? '/' : '/'} color="primary" variant="contained" fullWidth>
                  Login
                </Button>
              </>
            ) : (
              <>
                {/* Step 1: Email Entry */}
                <StepWrapper value={activeStep} index={0}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Typography variant="h3">Welcome to the Able Pro</Typography>
                      <Typography>Sign up or login with your work email.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email-login">Enter your work email to continue</InputLabel>
                        <OutlinedInput
                          id="email-login"
                          type="email"
                          name="email"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Enter email address"
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handleNext} variant="contained" color="primary" fullWidth>
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </StepWrapper>

                {/* Step 2: Company Type Selection */}
                <StepWrapper value={activeStep} index={1}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Typography variant="h3">What’s your purpose for use Able?</Typography>
                      <Typography>Your setup experience will be streamlined accordingly</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item sm={6}>
                          <Radio
                            id="radioPersonal"
                            checked={selectedValue === 'Personal'}
                            onChange={handleChange}
                            value="Personal"
                            name="radio-buttons"
                          />
                          <InputLabel htmlFor="radioPersonal">
                            <User variant="Bulk" size={48} />
                            <Typography variant="h5" sx={{ mt: 1 }}>
                              Personal
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item sm={6}>
                          <Radio
                            id="radioBusiness"
                            checked={selectedValue === 'Business'}
                            onChange={handleChange}
                            value="Business"
                            name="radio-buttons"
                          />
                          <InputLabel htmlFor="radioBusiness">
                            <Home3 variant="Bulk" size={48} />
                            <Typography variant="h5" sx={{ mt: 1 }}>
                              Business
                            </Typography>
                          </InputLabel>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handleNext} variant="contained" color="primary" fullWidth>
                        Continue
                      </Button>
                    </Grid>
                  </Grid>
                </StepWrapper>

                {/* Step 3: User Details */}
                <StepWrapper value={activeStep} index={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sx={{ textAlign: 'center' }}>
                      <Typography variant="h3">Tell us about yourself</Typography>
                      <Typography>Provide your personal details</Typography>
                    </Grid>
                    <Grid item sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="first-name">First Name</InputLabel>
                        <OutlinedInput
                          id="first-name"
                          type="text"
                          value={firstName}
                          onChange={handleFirstNameChange}
                          placeholder="First name"
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    <Grid item sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="last-name">Last Name</InputLabel>
                        <OutlinedInput
                          id="last-name"
                          type="text"
                          value={lastName}
                          onChange={handleLastNameChange}
                          placeholder="Last name"
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    <Grid item sm={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <OutlinedInput
                          id="password"
                          type="password"
                          value={password}
                          onChange={handlePasswordChange}
                          placeholder="Password"
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    <Grid item sm={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                        <OutlinedInput
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          placeholder="Confirm Password"
                          fullWidth
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12}>
                      <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </StepWrapper>
              </>
            )}
          </AuthCard>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography align="center">
              By signing up, you confirm to have read Able pro
              <Typography component={Link} href={'#'} sx={{ textDecoration: 'none', px: 0.5 }} color="primary">
                Privacy Policy
              </Typography>
              and agree to the
              <Typography component={Link} href={'#'} sx={{ textDecoration: 'none', pl: 0.5 }} color="primary">
                Terms of Service
              </Typography>
              .
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper3>
  );
};

export default Login3Page;
