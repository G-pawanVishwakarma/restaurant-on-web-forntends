// MATERIAL - UI
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

// TYPES
import { GenericCardProps } from 'types/root';

// STYLES
const IconWrapper = styled('div')({
  position: 'absolute',
  left: '-17px',
  bottom: '-27px',
  color: '#fff',
  transform: 'rotate(25deg)',
  '& svg': {
    width: '100px',
    height: '100px',
    opacity: '0.35'
  }
});

// =============================|| STATISTICS - USER NUM CARD ||============================= //

interface UserCountCardProps {
  primary: string;
  secondary: string;
  iconPrimary: GenericCardProps['iconPrimary'];
  color: string;
}

const UserCountCard = ({ primary, secondary, iconPrimary, color }: UserCountCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <Card elevation={0} sx={{ bgcolor: color, position: 'relative', color: '#fff' }}>
      <CardContent>
        <IconWrapper>{primaryIcon}</IconWrapper>
        <Grid container direction="column" justifyContent="center" alignItems="center" spacing={1}>
          <Grid item sm={12}>
            <Typography variant="h3" align="center" color="inherit">
              {secondary}
            </Typography>
          </Grid>
          <Grid item sm={12}>
            <Typography variant="body1" align="center" color="inherit">
              {primary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UserCountCard;
