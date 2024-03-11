import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import { API_BASE_URL } from '../../../../config'; // Import your API_BASE_URL

import TableNoData from '../table-no-data';
import AddProductDialog from './product-new';
import TableEmptyRows from '../table-empty-rows';
import ProductTableRow from '../product-table-row';
import ProductTableHead from '../product-table-head';
import ProductTableToolbar from '../product-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const handleUpdateProduct = (id) => {
    setProducts(products.filter((row) => row.id !== id));
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Product`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch Products');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error fetching Products:', error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddProduct = async (newProduct) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        setShowSuccessAlert(true);
        fetchProducts();
        setOpenDialog(false);
      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 40 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Tax', key: 'tax', width: 10 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Note', key: 'note', width: 70 },
    ];

    const selectedProducts =
      selected.length > 0 ? products.filter((product) => selected.includes(product.id)) : products;

    selectedProducts.forEach((product) => {
      worksheet.addRow({
        name: product.name,
        type: product.type,
        price: product.price,
        tax: product.tax,
        category: product.categoryName,
        note: product.note,
      });
    });

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.font = { bold: false };
    });

    const borderStyle = { style: 'thin', color: { argb: '00000000' } };
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = borderStyle;
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([buffer]), 'My Products.xlsx');
  };

  // Xử lý sự kiện click để sắp xếp bảng theo cột
  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  // Xử lý sự kiện click để chọn tất cả hoặc bỏ chọn tất cả
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = products.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // Xử lý sự kiện click trên mỗi hàng để chọn hoặc bỏ chọn
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

  // Xử lý thay đổi trang của pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Xử lý thay đổi số hàng trên mỗi trang của pagination
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  // Xử lý filter bằng tên
  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  // Áp dụng filter và sorting cho dữ liệu
  const dataFiltered = applyFilter({
    inputData: products,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  // Kiểm tra nếu không tìm thấy kết quả
  const notFound = !dataFiltered.length && !!filterName;

  return (
    <>
      <Container>
        {/* Tiêu đề trang */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4">Products</Typography>

          {/* Nút tạo sản phẩm mới */}
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Product
          </Button>
        </Stack>

        {/* AddProductDialog component */}
        <AddProductDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onAddProduct={handleAddProduct}
        />

        {/* Card chứa bảng dữ liệu */}
        <Card>
          {/* Thanh công cụ của bảng */}
          <ProductTableToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            onExportToExcel={exportToExcel}
          />

          {/* Scrollbar cho bảng */}
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                {/* Header của bảng */}
                <ProductTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={products.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: 'name', label: 'Name' },
                    { id: 'type', label: 'Type' },
                    { id: 'price', label: 'Price' },
                    { id: 'tax', label: 'Tax' },
                    { id: 'category', label: 'Category' },
                    { id: 'note', label: 'Note' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {/* Dữ liệu của bảng */}
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <ProductTableRow
                        key={row.id}
                        id={row.id}
                        name={row.name}
                        type={row.type}
                        price={row.price}
                        tax={row.tax}
                        note={row.note}
                        categoryName={row.categoryName}
                        userNames={row.userNames}
                        imageUrls={row.imageUrls}
                        selected={selected.indexOf(row.id) !== -1}
                        handleClick={(event) => handleClick(event, row.id)}
                        onUpdate={handleUpdateProduct}
                        fetchProducts={fetchProducts}
                      />
                    ))}

                  {/* Dòng trống cho bảng */}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, products.length)}
                  />

                  {/* Hiển thị khi không tìm thấy kết quả */}
                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          {/* Pagination */}
          <TablePagination
            page={page}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={() => setShowSuccessAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setShowSuccessAlert(false)}
          severity="success"
        >
          Product added successfully!
        </MuiAlert>
      </Snackbar>
    </>
  );
}
