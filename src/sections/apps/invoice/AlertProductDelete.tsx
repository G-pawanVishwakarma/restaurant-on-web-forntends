// MATERIAL - UI
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// PROJECT IMPORTS
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// ASSETS
import { Trash } from 'iconsax-react';

// TYPES
interface Props {
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
}

// ==============================|| INVOICE - payment DELETE ||============================== //

export default function AlertpaymentDelete({ title, open, handleClose }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      TransitionComponent={PopupTransition}
      keepMounted
      maxWidth="xs"
      aria-labelledby="item-delete-title"
      aria-describedby="item-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              Are you sure you want to delete?
            </Typography>
            <Typography align="center">
              By deleting
              <Typography variant="subtitle1" component="span">
                &quot;{title}&quot;
              </Typography>
              payment, Its details will also be removed from invoice.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancel
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={() => handleClose(true)} autoFocus>
              Delete
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
