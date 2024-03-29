import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Swal from 'sweetalert2'

import Stack from '@mui/material/Stack';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import { API_BASE_URL } from '../../../config';

// ----------------------------------------------------------------------

export default function QuotationTableRow({
  id,
  selected,
  name,
  type,
  price,
  createAt,
  status,
  handleClick,
  updateQuotationStatus,
  fetchQuotations,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const [openSendDialog, setOpenSendDialog] = useState(false);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const [loading, setLoading] = useState(false);

  const [currentQuotationDetails, setCurrentQuotationDetails] = useState(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [total, setTotal] = useState(0);

  // Quotation Detail
  const handleOpenDetailDialog = (quotationId) => {
    fetchQuotationDetails(quotationId);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    handleCloseMenu();
  };

  // Send
  const handleOpenSendDialog = () => {
    setOpenSendDialog(true);
  };

  const handleCloseSendDialog = () => {
    setOpenSendDialog(false);
    handleCloseMenu();
  };

  // Confirm
  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    handleCloseMenu();
  };

  // Cancel
  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
    handleCloseMenu();
  };

  // Menu actions
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleConfirmQuotation = async (num) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation/${num}/confirm`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Quotation confirmed successfully.');
        updateQuotationStatus(num, 'To Invoice');
        fetchQuotations();
        handleCloseConfirmDialog();
        handleCloseMenu();
        Swal.fire({
          title: "Confirmed!",
          text: "Confirm quotation successfully!",
          icon: "success"
        });
      } else {
        console.error('Failed to confirm quotation.');
        handleCloseMenu();
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to confirm quotation!',
        });
      }
    } catch (error) {
      console.error('Error confirming quotation:', error);
    }
  };

  const handleCancelQuotation = async (num) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation/${num}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        console.log('Quotation canceled successfully.');
        updateQuotationStatus(num, 'Cancelled');
        fetchQuotations();
        handleCloseCancelDialog();
        handleCloseMenu();
        Swal.fire({
          title: "Canceled!",
          text: "Cancel quotation successfully!",
          icon: "success"
        });
      } else {
        console.error('Failed to cancel quotation.');
        handleCloseMenu();
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to cancel quotation!',
        });
      }
    } catch (error) {
      console.error('Error canceling quotation:', error);
    }
  };

  const fetchQuotationDetails = async (quotationId) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation/${quotationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCurrentQuotationDetails(data);

        // Calculate total
        const totalAmount = data.reduce((acc, detail) => acc + detail.subTotal, 0);
        setTotal(totalAmount);
      } else {
        console.error('Failed to fetch quotation details');
      }
    } catch (error) {
      console.error('Error fetching quotation details:', error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  const handleSendQuotation = async (num) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation/${num}/SendQuotationEmail`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quotationId: num,
        }),
      });

      if (response.ok) {
        console.log('Quotation email sent successfully.');
        setLoading(false);
        handleCloseSendDialog();
        handleCloseMenu();
        Swal.fire({
          title: 'Email Sent!',
          text: 'Quotation email sent successfully!',
          icon: 'success',
        });
      } else {
        console.error('Failed to send quotation email.');
        handleCloseSendDialog();
        handleCloseMenu();
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: 'Failed to send quotation email!',
        });
      }
    } catch (error) {
      console.error('Error sending quotation email:', error);
    }
  };

  const getStatusColor = (s) => {
    switch (status) {
      case 'Quotation':
        return 'primary';
      case 'To Invoice':
        return 'warning';
      case 'Cancelled':
        return 'error';
      case 'Fully Invoice':
        return 'success';
      default:
        return 'defaultColor';
    }
  };

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
        </TableCell>

        <TableCell>
          {(() => {
            let labelColor = 'primary';
            let displayStatus = status;

            if (status === 'Cancelled') {
              labelColor = 'error';
            } else if (status === 'To Invoice' || status === 'Fully Invoice') {
              labelColor = 'success';
              displayStatus = 'order';
            } else {
              labelColor = 'primary';
            }

            return (
              <Label color={labelColor}>
                {displayStatus}
              </Label>
            );
          })()}
        </TableCell>

        <TableCell>{formatCreatedAt(createAt)}</TableCell>

        <TableCell>{price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >

        <MenuItem onClick={() => handleOpenDetailDialog(id)} sx={{ color: 'warning.main' }}>
          <Iconify icon="eva-info-fill" sx={{ mr: 2 }} />
          Detail
        </MenuItem>

        <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog}>
          <DialogTitle>Quotation Detail</DialogTitle>
          <DialogContent>
            {currentQuotationDetails && (
              <>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>SubTotal</TableCell>
                        <TableCell>Tax</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentQuotationDetails.map((detail) => (
                        <TableRow key={detail.id}>
                          <TableCell>{detail.product.name}</TableCell>
                          <TableCell>{detail.quantity}</TableCell>
                          <TableCell>{detail.subTotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                          <TableCell>{detail.product.tax * 100}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={2} className="text-right">
                          <Typography variant="strong">Total:</Typography>
                        </TableCell>
                        <TableCell>{total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDetailDialog} variant="outlined" color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {status === 'Quotation' && (
          <MenuItem onClick={handleOpenConfirmDialog} sx={{ color: 'success.main' }}>
            <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
            Confirm
          </MenuItem>
        )}

        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle>Confirm</DialogTitle>
          <DialogContent>Are you sure you want to confirm this quotation?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog} variant="outlined" color="primary">
              Leave
            </Button>
            <Button onClick={() => handleConfirmQuotation(id)} variant="contained" color="success">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {status === 'Quotation' && (
          <MenuItem onClick={handleOpenSendDialog} sx={{ color: 'primary.main' }}>
            <Iconify icon="eva-navigation-2-fill" sx={{ mr: 2 }} />
            Send
          </MenuItem>
        )}

        <Dialog open={openSendDialog} onClose={handleCloseSendDialog}>
          <DialogTitle>Send</DialogTitle>
          <DialogContent>Are you sure you want to send this quotation?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSendDialog} variant="outlined" color="primary">
              Leave
            </Button>
            <Button onClick={() => handleSendQuotation(id)} variant="contained" color="primary" disabled={loading}>
              {loading && (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: '-12px',
                    marginTop: '-12px',
                  }}
                />
              )}
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {status === 'Quotation' && (
          <MenuItem onClick={handleOpenCancelDialog} sx={{ color: 'error.main' }}>
            <Iconify icon="eva-close-square-outline" sx={{ mr: 2 }} />
            Cancel
          </MenuItem>
        )}

        <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
          <DialogTitle>Cancel</DialogTitle>
          <DialogContent>Are you sure you want to cancel this quotation?</DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCancelDialog} variant="outlined" color="primary">
              Leave
            </Button>
            <Button onClick={() => handleCancelQuotation(id)} variant="contained" color="error">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

      </Popover>
    </>
  );
}

QuotationTableRow.propTypes = {
  id: PropTypes.number,
  selected: PropTypes.bool,
  name: PropTypes.string,
  type: PropTypes.string,
  price: PropTypes.number,
  createAt: PropTypes.string,
  status: PropTypes.string,
  handleClick: PropTypes.func,
  updateQuotationStatus: PropTypes.func,
  fetchQuotations: PropTypes.func,
};

function formatCreatedAt(createdAt) {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedDay}/${formattedMonth}/${year} (${formattedHours}:${formattedMinutes})`;
}
