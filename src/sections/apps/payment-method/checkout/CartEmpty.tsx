// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';

// ASSETS
import { ArrowRight2 } from 'iconsax-react';

// TYPES
import { ThemeMode } from 'types/config';

const imageEmpty = '/assets/images/payment-method/empty.png';
const imageDarkEmpty = '/assets/images/payment-method/empty-dark.png';

// ==============================|| CHECKOUT - EMPTY ||============================== //

const CartEmpty = () => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <MainCard content={false}>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={3}
        sx={{ my: 3, height: { xs: 'auto', md: 'calc(100vh - 240px)' }, p: { xs: 2.5, md: 'auto' } }}
      >
        <Grid item>
          <CardMedia
            component="img"
            image={theme.palette.mode === ThemeMode.DARK ? imageDarkEmpty : imageEmpty}
            title="Cart Empty"
            sx={{ width: { xs: 240, md: 320, lg: 440 } }}
          />
        </Grid>
        <Grid item>
          <Stack spacing={0.5}>
            <Typography variant={matchDownMD ? 'h3' : 'h1'} color="inherit">
              Add items to your cart
            </Typography>
            <Typography variant="h5" color="textSecondary">
              Explore around to add items in your shopping bag.
            </Typography>
            <Box sx={{ pt: 3 }}>
              <Button variant="contained" size="large" endIcon={<ArrowRight2 />}>
                Explore your bag
              </Button>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default CartEmpty;
