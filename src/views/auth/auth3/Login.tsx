/* eslint-disable no-console */
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
import useUser from 'hooks/useUser';
import AuthCard from 'sections/auth/AuthCard';
import AuthWrapper3 from 'sections/auth/AuthWrapper3';

// ASSETS
import RestaurantLogo from 'components/logo/RestaurantLogo';
import { Home3, User } from 'iconsax-react';
import { useRouter } from 'next/navigation';

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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    CompanyName: '',
    CompanyCode: '',
    Website: '',
    MobileNumber: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();

  const isStepSkipped = (step: number) => skipped.has(step);

  const handleNext = () => {
    // Email validation check
    if (!formData.email) {
      setErrors({ email: 'Email is required' }); // Show error if empty
      return; // Prevent going to next step if email is empty
    }

    // Regular expression for simple email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' }); // Show error if invalid
      return; // Prevent going to next step if invalid email
    }

    // If validation passes, clear the errors
    setErrors({});

    // Handle the step skipping logic
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    // Increment to the next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/.*)?$/;

  // const validateForm = () => {
  //   let validationErrors: { [key: string]: string } = {};
  //   if (!formData.firstName) validationErrors.firstName = 'First name is required';
  //   if (!formData.userName) validationErrors.username = 'user name is required';
  //   if (!formData.lastName) validationErrors.lastName = 'Last name is required';
  //   if (!formData.email) validationErrors.email = 'Email is required';
  //   if (!formData.CompanyCode) validationErrors.CompanyCode = 'Company Code is required';
  //   if (!formData.Website) validationErrors.Website = 'Website is required';
  //   if (!formData.password) validationErrors.password = 'Password is required';
  //   if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = 'Passwords must match';
  //   if (selectedValue === 'Company' && !formData.CompanyName) validationErrors.CompanyName = 'Company name is required';

  //   setErrors(validationErrors);
  //   return Object.keys(validationErrors).length === 0;
  // };
  const validateForm = () => {
    let validationErrors: { [key: string]: string } = {};

    // console.log('Form Data:', formData); // Log form data to check for missing fields

    if (!formData.firstName && selectedValue !== 'Company') validationErrors.firstName = 'First name is required';
    if (!formData.userName && selectedValue !== 'Company') validationErrors.userName = 'User name is required';
    if (!formData.lastName && selectedValue !== 'Company') validationErrors.lastName = 'Last name is required';
    if (!formData.email) validationErrors.email = 'Email is required';
    if (!formData.MobileNumber && selectedValue !== 'Personal') validationErrors.MobileNumber = 'MobileNumber is required';
    if (!formData.CompanyCode && selectedValue !== 'Personal') validationErrors.CompanyCode = 'Company Code is required';
    if (!formData.Website && selectedValue !== 'Personal') validationErrors.Website = 'Website is required';
    if (formData.Website && !urlRegex.test(formData.Website)) {
      validationErrors.Website = 'Please enter a valid URL';
    }
    if (!formData.password && selectedValue !== 'Company') validationErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) validationErrors.confirmPassword = 'Passwords must match';
    if (selectedValue === 'Company' && !formData.CompanyName) validationErrors.CompanyName = 'Company name is required';

    setErrors(validationErrors);
    // console.log('Validation Errors:', validationErrors); // Log validation errors to check why it's failing

    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async () => {
    // console.log(validateForm());
    // console.log(selectedValue);
    // console.log(formData);
    // console.log();
    if (validateForm()) {
      try {
        // Log the request payload for user registration
        if (selectedValue == 'Personal') {
          console.log('User registration data:', {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            password: formData.password,
            username: formData.userName
          });

          // First registration: User registration
          const userResponse = await fetch('http://localhost:1337/api/auth/local/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: formData.email,
              username: formData.userName,
              password: formData.password
            })
          });

          console.log('User registration response:', userResponse);

          if (!userResponse.ok) {
            const userError = await userResponse.json();
            throw new Error(userError?.message || 'User registration failed');
          }
        } else if (selectedValue == 'Company') {
          console.log('Company registration data:', {
            email: formData.email,
            CompanyName: formData.CompanyName,
            CompanyCode: formData.CompanyCode,
            Website: formData.Website,
            MobileNumber: formData.MobileNumber
          });

          const requestData = {
            data: {
              email: formData.email,
              CompanyName: formData.CompanyName,
              CompanyCode: formData.CompanyCode,
              Website: formData.Website,
              MobileNumber: formData.MobileNumber // Add MobileNumber if necessary
            }
          };

          const companyResponse = await fetch('http://localhost:1337/api/companies', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
          });

          console.log('Company registration response:', companyResponse);

          if (!companyResponse.ok) {
            const companyError = await companyResponse.json();
            throw new Error(companyError?.message || 'Company registration failed');
          }
        } else {
          alert('Not able to register');
        }

        // After both registrations are successful, redirect to login page
        router.push('/');
      } catch (error) {
        console.error('Registration error:', error);
        alert('There was an issue with the registration process: ' + error.message);
      }
    }
  };
  // const handleSubmit = async () => {
  //   console.log('Form data on submit:', formData); // Check the actual data submitted
  //   if (validateForm()) {
  //     console.log('Form validation passed');
  //     // Continue the submit logic
  //   } else {
  //     console.log('Form validation failed');
  //   }
  // };

  return (
    <AuthWrapper3>
      <Grid container spacing={3} sx={{ minHeight: '100%', alignContent: 'space-between' }}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <RestaurantLogo />
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
                      <Typography variant="h3">Welcome to the Restaurants on web</Typography>
                      <Typography>Sign up or login with your work email.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email-login">Enter your work email to continue</InputLabel>
                        <OutlinedInput
                          id="email-login"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="Enter email address"
                          fullWidth
                        />
                        {errors.email && <Typography color="error">{errors.email}</Typography>}
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
                          <Radio checked={selectedValue === 'Personal'} onChange={handleChange} value="Personal" name="radio-buttons" />
                          <InputLabel htmlFor="radioPersonal">
                            <User variant="Bulk" size={48} />
                            <Typography variant="h5" sx={{ mt: 1 }}>
                              Personal
                            </Typography>
                          </InputLabel>
                        </Grid>
                        <Grid item sm={6}>
                          <Radio checked={selectedValue === 'Company'} onChange={handleChange} value="Company" name="radio-buttons" />
                          <InputLabel htmlFor="radioCompany">
                            <Home3 variant="Bulk" size={48} />
                            <Typography variant="h5" sx={{ mt: 1 }}>
                              Company
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
                    {selectedValue === 'Personal' && (
                      <>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="first-name">First Name</InputLabel>
                            <OutlinedInput
                              id="first-name"
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="First name"
                              fullWidth
                            />
                            {errors.firstName && <Typography color="error">{errors.firstName}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="last-name">Last Name</InputLabel>
                            <OutlinedInput
                              id="last-name"
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Last name"
                              fullWidth
                            />
                            {errors.lastName && <Typography color="error">{errors.lastName}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="user-name">UserName</InputLabel>
                            <OutlinedInput
                              id="user-name"
                              type="text"
                              name="userName"
                              value={formData.userName}
                              onChange={handleInputChange}
                              placeholder="user name"
                              fullWidth
                            />
                            {errors.userName && <Typography color="error">{errors.userName}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                              id="password"
                              type="password"
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="Password"
                              fullWidth
                            />
                            {errors.password && <Typography color="error">{errors.password}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                            <OutlinedInput
                              id="confirm-password"
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder="Confirm Password"
                              fullWidth
                            />
                            {errors.confirmPassword && <Typography color="error">{errors.confirmPassword}</Typography>}
                          </Stack>
                        </Grid>
                      </>
                    )}
                    {selectedValue === 'Company' && (
                      <>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="company-name">Company Name</InputLabel>
                            <OutlinedInput
                              id="company-name"
                              type="text"
                              name="CompanyName"
                              value={formData.CompanyName}
                              onChange={handleInputChange}
                              placeholder="Company name"
                              fullWidth
                            />
                            {errors.CompanyName && <Typography color="error">{errors.CompanyName}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="company-number">Company Number</InputLabel>
                            <OutlinedInput
                              id="company-number"
                              type="tel"
                              name="MobileNumber"
                              value={formData.MobileNumber}
                              onChange={handleInputChange}
                              placeholder="Company Number"
                              fullWidth
                              inputProps={{ maxLength: 15 }}
                            />
                            {errors.MobileNumber && <Typography color="error">{errors.MobileNumber}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="company-code">Comapny Code</InputLabel>
                            <OutlinedInput
                              id="company-code"
                              type="text"
                              name="CompanyCode"
                              value={formData.CompanyCode}
                              onChange={handleInputChange}
                              placeholder="Company Code"
                              fullWidth
                            />
                            {errors.CompanyCode && <Typography color="error">{errors.CompanyCode}</Typography>}
                          </Stack>
                        </Grid>
                        <Grid item sm={12}>
                          <Stack spacing={1}>
                            <InputLabel htmlFor="company-website">Comapny Website</InputLabel>
                            <OutlinedInput
                              id="company-website"
                              type="url"
                              name="Website"
                              value={formData.Website}
                              onChange={handleInputChange}
                              placeholder="Website"
                              fullWidth
                            />
                            {errors.Website && <Typography color="error">{errors.Website}</Typography>}
                          </Stack>
                        </Grid>
                      </>
                    )}
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
              By signing up, you confirm to have read Restaurants on web
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
