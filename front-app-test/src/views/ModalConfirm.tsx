import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

interface ModalConfirmProps {
    message: string;
    title: string;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ModalConfirm(props: ModalConfirmProps) {
  const { message, isOpen, setIsOpen, onConfirm, onCancel, title } = props;
    return (
        <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setIsOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onCancel}  sx={{backgroundColor: "blue"}}>Disagree</Button>
          <Button variant="contained" onClick={onConfirm} data-testid="modal-agree"  sx={{backgroundColor: "RGB(100, 35, 165)"}}>Agree</Button>
        </DialogActions>
      </Dialog>
    );
}

export default ModalConfirm;