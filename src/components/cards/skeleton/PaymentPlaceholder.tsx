// MATERIAL - UI
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

// PROJECT IMPORTS
import MainCard from 'components/MainCard';

// ===========================|| SKELETON - Payment CARD ||=========================== //

const PaymentPlaceholder = () => (
  <MainCard content={false}>
    <Skeleton variant="rectangular" height={220} />
    <CardContent sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={20} />
        </Grid>
        <Grid item xs={12}>
          <Skeleton variant="rectangular" height={45} />
        </Grid>
        <Grid item xs={12} sx={{ pt: '8px !important' }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Skeleton variant="rectangular" height={20} width={90} />
            <Skeleton variant="rectangular" height={20} width={38} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Grid container spacing={1}>
              <Grid item>
                <Skeleton variant="rectangular" height={20} width={40} />
              </Grid>
              <Grid item>
                <Skeleton variant="rectangular" height={17} width={20} />
              </Grid>
            </Grid>
            <Skeleton variant="rectangular" height={32} width={47} />
          </Stack>
        </Grid>
      </Grid>
    </CardContent>
  </MainCard>
);

export default PaymentPlaceholder;
