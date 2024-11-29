// NEXT
import Link from 'next/link';

// MATERIAL - UI
import ButtonBase from '@mui/material/ButtonBase';
import { SxProps } from '@mui/system';

// THIRD - PARTY
import { To } from 'history';

// PROJECT IMPORTS
import { APP_DEFAULT_PATH } from 'config';
import RestaurantLogo from './RestaurantLogo';
import RestaurantLogoIcon from './RestaurantLogoIcon';

// ==============================|| MAIN LOGO ||============================== //

interface Props {
  reverse?: boolean;
  isIcon?: boolean;
  sx?: SxProps;
  to?: To;
}

const LogoSection = ({ reverse, isIcon, sx, to }: Props) => (
  <ButtonBase disableRipple component={Link} href={!to ? APP_DEFAULT_PATH : to} sx={sx}>
    {isIcon ? <RestaurantLogoIcon /> : <RestaurantLogo reverse={reverse} />}
  </ButtonBase>
);

export default LogoSection;
