import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Input from '@mui/material/Input';

import * as XLSX from 'xlsx';

import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import Swal from 'sweetalert2'

import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Autocomplete, FormControl, InputLabel, Select, MenuItem, TableHead, TableRow, TableCell, Paper, } from '@mui/material';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { API_BASE_URL } from '../../../../config';

import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import QuotationTableHead from '../quotations-table-head';
import QuotationTableRow from '../quotations-table-row';
import QuotationTableToolbar from '../quotations-table-toolbar';

import { emptyRows, applyFilter, getComparator } from '../utils';

export default function QuotationsView() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const navigate = useNavigate();
  const isMounted = useRef(true);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [quotations, setQuotations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuotation, setNewQuotation] = useState({
    customerId: '',
    products: [{ productId: '', quantity: 1, subtotal: 0 }],
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [currentQuotationDetails, setCurrentQuotationDetails] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchQuotations = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        const response = await fetch(`${API_BASE_URL}/api/Quotation`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setQuotations(data);
        } else {
          console.error('Failed to fetch quotations');
        }
      } catch (error) {
        console.error('Error fetching quotations:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        const response = await fetch(`${API_BASE_URL}/api/Customer/GetCustomer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setCustomers(data);
        } else {
          console.error('Failed to fetch customers');
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('jwttoken');
        const response = await fetch(`${API_BASE_URL}/api/Products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchQuotations();
    fetchCustomers();
    fetchProducts();
  }, [navigate]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = quotations.map((n) => n.id);
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

  // Table quotation data
  const dataFiltered = applyFilter({
    inputData: quotations,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  // Fill status
  const updateQuotationStatus = (quotationId, newStatus) => {
    setQuotations((prevQuotations) =>
      prevQuotations.map((quotation) =>
        quotation.id === quotationId ? { ...quotation, status: newStatus } : quotation
      )
    );
  };

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setQuotations(data);
      } else {
        console.error('Failed to fetch quotations');
      }
    } catch (error) {
      console.error('Error fetching quotations:', error);
    }
  };

  // Create quotation
  const handleCreateQuotation = async () => {
    if (!newQuotation.customerId || !newQuotation.products.some(product => product.productId)) {
      console.error('Invalid quotation. CustomerId and at least one product are required.');
      setOpenCreateDialog(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Invalid quotation!",
      });
      return;
    }

    const uniqueProductIds = new Set();

    const hasDuplicates = newQuotation.products.some(product => {
      if (uniqueProductIds.has(product.productId)) {
        return true;
      }
      uniqueProductIds.add(product.productId);
      return false;
    });

    if (hasDuplicates) {
      console.error('Invalid quotation. Duplicate products are not allowed.');
      setOpenCreateDialog(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Duplicate products are not allowed!",
      });
      return;
    }

    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Quotation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: newQuotation.customerId,
          products: newQuotation.products,
        }),
      });

      if (response.ok) {
        const createdQuotation = await response.json();
        setQuotations((prevQuotations) => [...prevQuotations, createdQuotation]);
        fetchQuotations();
        setOpenCreateDialog(false);
        Swal.fire({
          title: "Added!",
          text: "Addquotation successfully!",
          icon: "success"
        });
      } else {
        const errorText = await response.text();
        console.error('Failed to create quotation:', errorText);
        setOpenCreateDialog(false);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to create quotation!",
        });
      }
    } catch (error) {
      console.error('Error creating quotation:', error);
    }

    setNewQuotation({
      customerId: '',
      products: [{ productId: '', quantity: 1 }],
    });

    setShowCreateForm(false);
  };

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  const calculateSubtotal = (productId, quantity) => {
    const productPrice = getProductPriceById(productId);
    return quantity * productPrice;
  };

  const getProductPriceById = (productId) => {
    const foundProduct = products.find((productOption) => productOption.id === productId);
    return foundProduct ? foundProduct.price : 0;
  };

  const handleRemoveProduct = (index) => {
    setNewQuotation((prevQuotation) => {
      const newProducts = [...prevQuotation.products];
      newProducts.splice(index, 1);
      return {
        ...prevQuotation,
        products: newProducts,
      };
    });
  };

  const handleProductChange = (index, key, value) => {
    setNewQuotation((prevQuotation) => {
      const updatedProducts = prevQuotation.products.map((product, i) =>
        i === index
          ? { ...product, [key]: value, subtotal: calculateSubtotal(product.productId, value) }
          : product
      );

      return { ...prevQuotation, products: updatedProducts };
    });
  };

  const handleAddProduct = () => {
    setNewQuotation((prevQuotation) => ({
      ...prevQuotation,
      products: [...prevQuotation.products, { productId: '', quantity: 1, subtotal: 0 }],
    }));
  };

  // Total in quotationdetail
  const calculateTotal = () =>
    newQuotation.products.reduce((qtotal, product) => {
      const price = getProductPriceById(product.productId);
      const subtotal = price * product.quantity;
      return qtotal + subtotal;
    }, 0);

  // Total in quotationdetail including tax
  const calculateTotalWithTax = () =>
    newQuotation.products.reduce((qtotal, product) => {
      const price = getProductPriceById(product.productId);
      const productTax = getProductTaxById(product.productId);
      const subtotal = (price * (1 + productTax)) * product.quantity;
      return qtotal + subtotal;
    }, 0);

  const getProductTaxById = (productId) => {
    const foundProduct = products.find((productOption) => productOption.id === productId);
    return foundProduct ? foundProduct.tax : 0;
  };

  // Export excel
  const handleExportToExcel = async () => {
    const wb = XLSX.utils.book_new();
    const allData = [];

    await Promise.all(
      selected.map(async (quotationId) => {
        const quotation = quotations.find((q) => q.id === quotationId);
        const quotationDetails = await fetchQuotationDetails(quotationId);

        if (quotation && quotationDetails && quotationDetails.length > 0) {
          const quotationData = {
            Customer: quotation.customer.name,
            Status: quotation.status,
            CreateAt: quotation.createdAt,
            Total: quotation.total,
          };

          const detailsData = quotationDetails.map((detail) => ({
            Product: detail.product.name,
            Quantity: detail.quantity,
            Subtotal: detail.subTotal,
            Tax: detail.product.tax
          }));

          allData.push(quotationData, ...detailsData);
        } else {
          console.error(`Failed to fetch quotation details for ID ${quotationId}`);
        }
      })
    );

    const ws = XLSX.utils.json_to_sheet(allData);
    XLSX.utils.book_append_sheet(wb, ws, 'Quotations_With_Details');
    XLSX.writeFile(wb, 'selected_quotations_with_details.xlsx');
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
        return data;
      }

      console.error(`Failed to fetch quotation details for ID ${quotationId}`);
    } catch (error) {
      console.error('Error fetching quotation details:', error);
    }

    return [];
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Quotations</Typography>

        <Button onClick={handleOpenCreateDialog} variant="contained" color="inherit" startIcon={<Iconify icon="eva:plus-fill" />}>
          New Quotation
        </Button>
      </Stack>

      <Card>
        <QuotationTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onExportToExcel={handleExportToExcel}  // Pass the function to handle export
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <QuotationTableHead
                order={order}
                orderBy={orderBy}
                rowCount={quotations.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'customer.name', label: 'Customer' },
                  { id: 'status', label: 'Status' },
                  { id: 'createAt', label: 'CreateAt' },
                  { id: 'price', label: 'Total($)' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <QuotationTableRow
                      key={row.id}
                      id={row.id}
                      name={row.customer.name}
                      status={row.status}
                      createAt={row.createdAt}
                      price={row.total}
                      updateQuotationStatus={updateQuotationStatus}
                      selected={selected.indexOf(row.id) !== -1}
                      handleClick={(event) => handleClick(event, row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, quotations.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={quotations.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>

      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="md" fullWidth>
        <DialogTitle>Create Quotation</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="outlined" margin="dense">
            <Autocomplete
              options={customers}
              getOptionLabel={(customer) => customer.name}
              value={
                newQuotation.customerId
                  ? customers.find((customer) => customer.id === newQuotation.customerId)
                  : null
              }
              onChange={(event, newValue) => {
                setNewQuotation({
                  ...newQuotation,
                  customerId: newValue ? newValue.id : '',
                });
              }}
              renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
            />
          </FormControl>

          <TableContainer component={Paper} style={{ marginTop: '16px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>Price($)</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>SubTotal($)</TableCell>
                  <TableCell>Tax</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newQuotation.products.map((product, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Autocomplete
                        options={products}
                        getOptionLabel={(productOption) => productOption.name}
                        value={
                          product.productId
                            ? products.find((productOption) => productOption.id === product.productId)
                            : null
                        }
                        onChange={(event, newValue) => {
                          handleProductChange(index, 'productId', newValue ? newValue.id : '');
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="Product" variant="outlined" />
                        )}
                      />
                    </TableCell>

                    <TableCell>{`${getProductPriceById(product.productId)}VNĐ`}</TableCell>

                    <TableCell>
                      <TextField
                        type="number"
                        min="1"
                        value={product.quantity}
                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                        variant="outlined"
                        style={{ width: '80px' }}
                      />
                    </TableCell>

                    <TableCell>{`${calculateSubtotal(product.productId, product.quantity)}VNĐ`}</TableCell>

                    <TableCell>{`${getProductTaxById(product.productId) * 100}%`}</TableCell>

                    <TableCell onClick={() => handleRemoveProduct(index)}>
                      <Tooltip title="Cancel">
                        <IconButton >
                          <Iconify icon="eva-close-fill" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleAddProduct}
            style={{ marginTop: '8px' }}
          >
            More
          </Button>
        </DialogContent>
        <DialogActions>
          <div style={{ flexGrow: 1, marginLeft: '16px' }}>
            <Typography variant="body1">
              {`Total without tax: ${calculateTotal()}VNĐ`}
            </Typography>
            <Typography variant="body1">
              {`Total with tax: ${calculateTotalWithTax()}VNĐ`}
            </Typography>
          </div>
          <Button onClick={handleCloseCreateDialog} variant="outlined" color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={handleCreateQuotation}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

