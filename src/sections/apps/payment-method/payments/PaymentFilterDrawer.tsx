// MATERIAL - UI
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';

// PROJECT IMPORTS

import PaymentFilter from './PaymentFilter';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';
import { HEADER_HEIGHT } from 'config';
import useConfig from 'hooks/useConfig';

// TYPES
import { ThemeMode } from 'types/config';
import { PaymentsFilter } from 'types/payment-method';
import PaymentFilterView from './PaymentFilterView';

// ==============================|| payment - FILTER DRAWER ||============================== //

interface FilterDrawerProps {
  filter: PaymentsFilter;
  initialState: PaymentsFilter;
  handleDrawerOpen: () => void;
  openFilterDrawer: boolean | undefined;
  setFilter: (filter: PaymentsFilter) => void;
}

function PaymentFilterDrawer({ filter, initialState, handleDrawerOpen, openFilterDrawer, setFilter }: FilterDrawerProps) {
  const theme = useTheme();

  const { container } = useConfig();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const matchLG = useMediaQuery(theme.breakpoints.only('lg'));
  const drawerBG = theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'white';

  const filterIsEqual = (a1: PaymentsFilter, a2: PaymentsFilter) =>
    a1 === a2 ||
    (a1.length === a2.length &&
      a1.search === a2.search &&
      a1.sort === a2.sort &&
      a1.price === a2.price &&
      a1.rating === a2.rating &&
      JSON.stringify(a1.gender) === JSON.stringify(a2.gender) &&
      JSON.stringify(a1.categories) === JSON.stringify(a2.categories) &&
      JSON.stringify(a1.colors) === JSON.stringify(a2.colors));

  const handelFilter = (type: string, params: string, rating?: number) => {
    switch (type) {
      case 'gender':
        if (filter.gender.some((item) => item === params)) {
          setFilter({ ...filter, gender: filter.gender.filter((item) => item !== params) });
        } else {
          setFilter({ ...filter, gender: [...filter.gender, params] });
        }
        break;
      case 'categories':
        if (filter.categories.some((item) => item === params)) {
          setFilter({ ...filter, categories: filter.categories.filter((item) => item !== params) });
        } else if (filter.categories.some((item) => item === 'all') || params === 'all') {
          setFilter({ ...filter, categories: [params] });
        } else {
          setFilter({ ...filter, categories: [...filter.categories, params] });
        }

        break;
      case 'colors':
        if (filter.colors.some((item) => item === params)) {
          setFilter({ ...filter, colors: filter.colors.filter((item) => item !== params) });
        } else {
          setFilter({ ...filter, colors: [...filter.colors, params] });
        }
        break;
      case 'price':
        setFilter({ ...filter, price: params });
        break;
      case 'search':
        setFilter({ ...filter, search: params });
        break;
      case 'sort':
        setFilter({ ...filter, sort: params });
        break;
      case 'rating':
        setFilter({ ...filter, rating: rating! });
        break;
      case 'reset':
        setFilter(initialState);
        break;
      default:
      // no options
    }
  };

  const drawerContent = (
    <Stack sx={{ p: 3 }} spacing={0.5}>
      <PaymentFilterView filter={filter} filterIsEqual={filterIsEqual} handelFilter={handelFilter} initialState={initialState} />
      <PaymentFilter filter={filter} handelFilter={handelFilter} />
    </Stack>
  );

  return (
    <Drawer
      sx={{
        width: container && matchLG ? 240 : 320,
        flexShrink: 0,
        zIndex: { xs: 1200, lg: 0 },
        mr: openFilterDrawer && !matchDownLG ? 2.5 : 0,
        '& .MuiDrawer-paper': {
          height: matchDownLG ? '100%' : 'auto',
          width: container && matchLG ? 240 : 320,
          boxSizing: 'border-box',
          position: 'relative',
          boxShadow: 'none'
        }
      }}
      variant={matchDownLG ? 'temporary' : 'persistent'}
      anchor="left"
      open={openFilterDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      <MainCard
        title="Filter"
        sx={{ bgcolor: matchDownLG ? 'transparent' : drawerBG, borderRadius: '4px 0 0 4px', borderRight: 'none' }}
        border={!matchDownLG}
        content={false}
      >
        {matchDownLG && <SimpleBar sx={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>{drawerContent}</SimpleBar>}
        {!matchDownLG && drawerContent}
      </MainCard>
    </Drawer>
  );
}

export default PaymentFilterDrawer;
