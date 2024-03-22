import { useState, useEffect, useCallback } from 'react';
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
import Label from 'src/components/label';

import { Button, TextField, Dialog, Grid, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CustomerOrderHistory from './customer-order-column'; // Đường dẫn tới component CustomerOrderHistory
import { API_BASE_URL } from '../../../config';




// ===========================================================================

/*  định nghĩa một thành phần React có tên là UserTableRow được sử dụng để hiển thị một dòng của bảng chứa thông tin người dùng. */

// Get data from dad component : customerview
// ===========================================================================
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
  customerId,
  fetchCustomers
}) {


  const [open, setOpen] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDetail, setOpenDialogDetail] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);


  
  // UseEffect Function 
  // ===========================================================================
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
  //       setCities(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };
  //   fetchData();
  //   if (customerId != null) {
  //     fetchTotalOrderValue(customerId);
  //   }

  // }, [customerId, fetchTotalOrderValue]);


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
    if (customerId != null) {
      fetchTotalOrderValue(customerId); // Sử dụng fetchTotalOrderValue trực tiếp ở đây
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]); 
  // ===========================================================================


  // Function for PopUp Detail and Edit Customer
  // ===========================================================================
  /* Hàm handleOpenMenu thiết lập phần tử gốc cho menu popover là mục tiêu hiện tại. */
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };
  /* Hàm handleCloseMenu đóng menu popover. */
  const handleCloseMenu = () => {
    setOpen(null);
  };
  // ===========================================================================


  // Form and Function for Add New Customer
  // ===========================================================================
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
      const response = await axios.post(`${API_BASE_URL}/api/Customer/AddCustomerX`, formDataAdd, {
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
  // ===========================================================================


// Form and Function for Update Customer
// ===========================================================================

 const handleSubmitUpdate = async (e) => {
  e.preventDefault();
  try {
    // Đảm bảo rằng bạn đã có mã thông báo truy cập trong phần đầu tiên của mã này.
    const token = localStorage.getItem('jwttoken');

    const response = await axios.post(`${API_BASE_URL}/api/Customer/UpdateCustomer`, formDataDetail, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    console.log('Customer updated successfully:', response.data);

    window.setTimeout(() => {
      setOpenDialog(false);
      fetchCustomers();
    }, 200); // 1000 milliseconds = 1 giây

    Swal.fire({
      title: 'Success',
      text: 'Customer updated successfully',
      icon: 'success',
      timer: 3000, // Thời gian hiển thị thông báo (ms)
      timerProgressBar: true, // Hiển thị thanh tiến trình
      showConfirmButton: false // Ẩn nút xác nhận
    });

  } catch (error) {
    console.error('Failed to update customer:', error.message);

    window.setTimeout(() => {
      setOpenDialogDetail(false);
      fetchCustomers();
    }, 200); // 1000 milliseconds = 1 giây

    Swal.fire({
      title: "Error",
      text: "An error occurred while updating customer. Please try again.",
      icon: "error",
      timer: 3000, // Thời gian hiển thị thông báo (ms)
      timerProgressBar: true, // Hiển thị thanh tiến trình
      showConfirmButton: false // Ẩn nút xác nhận
    });

  }
};

const handleChangeUpdate = (e) => {
  setFormDataDetail({ ...formDataDetail, [e.target.name]: e.target.value });
};

const handleCloseMenuEdit = () => {
  setOpenDialog(false);
};



// Form and Function for Get Spend of Quarter 
// ===========================================================================

  const getCurrentQuarter = useCallback(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    let quarter;

    if (currentMonth >= 1 && currentMonth <= 3) {
      quarter = 1;
    } else if (currentMonth >= 4 && currentMonth <= 6) {
      quarter = 2;
    } else if (currentMonth >= 7 && currentMonth <= 9) {
      quarter = 3;
    } else {
      quarter = 4;
    }

    return { currentYear, quarter };
  }, []);

  const [totalOrderValue, setTotalOrderValue] = useState(null);

  const fetchTotalOrderValue = useCallback(async (customerIdV) => {
    try {
      const { currentYear, quarter } = getCurrentQuarter();
      const token = localStorage.getItem('jwttoken');

      const response = await axios.put(`${API_BASE_URL}/api/Customer/TotalOrderQuarter?customerId=${customerIdV}&year=${currentYear}&quarter=${quarter}`,
        {}, // No data to send in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) { // Check for successful status code
        const data = response.data; // No need for response.json(), axios handles it
        console.log(data);
        setTotalOrderValue(data);
      } else {
        console.error('Failed to fetch setCustomers');
      }
    } catch (error) {
      console.error('Error fetching total order value:', error);
    }
  }, [getCurrentQuarter]);

  const fetchTotalOrderValueCallback = useCallback(fetchTotalOrderValue, [fetchTotalOrderValue]);

// ===========================================================================



// Function handle get City District and Ward of Add New Customer
// ===========================================================================

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

// =========================================================================



// Form And Function For Get Data Detail
// ==========================================================================
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

  const handleOpenMenuEdit = async (selectedCustomerId) => {
    try {
      const token = localStorage.getItem('jwttoken');
  
      // Kiểm tra xem có mã token hay không
      if (!token) {
        throw new Error('Không tìm thấy mã token');
      }
  
      // Gửi yêu cầu lấy thông tin chi tiết của khách hàng bằng axios
      const response = await axios.get(`${API_BASE_URL}/api/Customer/DetailCustomer/${selectedCustomerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Kiểm tra xem yêu cầu có thành công hay không
      if (response.status === 200) {
        const data = response.data;
        setFormDataDetail(data);
        setOpenDialog(true);
      } else {
        console.error('Failed to fetch setCustomers');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết khách hàng:', error.message);
    }
  };
  
  const handleOpenMenuDetail = async (selectedCustomerId) => {
    try {
      const token = localStorage.getItem('jwttoken');
  
      // Kiểm tra xem có mã token hay không
      if (!token) {
        throw new Error('Không tìm thấy mã token');
      }
  
      // Gửi yêu cầu lấy thông tin chi tiết của khách hàng bằng axios
      const response = await axios.get(`${API_BASE_URL}/api/Customer/DetailCustomer/${selectedCustomerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Kiểm tra xem yêu cầu có thành công hay không
      if (response.status === 200) {
        const data = response.data;
        setFormDataDetail(data);
        setOpenDialogDetail(true);
      } else {
        console.error('Failed to fetch setCustomers');
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết khách hàng:', error.message);
    }
  };
  
  const handleCloseMenuDetail = () => {
    setOpenDialogDetail(false);
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
        <TableCell>{totalOrderValue !== null ? totalOrderValue.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : 'Loading...'}</TableCell> {/*  */}

        {/*  */}
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

      </Popover>

      {/* // Form Edit For Customer
      // =========================================================================== */}


      
      <Dialog
        open={openDialog}
        onClose={handleCloseMenuEdit}
        PaperProps={{ style: { width: '1000px', maxWidth: '90vw' } }} >

        <form onSubmit={handleSubmitUpdate}>
          <DialogTitle style={{ maxHeight: '4vw' }} > <h2>UPDATE CUSTOMER</h2> </DialogTitle>

          <DialogContent style={{ margin: 0 }} >
           
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                <Grid item style={{ maxHeight: '4vw' }}  >
                    <h3>Customer Information</h3>
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Customer Name"
                      id="name"
                      name="name"
                      value={formDataDetail.name}
                      onChange={handleChangeUpdate}
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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

                      fullWidth
                    />
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                <Grid item style={{ maxHeight: '4vw' }}  >
                    <h3>Customer Address</h3>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formDataDetail.province}
                        onChange={handleCityChange}
                        label={formDataDetail.province}
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
                        <MenuItem value={formDataDetail.ward} disabled>{formDataDetail.ward}</MenuItem>
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
                      onChange={handleChangeUpdate}

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
                      onChange={handleChangeUpdate}

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                  <DialogActions>
                    {/* <Button onClick={handleClose}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleCloseMenuEdit} color="error" size="medium" >
                      Cancel
                    </Button>

                    {/* <Button type="submit">Add New Customer</Button> */}
                    <Button variant="contained" type="submit" color="success" size="medium">
                      Update Customer
                    </Button>
                  </DialogActions>
                  </Grid>


                </Grid>
              </Grid>
            </Grid>
          </DialogContent>

         
        </form>
      </Dialog>

      {/* // =========================================================================== */}





      {/* // Form Detail Customer
      // ===========================================================================  */}

      <Dialog open={openDialogDetail} onClose={handleCloseMenuDetail} PaperProps={{ style: { width: '1000px', maxWidth: '90vw', maxHeight: '90vh'  } }} >
        <form onSubmit={handleSubmit}>
          
          <DialogTitle style={{ maxHeight: '4vw', marginTop: 0 }} > <h2>CUSTOMER DETAIL</h2> </DialogTitle>

          <DialogContent>


            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Grid container spacing={2} direction="column">
                <Grid item style={{ maxHeight: '4vw' }}  >
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

              <Grid item xs={4}>
                <Grid container spacing={2} direction="column">
                <Grid item style={{ maxHeight: '4vw' }}  >
                    <h3>Customer Address</h3>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formDataDetail.province}
                        onChange={handleCityChange}
                        label={formDataDetail.province}
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
                        <MenuItem value={formDataDetail.ward} disabled>{formDataDetail.ward}</MenuItem>
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

              <Grid item xs={4}>
                <Grid container spacing={2} direction="column">
                <Grid item style={{ maxHeight: '4vw' }}  >
                    <h3>Customer Order History</h3>
                    <CustomerOrderHistory customerId={customerId} />
                  </Grid>
                </Grid>
              </Grid>

            </Grid>
          </DialogContent>

          <DialogActions>
            <Button variant="contained" onClick={handleCloseMenuDetail} color="error" size="medium" >
                      Cancel
                    </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* // =========================================================================== */}

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
  fetchCustomers: PropTypes.func,

};
