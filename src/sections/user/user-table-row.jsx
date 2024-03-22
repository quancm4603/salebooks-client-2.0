import Swal from 'sweetalert2';
import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Iconify from 'src/components/iconify';

import { API_BASE_URL } from '../../../config';

export default function SellerTableRow({
  id,
  selected,
  name,
  email,
  phoneNumber,
  role,
  password,
  handleClick,
  onUpdate,
  onEdit,
}) {

  const handleEdit = () => {
    handleCloseMenu();
    onEdit(id);
  };

  const [openPopover, setOpenPopover] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenMenu = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenPopover(null);
  };

  const handleDelete = () => {
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteConfirmed = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Seller/DeleteSeller/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        handleCloseDialog();
        onUpdate(id);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Seller deleted successfully!',
          onClose: () => onUpdate(id),
        });
      } else {
        console.error('Error deleting seller:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{email}</TableCell>

        <TableCell>{phoneNumber || 'N/A'}</TableCell>

        <TableCell>{role}</TableCell>

        {/* Avoid displaying password in the table */}
        <TableCell>{password}</TableCell>

         <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
         <MenuItem onClick={handleEdit} sx={{ mr: 2 }}>
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>

        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this item?</DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteConfirmed} variant="contained" color="error">
            Delete
          </Button>
          <Button onClick={handleCloseDialog} variant="outlined" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

SellerTableRow.propTypes = {
  handleClick: PropTypes.func,
  onUpdate: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  email: PropTypes.string,
  phoneNumber: PropTypes.string,
  role: PropTypes.bool,
  password: PropTypes.string,
  selected: PropTypes.bool,
  onEdit: PropTypes.func,
};
