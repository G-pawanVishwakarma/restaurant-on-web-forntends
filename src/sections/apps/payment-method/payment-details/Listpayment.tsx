import { ReactElement, useEffect, useState } from 'react';

// NEXT
import { useRouter } from 'next/navigation';

// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import ListItem from '@mui/material/ListItem';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';

// PROJECT IMPORTS
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';


import { openSnackbar } from 'api/snackbar';

// ASSETS
import { Heart } from 'iconsax-react';

// TYPES
import { SnackbarProps } from 'types/snackbar';
import { Payments } from 'types/payment-method';
import { useGetReleatedPayments } from 'api/payments';

const Listpayment = ({ payment }: { payment: Payments }) => {
  const theme = useTheme();
  const router = useRouter();

  const [wishlisted, setWishlisted] = useState<boolean>(false);
  const addToFavourite = () => {
    setWishlisted(!wishlisted);
    openSnackbar({
      open: true,
      message: 'Added to favourites',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    } as SnackbarProps);
  };

  const linkHandler = (id?: string | number) => {
    router.push(`/apps/payment-method/payment-details/${id}`);
  };

  return (
    <ListItemButton divider onClick={() => linkHandler(payment.id)} sx={{ borderRadius: 0 }}>
      <ListItemAvatar>
        <Avatar
          alt="Avatar"
          size="xl"
          color="secondary"
          variant="rounded"
          type="combined"
          src={payment.image ? `/assets/images/payment-method/thumbs/${payment.image}` : ''}
          sx={{ borderColor: theme.palette.divider, mr: 1 }}
        />
      </ListItemAvatar>
      <ListItemText
        disableTypography
        primary={<Typography variant="h5">{payment.name}</Typography>}
        secondary={
          <Stack spacing={1}>
            <Typography color="textSecondary">{payment.description}</Typography>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="h5">{payment.salePrice ? `$${payment.salePrice}` : `$${payment.offerPrice}`}</Typography>
                {payment.salePrice && (
                  <Typography variant="h6" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                    ${payment.offerPrice}
                  </Typography>
                )}
              </Stack>
              <Rating
                name="simple-controlled"
                value={payment.rating! < 4 ? payment.rating! + 1 : payment.rating}
                readOnly
                precision={0.1}
              />
            </Stack>
          </Stack>
        }
      />
      <ListItemSecondaryAction>
        <IconButton
          size="medium"
          color="secondary"
          sx={{ opacity: wishlisted ? 1 : 0.5, '&:hover': { bgcolor: 'transparent' } }}
          onClick={addToFavourite}
        >
          {wishlisted ? (
            <Heart variant="Bold" style={{ fontSize: '1.15rem', color: theme.palette.error.main }} />
          ) : (
            <Heart style={{ fontSize: '1.15rem' }} />
          )}
        </IconButton>
      </ListItemSecondaryAction>
    </ListItemButton>
  );
};

// ==============================|| payment DETAILS - RELATED paymentS ||============================== //

const Relatedpayments = ({ id }: { id?: string }) => {
  const { relatedPaymentsLoading, relatedPayments } = useGetReleatedPayments(id!);

  const [related, setRelated] = useState<Payments[]>(relatedPayments);

  useEffect(() => {
    if (!relatedPaymentsLoading) {
      setRelated(relatedPayments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, relatedPaymentsLoading]);

  let paymentResult: ReactElement | ReactElement[] = (
    <List>
      {[1, 2, 3].map((index: number) => (
        <ListItem key={index}>
          <ListItemAvatar sx={{ minWidth: 72 }}>
            <Skeleton variant="rectangular" width={62} height={62} />
          </ListItemAvatar>
          <ListItemText
            primary={<Skeleton animation="wave" height={22} />}
            secondary={
              <>
                <Skeleton animation="wave" height={14} width="60%" />
                <Skeleton animation="wave" height={18} width="20%" />
                <Skeleton animation="wave" height={14} width="35%" />
              </>
            }
          />
        </ListItem>
      ))}
    </List>
  );

  if (related && !relatedPaymentsLoading) {
    paymentResult = (
      <List
        component="nav"
        sx={{
          '& .MuiListItemButton-root': {
            '& .MuiListItemSecondaryAction-root': {
              alignSelf: 'flex-start',
              ml: 1,
              position: 'relative',
              right: 'auto',
              top: 'auto',
              transform: 'none'
            },
            '& .MuiListItemAvatar-root': { mr: '7px' },
            py: 0.5,
            pl: '15px',
            pr: '8px'
          },
          p: 0
        }}
      >
        {related.map((payment: Payments, index) => (
          <Listpayment key={index} payment={payment} />
        ))}
      </List>
    );
  }

  return (
    <SimpleBar sx={{ height: { xs: '100%', md: 'calc(100% - 62px)' } }}>
      <Grid item>
        <Stack>
          {paymentResult}
          <Button color="secondary" variant="outlined" sx={{ mx: 2, my: 4, textTransform: 'none' }}>
            View all payments
          </Button>
        </Stack>
      </Grid>
    </SimpleBar>
  );
};

export default Relatedpayments;
