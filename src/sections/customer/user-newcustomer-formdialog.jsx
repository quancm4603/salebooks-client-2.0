import * as React from 'react';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Iconify from 'src/components/iconify';
import axios from 'axios';


import { Button, TextField, Dialog, Grid, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import { API_BASE_URL } from '../../../config';


export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
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
    customerId: 0,
  });

  const handleReload = () => {
    window.location.reload();
  };

  // Useeffect Function
  // =====================================================
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
  // =====================================================




  // Handle Open and Close Form
  // =====================================================
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // =====================================================




  // Function Submit and HandleChange of Add Customer Form
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formDataAdd.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Validate mobile number format
    const mobileRegex = /^\d{10}$/; // Adjust as per your requirements
    if (!mobileRegex.test(formDataAdd.mobile)) {
      alert('Please enter a 10-digit mobile number');
      return;
    }

    // If all validations pass, proceed with form submission
    // Add your form submission logic here
    console.log('Form submitted:', formDataAdd);


    try {
      const token = localStorage.getItem('jwttoken');

      // Kiểm tra xem có mã token hay không
      if (!token) {
        throw new Error('Không tìm thấy mã token');
      }

      // Gửi yêu cầu thêm khách hàng mới bằng axios
      const response = await axios.post(`${API_BASE_URL}/api/Customer/AddCustomer`, formDataAdd, {

        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Kiểm tra xem yêu cầu có thành công hay không
      if (response.status === 200) {
        console.log('Customer added successfully:', response.data);

        // Đóng dialog sau khi thêm khách hàng
        window.setTimeout(() => {
          setOpen(false);
        }, 1000); // 1000 milliseconds = 1 giây

        // Hiển thị thông báo thành công
        Swal.fire({
          title: 'Success',
          text: 'Customer added successfully',
          icon: 'success',
          timer: 30000, // Thời gian hiển thị thông báo (ms)
          timerProgressBar: true, // Hiển thị thanh tiến trình
          showConfirmButton: true, // Ẩn nút xác nhận
        }).then((result) => {
          // Kiểm tra nếu người dùng đã ấn nút OK
          if (result.isConfirmed) {
            // Tải lại trang để cập nhật dữ liệu
            window.location.reload();
          }
        });
      } else {
        console.error('Failed to add customer');
      }
    } catch (error) {
      console.error('Failed to add customer:', error.message);

      // Đóng dialog sau khi thêm khách hàng
      window.setTimeout(() => {
        setOpen(false);
      }, 1000); // 1000 milliseconds = 1 giây

      // Hiển thị thông báo lỗi
      Swal.fire({
        title: 'Error',
        text: 'An error occurred while adding new customer. Please try again.',
        icon: 'error',
        timer: 30000, // Thời gian hiển thị thông báo (ms)
        timerProgressBar: true, // Hiển thị thanh tiến trình
        showConfirmButton: true, // Ẩn nút xác nhận
      });
    }
  };

  // Validate email and phone
  const handleChange = (e) => {

    setFormDataAdd({ ...formDataAdd, [e.target.name]: e.target.value });
  };
  // =====================================================




  // Handle District
  // =====================================================
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);


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
    const selectedDistrict = districts.find(district => district.Id === selectedDistrictId);

    if (selectedDistrict) {
      setWards(selectedDistrict.Wards);
      setFormDataAdd({
        ...formDataAdd,
        district: selectedDistrict.Name
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
  // =====================================================







  return (
    <>
      <Button variant="contained" onClick={handleClickOpen} color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
        New Customer
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ style: { width: '1000px', maxWidth: '90vw' } }} >

        <form onSubmit={handleSubmit}>
          <DialogTitle style={{ maxHeight: '4vw' }} > <h2>NEW CUSTOMER</h2> </DialogTitle>
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
                      value={formDataAdd.name}
                      onChange={handleChange}
                      required
                      // Them handle mini
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Company Name"
                      id="companyName"
                      name="companyName"
                      value={formDataAdd.companyName}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="TaxID"
                      id="taxID"
                      name="taxID"
                      value={formDataAdd.taxID}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Mobile"
                      id="mobile"
                      name="mobile"
                      value={formDataAdd.mobile}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Email"
                      id="email"
                      name="email"
                      value={formDataAdd.email}
                      onChange={handleChange}
                      required
                      fullWidth
                    />
                  </Grid>
                  <Grid item>
                    <TextField
                      type="text"
                      label="Tags"
                      id="tags"
                      name="tags"
                      value={formDataAdd.tags}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Website"
                      id="website"
                      name="website"
                      value={formDataAdd.website}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>

                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Grid container spacing={2} direction="column">
                  <Grid item style={{ maxHeight: '4vw' }} >
                    <h3>Customer Address</h3>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Province</InputLabel>
                      <Select
                        value={formDataAdd.province}
                        onChange={handleCityChange}
                        label="Province"
                      >
                        <MenuItem value={formDataAdd.province} disabled>{formDataAdd.province}</MenuItem>
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
                        value={formDataAdd.district}
                        onChange={handleDistrictChange}
                        label="District"
                      >
                        <MenuItem value={formDataAdd.district} disabled>{formDataAdd.district}</MenuItem>
                        {districts.map(district => (
                          <MenuItem key={district.Id} value={district.Id}>{district.Name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <FormControl fullWidth>
                      <InputLabel>Wards</InputLabel>
                      <Select
                        value={formDataAdd.ward}
                        onChange={handleWardChange}
                        label="Ward"
                      >
                        <MenuItem value={formDataAdd.ward} disabled>{formDataAdd.ward}</MenuItem>
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
                      value={formDataAdd.address}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                    <TextField
                      type="text"
                      label="Internal Note"
                      id="internalNotes"
                      name="internalNotes"
                      value={formDataAdd.internalNotes}
                      onChange={handleChange}
                      required

                      fullWidth
                    />
                  </Grid>

                  <Grid item>
                  <DialogActions>
                    {/* <Button onClick={handleClose}>Cancel</Button> */}
                    <Button variant="contained" onClick={handleClose} color="error" size="medium" >
                      Cancel
                    </Button>

                    {/* <Button type="submit">Add New Customer</Button> */}
                    <Button variant="contained" type="submit" color="success" size="medium">
                      Add New Customer
                    </Button>
                  </DialogActions>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>

          </DialogContent>


        </form>

      </Dialog>
    </>
  );
}
