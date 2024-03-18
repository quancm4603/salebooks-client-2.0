import axios from 'axios';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { isNaN } from 'lodash';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import {
  Card,
  Stack,
  Table,
  Modal,
  Alert,
  Button,
  Select,
  styled,
  MenuItem,
  Snackbar,
  Container,
  TableBody,
  TextField,
  Typography,
  InputLabel,
  IconButton,
  FormControl,
  TableContainer,
  InputAdornment,
  TablePagination,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import SellerTableRow from '../user-table-row';
import TableEmptyRows from '../table-empty-rows';
import SellerTableHead from '../user-table-head';
import { API_BASE_URL } from '../../../../config';
import SellerTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

const ModalContent = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: theme.palette.background.paper,
  boxShadow: 24,
  p: 4,
  outline: 'none',
}));
function SellersPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sellers, setSellers] = useState([]);  // Use sellers state
  const navigate = useNavigate();
  const [openAddSellerModal, setOpenAddSellerModal] = useState(false);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);


  const [addSellerError, setAddSellerError] = useState(null); // State to store the error message
  const [editSellerError, setEditSellerError] = useState(null); // State để lưu trữ thông báo lỗi


  // Trong component SellersPage
  const [showAddSellerPassword, setShowAddSellerPassword] = useState(false);
  const [showEditSellerPassword, setShowEditSellerPassword] = useState(false);

  // Trong component SellersPage
  const handleToggleAddSellerPasswordVisibility = () => {
    setShowAddSellerPassword(!showAddSellerPassword);
  };

  const handleToggleEditSellerPasswordVisibility = () => {
    setShowEditSellerPassword(!showEditSellerPassword);
  };



  const [openEditSellerModal, setOpenEditSellerModal] = useState(false);
  const [editSellerFormData, setEditSellerFormData] = useState({
    id: null,
    name: '',
    role: false,
    email: '',
    password: '',
    phoneNumber: '',
  });
  const handleOpenEditSellerModal = (id) => {
    // Lấy thông tin seller cần chỉnh sửa từ danh sách sellers
    const sellerToEdit = sellers.find((seller) => seller.id === id);
    // Mở dialog và set thông tin seller vào form
    setOpenEditSellerModal(true);
    setEditSellerFormData({
      id: sellerToEdit.id,
      name: sellerToEdit.name,
      role: sellerToEdit.role,
      email: sellerToEdit.email,
      password: sellerToEdit.password,
      phoneNumber: sellerToEdit.phoneNumber,
    });
  };
  const handleCloseEditSellerModal = () => {
    setOpenEditSellerModal(false);
    // Reset form data when the modal is closed
    setEditSellerFormData({
      id: null,
      name: '',
      role: false,
      email: '',
      password: '',
      phoneNumber: '',
    });
  };
  const handleEditSellerFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditSellerFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Xóa thông báo lỗi trước đó khi người dùng bắt đầu chỉnh sửa form
    setEditSellerError(null);
  };

  const handleEditSeller = async () => {
    try {
      const token = localStorage.getItem('jwttoken');

      // Validation
      if (!editSellerFormData.name) {
        setEditSellerError('Please fill in the name field.'); // Set thông báo lỗi
        return;
      }

      if (!editSellerFormData.email || !/^\S+@\S+\.\S+$/.test(editSellerFormData.email)) {
        setEditSellerError('Please provide a valid email address.'); // Set thông báo lỗi
        return;
      }

      if (!editSellerFormData.phoneNumber || isNaN(editSellerFormData.phoneNumber) || editSellerFormData.phoneNumber.length !== 10) {
        setEditSellerError('Please provide a valid 10-digit phone number.'); // Set error message
        return;
      }

      if (!editSellerFormData.password || editSellerFormData.password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(editSellerFormData.password)) {
        setEditSellerError('Password must have at least 6 characters, and must contain special characters.'); // Set error message
        return;
      }

      const requestData = {
        id: editSellerFormData.id,
        name: editSellerFormData.name,
        role: editSellerFormData.role,
        email: editSellerFormData.email,
        password: editSellerFormData.password,
        phoneNumber: editSellerFormData.phoneNumber,
      };
      await axios.patch(`${API_BASE_URL}/api/Seller/UpdateSeller/${editSellerFormData.id}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: 'Success',
        text: 'Seller updated successfully',
        icon: 'success',
      });
      fetchSellers();
      handleCloseEditSellerModal();
    } catch (err) {
      console.error('Error updating seller:', err);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again.',
        icon: 'error',
      });
    }
  };



  const [addSellerFormData, setAddSellerFormData] = useState({
    name: '',
    role: false,
    email: '',
    password: '',
    phoneNumber: '',
  });
  const handleOpenAddSellerModal = () => {
    setOpenAddSellerModal(true);
  };
  const handleCloseAddSellerModal = () => {
    setOpenAddSellerModal(false);
    // Reset form data when the modal is closed
    setAddSellerFormData({
      name: '',
      role: null,
      email: '',
      password: '',
      phoneNumber: '',
    });
  };
  const fetchSellers = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Seller/GetSellers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Chuyển đổi giá trị role từ true/false thành "User"/"Admin"
        const updatedSellers = data.map((seller) => ({
          ...seller,
          role: seller.role ? "Admin" : "Seller",
        }));
        setSellers(updatedSellers);
      } else {
        console.error('Failed to fetch Sellers');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching Sellers:', error);
    }
  }, [navigate, setSellers]);
  useEffect(() => {
    fetchSellers();
  }, [fetchSellers]);
  const clearForm = () => {
    setAddSellerFormData({
      name: '',
      role: false,
      email: '',
      password: '',
      phoneNumber: '',
    });
  };
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };
  const handleUpdateUsers = (id) => {
    // Cập nhật danh sách người dùng bằng cách lọc ra những người dùng không có deletedUserId
    setSellers(sellers.filter((row) => row.id !== id));
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = sellers.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };
  const dataFiltered = applyFilter({
    inputData: sellers,
    comparator: getComparator(order, orderBy),
    filterName,
  });
  const notFound = !dataFiltered.length && !!filterName;
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  // Function to handle changes in Add Seller form fields
  const handleAddSellerFormChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddSellerFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear previous error message when user starts editing the form
    setAddSellerError(null);
  };

  const handleAddSeller = async () => {
    try {
      const token = localStorage.getItem('jwttoken');

      // Validation
      if (!addSellerFormData.name) {
        setAddSellerError('Please fill in the name field.'); // Set error message
        return;
      }

      if (!addSellerFormData.email || !/^\S+@\S+\.\S+$/.test(addSellerFormData.email)) {
        setAddSellerError('Please provide a valid email address.'); // Set error message
        return;
      }

      if (!addSellerFormData.phoneNumber || isNaN(addSellerFormData.phoneNumber) || addSellerFormData.phoneNumber.length !== 10) {
        setAddSellerError('Please provide a valid 10-digit phone number.'); // Set error message
        return;
      }

      if (!addSellerFormData.password || addSellerFormData.password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(addSellerFormData.password)) {
        setAddSellerError('Password must have at least 6 characters, and must contain special characters.'); // Set error message
        return;
      }

      const requestData = {
        name: addSellerFormData.name,
        role: addSellerFormData.role,
        email: addSellerFormData.email,
        password: addSellerFormData.password,
        phoneNumber: addSellerFormData.phoneNumber,
      };
      await axios.post(`${API_BASE_URL}/api/Seller/AddSeller`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Swal.fire({
        title: 'Success',
        text: 'Seller added successfully',
        icon: 'success',
      });
      fetchSellers();
      handleCloseAddSellerModal();
      clearForm();
    } catch (err) {
      console.error('Error adding seller:', err);
      fetchSellers();
      handleCloseAddSellerModal();
      clearForm();
      Swal.fire({
        title: 'Error',
        text: 'An error occurred. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleExportToExcel = () => {
    try {
      // Check if any user is selected
      if (selected.length === 0) {
        Swal.fire({
          title: 'No User Selected',
          text: 'Please select a user to export.',
          icon: 'warning',
        });
        return;
      }
      // Filter selected users
      const selectedUsers = sellers.filter((seller) => selected.includes(seller.id));
      // Define the data to be exported
      const dataToExport = selectedUsers.map((seller) => ({
        Name: seller.name,
        Email: seller.email,
        PhoneNumber: seller.phoneNumber,
        Role: seller.role,
        Password: seller.password,
      }));
      // Create a worksheet
      const ws = XLSX.utils.json_to_sheet(dataToExport);
      // Create a workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SelectedSellers');
      // Save the file
      XLSX.writeFile(wb, 'selected_sellers.xlsx');
      Swal.fire({
        title: 'Success',
        text: 'Selected user exported to Excel successfully',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while exporting to Excel. Please try again.',
        icon: 'error',
      });
    }
  };
  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Sellers</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={handleOpenAddSellerModal}
        >
          New Seller
        </Button>



        <Modal open={openAddSellerModal} onClose={handleCloseAddSellerModal}>
          <ModalContent style={{ backgroundColor: 'white', padding: '20px' }}>
            {/* Form fields for adding a new seller */}
            <Stack spacing={2}>
              {addSellerError && ( // Display error message if exists
                <Alert severity="error">{addSellerError}</Alert>
              )}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={addSellerFormData.name}
                onChange={handleAddSellerFormChange}
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={addSellerFormData.role}
                  onChange={handleAddSellerFormChange}
                  label="Role"
                >
                  <MenuItem value={false}>User</MenuItem>
                  <MenuItem value>Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="PhoneNumber"
                name="phoneNumber"
                value={addSellerFormData.phoneNumber}
                onChange={handleAddSellerFormChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={addSellerFormData.email}
                onChange={handleAddSellerFormChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                type={showAddSellerPassword ? 'text' : 'password'}
                name="password"
                value={addSellerFormData.password}
                onChange={handleAddSellerFormChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleAddSellerPasswordVisibility} edge="end">
                        {showAddSellerPassword ? '👁️' : '👁️'}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Buttons to submit or cancel */}
              <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
                <Button variant="contained" color="primary" onClick={handleAddSeller}>
                  Add Seller
                </Button>
                <Button onClick={handleCloseAddSellerModal} variant="outlined">
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </ModalContent>
        </Modal>



        <Modal open={openEditSellerModal} onClose={handleCloseEditSellerModal}>
          <ModalContent style={{ backgroundColor: 'white', padding: '20px' }}>
            {/* Form fields for editing a seller */}
            <Stack spacing={2}>
              {editSellerError && ( // Hiển thị thông báo lỗi nếu có
                <Alert severity="error">{editSellerError}</Alert>
              )}
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={editSellerFormData.name}
                onChange={handleEditSellerFormChange}
                variant="outlined"
              />
              <FormControl fullWidth variant="outlined">
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={editSellerFormData.role}
                  onChange={handleEditSellerFormChange}
                  label="Role"
                >
                  <MenuItem value={false}>User</MenuItem>
                  <MenuItem value>Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="PhoneNumber"
                name="phoneNumber"
                value={editSellerFormData.phoneNumber}
                onChange={handleEditSellerFormChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={editSellerFormData.email}
                onChange={handleEditSellerFormChange}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Password"
                type={showEditSellerPassword ? 'text' : 'password'}
                name="password"
                value={editSellerFormData.password}
                onChange={handleEditSellerFormChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleToggleEditSellerPasswordVisibility} edge="end">
                        {showEditSellerPassword ? '👁️' : '👁️'}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

            </Stack>
            {/* Display existing seller information */}
            <Typography variant="h6" sx={{ mt: 2 }}>Existing Information:</Typography>
            <Stack spacing={1} sx={{ pl: 2 }}>
              <Typography variant="body1">Name: {editSellerFormData.name}</Typography>
              <Typography variant="body1">Role: {editSellerFormData.role ? 'Admin' : 'User'}</Typography>
              <Typography variant="body1">PhoneNumber: {editSellerFormData.phoneNumber}</Typography>
              <Typography variant="body1">Email: {editSellerFormData.email}</Typography>
              <Typography variant="body1">Password: {editSellerFormData.password}</Typography>
            </Stack>
            {/* Buttons to submit or cancel */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
              <Button variant="contained" color="primary" onClick={handleEditSeller}>
                Update Seller
              </Button>
              <Button onClick={handleCloseEditSellerModal} variant="outlined">
                Cancel
              </Button>
            </Stack>
          </ModalContent>
        </Modal>




      </Stack>
      <Card>
        <SellerTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onExportToExcel={handleExportToExcel}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SellerTableHead
                order={order}
                orderBy={orderBy}
                rowCount={sellers.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'phoneNumber', label: 'Phone Number check' },
                  { id: 'role', label: 'Role' },
                  { id: 'password', label: 'Password', },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <SellerTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      email={row.email}
                      phoneNumber={row.phoneNumber}
                      role={row.role.toString()}
                      password={row.password}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                      onEdit={handleOpenEditSellerModal}
                      // Add other props as needed
                      onUpdate={handleUpdateUsers}
                    />
                  ))}
                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, sellers.length)}
                />
                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
            {/* Snackbar for success message */}
            <Snackbar
              open={showSuccessSnackbar}
              autoHideDuration={6000}
              onClose={() => setShowSuccessSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert onClose={() => setShowSuccessSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                Seller added successfully!
              </Alert>
            </Snackbar>
            {/* Snackbar for error message */}
            <Snackbar
              open={showErrorSnackbar}
              autoHideDuration={6000}
              onClose={() => setShowErrorSnackbar(false)}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert onClose={() => setShowErrorSnackbar(false)} severity="error" sx={{ width: '100%' }}>
                Error adding seller. Please try again.
              </Alert>
            </Snackbar>
          </TableContainer>
        </Scrollbar>
        <TablePagination
          page={page}
          component="div"
          count={sellers.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}
export default SellersPage;