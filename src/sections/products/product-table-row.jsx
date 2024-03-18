import { useState } from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import MuiAlert from '@mui/material/Alert';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import Iconify from 'src/components/iconify';

import EditProductDialog from './view/product-update';
import ProductDetailDialog from './view/product-detail';

export default function ProductTableRow({
  id,
  selected,
  name,
  type,
  price,
  tax,
  note,
  categoryName,
  userName,
  imageUrls,
  handleClick,
  onUpdate,
  fetchProducts,
}) {
  const [openPopover, setOpenPopover] = useState(null);
  const [, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const MAX_NOTE_LENGTH = 50;

  const handleOpenSnackbar = () => {
    setSnackbarOpen(true);
  };

  const handleOpenEditDialog = () => {
    setEditedProduct({
      id,
      name,
      type,
      price,
      tax,
      note,
      categoryName,
      imageUrls,
    });
    setOpenEditDialog(true);
    handleCloseMenu();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditedProduct(null);
  };

  const handleOpenMenu = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenPopover(null);
  };

  const truncatedNote =
    note.length > MAX_NOTE_LENGTH ? `${note.substring(0, MAX_NOTE_LENGTH)}...` : note;

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

        <TableCell>{type}</TableCell>

        <TableCell>{price}</TableCell>

        <TableCell>{tax}</TableCell>

        <TableCell>{categoryName}</TableCell>

        <TableCell>{truncatedNote}</TableCell>

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
        <MenuItem onClick={handleOpenEditDialog}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleCloseMenu();
            setOpenDialog(false);
            setOpenDetailDialog(true);
          }}
        >
          <Iconify icon="eva:info-outline" sx={{ mr: 2 }} />
          Details
        </MenuItem>
      </Popover>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <EditProductDialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          onUpdateProduct={fetchProducts}
          productData={editedProduct}
          onOpenSnackbar={handleOpenSnackbar}
        />
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
          severity="success"
        >
          Product updated successfully!
        </MuiAlert>
      </Snackbar>

      <ProductDetailDialog // Adding the detail dialog component
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        productId={id}
      />
    </>
  );
}

ProductTableRow.propTypes = {
  handleClick: PropTypes.func,
  onUpdate: PropTypes.func,
  id: PropTypes.number,
  name: PropTypes.string,
  type: PropTypes.string,
  price: PropTypes.number,
  tax: PropTypes.number,
  note: PropTypes.string,
  categoryName: PropTypes.string,
  userName: PropTypes.string,
  imageUrls: PropTypes.array,
  selected: PropTypes.bool,
  fetchProducts: PropTypes.func,
};
