import { useEffect, useState } from 'react';

// MATERIAL - UI
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import Checkbox from '@mui/material/Checkbox';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';

// TYPES
import { PaymentsFilter } from 'types/payment-method';

// PROJECT IMPORTS
import Colors from './Colors';

// ==============================|| payment - GENDER FILTER ||============================== //

const Gender = ({ gender, handelFilter }: { gender: string[]; handelFilter: (type: string, params: string) => void }) => {
  const [isGenderLoading, setGenderLoading] = useState(true);
  useEffect(() => {
    setGenderLoading(false);
  }, []);

  return (
    <Stack>
      {isGenderLoading ? (
        <Skeleton variant="rectangular" width="100%" height={42} />
      ) : (
        <>
          <Typography variant="h5">Gender</Typography>
          <Box sx={{ pl: 0.5 }}>
            <Stack>
              <FormControlLabel
                control={<Checkbox checked={gender.some((item) => item === 'male')} />}
                onChange={() => handelFilter('gender', 'male')}
                label="Male"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gender.some((item) => item === 'female')}
                    onChange={() => handelFilter('gender', 'female')}
                    color="secondary"
                  />
                }
                label="Female"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={gender.some((item) => item === 'kids')}
                    onChange={() => handelFilter('gender', 'kids')}
                    color="error"
                  />
                }
                label="Kids"
              />
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  );
};

// ==============================|| payment GRID - CATEGORIES FILTER ||============================== //

const Categories = ({ categories, handelFilter }: { categories: string[]; handelFilter: (type: string, params: string) => void }) => {
  const [isCategoriesLoading, setCategoriesLoading] = useState(true);
  useEffect(() => {
    setCategoriesLoading(false);
  }, []);

  return (
    <Stack>
      {isCategoriesLoading ? (
        <Grid item xs={12}>
          <Skeleton variant="rectangular" width="100%" height={96} />
        </Grid>
      ) : (
        <>
          <Typography variant="h5">Categories</Typography>
          <Box sx={{ pl: 0.5 }}>
            <Stack>
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'all')} />}
                onChange={() => handelFilter('categories', 'all')}
                label="All"
              />
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'electronics')} />}
                onChange={() => handelFilter('categories', 'electronics')}
                label="Electronics"
              />
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'fashion')} />}
                onChange={() => handelFilter('categories', 'fashion')}
                label="Fashion"
              />
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'books')} />}
                onChange={() => handelFilter('categories', 'books')}
                label="Book"
              />
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'toys')} />}
                onChange={() => handelFilter('categories', 'toys')}
                label="Toys"
              />
              <FormControlLabel
                control={<Checkbox checked={categories.some((item) => item === 'kitchen')} />}
                onChange={() => handelFilter('categories', 'kitchen')}
                label="Home & Kitchen"
              />
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  );
};

// ==============================|| payment GRID - PRICE FILTER ||============================== //

const Price = ({ price, handelFilter }: { price: string; handelFilter: (type: string, params: string) => void }) => {
  const [isPriceLoading, setPriceLoading] = useState(true);
  useEffect(() => {
    setPriceLoading(false);
  }, []);

  const valuetext = (value: number) => `${value}`;

  const [value, setValue] = useState<number[]>([0, 300]);
  const handleSlider = (event: Event, newValue: any) => {
    setValue(newValue);
    const data = `${newValue[0]}-${newValue[1]}`;
    handelFilter('price', data);
  };

  return (
    <>
      {isPriceLoading ? (
        <Skeleton variant="rectangular" width="100%" height={172} />
      ) : (
        <Stack spacing={1}>
          <Typography variant="h5">Price</Typography>
          <Stack direction="row" spacing={2}>
            <Stack spacing={0.5}>
              <Typography color="textSecondary">Min</Typography>
              <TextField
                value={value[0]}
                InputProps={{
                  readOnly: true
                }}
              />
            </Stack>
            <Stack spacing={0.5}>
              <Typography color="textSecondary">Max</Typography>
              <TextField
                value={value[1]}
                InputProps={{
                  readOnly: true
                }}
              />
            </Stack>
          </Stack>
          <Box sx={{ px: 0.75 }}>
            <Slider min={0} max={1000} value={value} onChange={handleSlider} valueLabelDisplay="auto" getAriaValueText={valuetext} />
          </Box>
        </Stack>
      )}
    </>
  );
};

// ==============================|| payment GRID - RATING FILTER ||============================== //

const RatingSection = ({
  rating,
  handelFilter
}: {
  rating: number;
  handelFilter: (type: string, params: string, rating: number) => void;
}) => {
  const [isRatingLoading, setRatingLoading] = useState(true);
  useEffect(() => {
    setRatingLoading(false);
  }, []);

  return (
    <>
      {isRatingLoading ? (
        <Skeleton variant="rectangular" width="100%" height={172} />
      ) : (
        <Stack spacing={1}>
          <Typography variant="h5">Rating</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating
              precision={0.5}
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => handelFilter('rating', '', newValue!)}
            />
            <Typography component="legend">({rating})</Typography>
          </Stack>
        </Stack>
      )}
    </>
  );
};

// ==============================|| payment GRID - FILTER ||============================== //

const PaymentFilter = ({
  filter,
  handelFilter
}: {
  filter: PaymentsFilter;
  handelFilter: (type: string, params: string, rating?: number) => void;
}) => (
  <Grid container direction="column" rowSpacing={3}>
    <Grid item>
      <Gender gender={filter.gender} handelFilter={handelFilter} />
    </Grid>
    <Grid item>
      <Categories categories={filter.categories} handelFilter={handelFilter} />
    </Grid>
    <Grid item>
      <Colors colors={filter.colors} handelFilter={handelFilter} />
    </Grid>
    <Grid item>
      <Price price={filter.price} handelFilter={handelFilter} />
    </Grid>
    <Grid item>
      <RatingSection rating={filter.rating} handelFilter={handelFilter} />
    </Grid>
  </Grid>
);

export default PaymentFilter;
