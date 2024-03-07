import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Iconify from 'src/components/iconify';
import axios from 'axios';

import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Button, TextField, Dialog, Grid, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

/* Nó sử dụng các thành phần của Material-UI để thiết kế và chức năng, bao gồm TableRow, 
TableCell, Checkbox, IconButton, Popover, và MenuItem. */

import Label from 'src/components/label';

// ----------------------------------------------------------------------
/*  định nghĩa một thành phần React có tên là UserTableRow được sử dụng để hiển thị một dòng của bảng chứa thông tin người dùng. */

export default function UserTableRow({
  selected,
  name,
  avatarUrl,
  companyName,
  email,
  mobile,
  province,
  district,
  address,
  role,
  status,
  handleClick,
  customerId

  
}) {

  const [open, setOpen] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDetail, setOpenDialogDetail] = useState(false);



  const handleCloseMenuEdit = () => {
    setOpenDialog(false);
  };

  const handleCloseMenuDetail = () => {
    setOpenDialogDetail(false);
  };


  /* Hàm handleOpenMenu thiết lập phần tử gốc cho menu popover là mục tiêu hiện tại. */
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  /* Hàm handleCloseMenu đóng menu popover. */
  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleChange = (e) => {
    setFormDataAdd({ ...formDataAdd, [e.target.name]: e.target.value });
  };

  const [formDataAdd, setFormDataAdd] = useState({
    name: '',
    customerType: 1,
    companyName: '',
    taxID: '',
    phone: "000",
    mobile: '',
    email: '',
    website: '',
    tags: '',
    internalNotes: '',
    sellerId: null,
    address: '',
    district: '',
    ward: '',
    province: '',
    zipCode: "000",
    country: 'VIETNAM',
    customerIdz: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7196/api/Customer/AddCustomerX', formDataAdd, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Customer added successfully:', response.data);

      window.setTimeout(() => {
        setOpen(false);
      }, 100); // 1000 milliseconds = 1 giây

      Swal.fire({
        title: 'Success',
        text: 'Customer added successfully',
        icon: 'success',
        timer: 30000, // Thời gian hiển thị thông báo (ms)
        timerProgressBar: true, // Hiển thị thanh tiến trình
        showConfirmButton: true // Ẩn nút xác nhận
      }).then((result) => {
        // Kiểm tra nếu người dùng đã ấn nút OK
        if (result.isConfirmed) {
          // Reload lại trang
          window.location.reload();
        }
      });



    } catch (error) {
      console.error('Failed to add customer:', error.message);

      window.setTimeout(() => {
        setOpen(false);

      }, 100); // 1000 milliseconds = 1 giây

      Swal.fire({
        title: "Error",
        text: "An error occurred while add new customer. Please try again.",
        icon: "error",
        timer: 30000, // Thời gian hiển thị thông báo (ms)
        timerProgressBar: true, // Hiển thị thanh tiến trình
        showConfirmButton: true // Ẩn nút xác nhận
      });

    }
  };

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    const selectedCity = cities.find(city => city.Id === selectedCityId);

    if (selectedCity) {
      setDistricts(selectedCity.Districts);
      setWards([]);
      setFormDataAdd({
        ...formDataAdd,
        province: selectedCity.Name
      });
    }
  };


  const handleDistrictChange = (event) => {
    const selectedDistrictId = event.target.value;
    const selectedDistrictItem = districts.find(districtItem => districtItem.Id === selectedDistrictId);

    if (selectedDistrictItem) {
      setWards(selectedDistrictItem.Wards);
      setFormDataAdd({
        ...formDataAdd,
        district: selectedDistrictItem.Name
      });
    }
  };


  const handleWardChange = (event) => {
    const selectedWard = event.target.value;
    setFormDataAdd({
      ...formDataAdd,
      ward: selectedWard
    });
  };

  // ====================================================================================

  const [formDataDetail, setFormDataDetail] = useState({
    name: '',
    customerType: '',
    companyName: '',
    taxID: '',
    phone: '',
    mobile: '',
    email: '',
    website: '',
    tags: '',
    internalNotes: '',
    sellerId: '',
    address: '',
    district: '',
    ward: '',
    province: '',
    zipCode: '',
    country: '',
    customerId: '',
  });


  const handleOpenMenuEdit = async (selectedCustomerId) => { // Thêm async ở đây
    try {
      // Lấy thông tin chi tiết của khách hàng từ API
      const response = await fetch(`https://localhost:7196/api/Customer/DetailCustomer${selectedCustomerId}`);
      const data = await response.json();
      // Cập nhật formDataDetail với dữ liệu của khách hàng
      setFormDataDetail(data);
      // Mở form chỉnh sửa
      setOpenDialog(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết khách hàng:', error);
    }
  };

  
  const handleOpenMenuDetail = async (selectedCustomerId) => { // Thêm async ở đây
    try {
      // Lấy thông tin chi tiết của khách hàng từ API
      const response = await fetch(`https://localhost:7196/api/Customer/DetailCustomer${selectedCustomerId}`);
      const data = await response.json();
      // Cập nhật formDataDetail với dữ liệu của khách hàng
      setFormDataDetail(data);
      // Mở form chỉnh sửa
      setOpenDialogDetail(true);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết khách hàng:', error);
    }
  };
  
  /* Mã JSX render dòng bảng với các ô chứa thông tin người dùng. */
  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>

        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={handleClick} />
        </TableCell>

        <TableCell component="th" scope="row" padding="none">
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={name} src={avatarUrl} />
            <Typography variant="subtitle2" noWrap>
              {name}
            </Typography>
          </Stack>
        </TableCell>

        <TableCell>{companyName}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>{mobile}</TableCell>
        <TableCell>{province}</TableCell>
        <TableCell>{district}</TableCell>
        <TableCell>{address}</TableCell>



     

        <TableCell align="right">
          {/* Một IconButton với biểu tượng 'more-vertical-fill' được sử dụng để mở menu popover. */}
          <IconButton onClick={handleOpenMenu}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={() => handleOpenMenuEdit(customerId)}  >
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={() => handleOpenMenuDetail(customerId)}  >
          <Iconify icon="eva:menu-fill" sx={{ mr: 2 }} />
          Detail
        </MenuItem>

        {/* <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem> */}
      </Popover>

      <Dialog open={openDialog} onClose={handleCloseMenuEdit}>
        <form onSubmit={handleSubmit}>
          <DialogTitle> Update Customer</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please fill information to update customer information
            </DialogContentText>

            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <h3>Customer Information</h3>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Customer Name"
                      id="name"
                      name="name"
                      value={formDataDetail.name}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Company Name"
                      id="companyName"
                      name="companyName"
                      value={formDataDetail.companyName}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="TaxID"
                      id="taxID"
                      name="taxID"
                      value={formDataDetail.taxID}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Mobile"
                      id="mobile"
                      name="mobile"
                      value={formDataDetail.mobile}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Email"
                      id="email"
                      name="email"
                      value={formDataDetail.email}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Tags"
                      id="tags"
                      name="tags"
                      value={formDataDetail.tags}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Website"
                      id="website"
                      name="website"
                      value={formDataDetail.website}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <h3>Customer Address</h3>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formDataDetail.province}
                        onChange={handleCityChange}
                        label= {formDataDetail.province}
                      >
                        <MenuItem value={formDataDetail.province} disabled>{formDataDetail.province}</MenuItem>
                        {cities.map(city => (
                          <MenuItem key={city.Id} value={city.Id}>{city.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>District</InputLabel>
                    
                      <Select
                        value={formDataDetail.district}
                        onChange={handleDistrictChange}
                        label="District"
                      >
                        <MenuItem value={formDataDetail.district} disabled>{formDataDetail.district}</MenuItem>
                        {districts.map(districtItem => (
                          <MenuItem key={districtItem.Id} value={districtItem.Id}>{districtItem.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Wards</InputLabel>
                      <Select
                        value={formDataDetail.ward}
                        onChange={handleWardChange}
                        label="Ward"
                      >
                        <MenuItem value={formDataDetail.ward}  disabled>{formDataDetail.ward}</MenuItem>
                        {wards.map(ward => (
                          <MenuItem key={ward.Id} value={ward.Id}>{ward.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Address"
                      id="address"
                      name="address"
                      value={formDataDetail.address}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Internal Note"
                      id="internalNotes"
                      name="internalNotes"
                      value={formDataDetail.internalNotes}
                      onChange={handleChange}

                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseMenuEdit}>Cancel</Button>
            <Button type="submit">Update Customer</Button>
          </DialogActions>
        </form>
      </Dialog>


      <Dialog open={openDialogDetail} onClose={handleCloseMenuDetail}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Customer Detail</DialogTitle>
          <DialogContent>


            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <h3>Customer Information</h3>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Customer Name"
                      id="name"
                      name="name"
                      value={formDataDetail.name}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Company Name"
                      id="companyName"
                      name="companyName"
                      value={formDataDetail.companyName}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="TaxID"
                      id="taxID"
                      name="taxID"
                      value={formDataDetail.taxID}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Mobile"
                      id="mobile"
                      name="mobile"
                      value={formDataDetail.mobile}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Email"
                      id="email"
                      name="email"
                      value={formDataDetail.email}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Tags"
                      id="tags"
                      name="tags"
                      value={formDataDetail.tags}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Website"
                      id="website"
                      name="website"
                      value={formDataDetail.website}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item>
                    <h3>Customer Address</h3>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formDataDetail.province}
                        onChange={handleCityChange}
                        label= {formDataDetail.province}
                        readOnly
                      >
                        <MenuItem value={formDataDetail.province} disabled>{formDataDetail.province}</MenuItem>
                        {cities.map(city => (
                          <MenuItem key={city.Id} value={city.Id}>{city.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>District</InputLabel>
                    
                      <Select
                        value={formDataDetail.district}
                        onChange={handleDistrictChange}
                        label="District"
                        readOnly
                      >
                        <MenuItem value={formDataDetail.district} disabled>{formDataDetail.district}</MenuItem>
                        {districts.map(districtItem => (
                          <MenuItem key={districtItem.Id} value={districtItem.Id}>{districtItem.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Wards</InputLabel>
                      <Select
                        value={formDataDetail.ward}
                        onChange={handleWardChange}
                        label="Ward"
                        readOnly
                      >
                        <MenuItem value={formDataDetail.ward}  disabled>{formDataDetail.ward}</MenuItem>
                        {wards.map(ward => (
                          <MenuItem key={ward.Id} value={ward.Id}>{ward.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Address"
                      id="address"
                      name="address"
                      value={formDataDetail.address}
                      onChange={handleChange}
                      readOnly

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Internal Note"
                      id="internalNotes"
                      name="internalNotes"
                      value={formDataDetail.internalNotes}
                      onChange={handleChange}
                      readOnly
                      fullWidth
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseMenuDetail}>Cancel</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>



  );
}

UserTableRow.propTypes = {
  avatarUrl: PropTypes.any,
  companyName: PropTypes.any,
  email: PropTypes.any,
  mobile: PropTypes.any,
  province: PropTypes.any,
  district: PropTypes.any,
  address: PropTypes.any,
  customerId: PropTypes.any,
  handleClick: PropTypes.func,
  // isVerified: PropTypes.any,
  name: PropTypes.any,
  role: PropTypes.any,
  selected: PropTypes.any,
  status: PropTypes.string,
};
