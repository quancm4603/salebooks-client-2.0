import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import Autocomplete from '@mui/material/Autocomplete';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';

import Iconify from 'src/components/iconify';

import { API_BASE_URL } from '../../../../config';

// ----------------------------------------------------------------------

export default function EditProductDialog({
  open,
  onClose,
  onUpdateProduct,
  productData,
  onOpenSnackbar,
}) {
  const [product, setProduct] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  useEffect(() => {
    fetchCategories();
    if (open && productData && !product.id) {
      fetchProduct(productData.id);
    }
  }, [open, product.id, productData]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Category`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        data.sort((a, b) => b.id - a.id);
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleNewCategory = async () => {
    try {
      const token = localStorage.getItem('jwttoken');
      const existingCategory = categories.find((category) => category.name === newCategory);
      if (existingCategory) {
        console.log('Existing category:', existingCategory);
        setProduct({ ...product, categoryName: existingCategory.name });
      } else {
        const response = await fetch(`${API_BASE_URL}/api/Category`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newCategory }),
        });
        if (response.ok) {
          const data = await response.json();

          fetchCategories();

          setCategories((prevCategories) => [...prevCategories, data]);

          setProduct({ ...product, categoryName: data.name });

          setNewCategory(data.name);
        } else {
          console.error('Failed to create category');
        }
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const fetchProduct = async (productId) => {
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Product/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        console.error('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleUpdateProduct = async () => {
    const taxRegex = /^\d+(\.\d{1,2})?$/;

    if (
      !product.name ||
      !product.type ||
      !product.price ||
      !product.categoryName ||
      !taxRegex.test(product.tax)
    ) {
      setShowValidationPopup(true);
      return;
    }
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    try {
      const token = localStorage.getItem('jwttoken');
      const response = await fetch(`${API_BASE_URL}/api/Product/${product.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        fetchProduct(product.id);
        onUpdateProduct(product);
        onClose();
        onOpenSnackbar();
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setLoading(false);
  };

  /*
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, imageUrls: [...product.imageUrls, ...urls] });
  };

  const removeImage = (index) => {
    const updatedImages = product.imageUrls.filter((_, i) => i !== index);
    setProduct({ ...product, imageUrls: updatedImages });
  };
  */

  return (
    <>
      <Dialog open={showValidationPopup} onClose={() => setShowValidationPopup(false)}>
        <DialogTitle>Validation Error</DialogTitle>
        <DialogContent>
          <p>Please fill in all required * fields.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowValidationPopup(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={open} onClose={onClose} maxWidth="md">
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="normal"
            label="Name"
            fullWidth
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <Box marginTop={1}>
            <Autocomplete
              fullWidth
              options={['Consumable', 'Service']}
              renderInput={(params) => <TextField {...params} label="Type" />}
              value={product.type}
              onChange={(event, value) => setProduct({ ...product, type: value })}
            />
          </Box>
          <Box marginTop={2}>
            <Autocomplete
              fullWidth
              options={categories.map((category) => category.name)}
              getOptionLabel={(option) => option}
              value={product.categoryName}
              onChange={(event, value) => setProduct({ ...product, categoryName: value })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category *"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {newCategory &&
                          !categories.some((category) => category.name === newCategory) && (
                            <IconButton onClick={handleNewCategory} edge="end" size="small">
                              <Iconify icon="bi:plus" />
                            </IconButton>
                          )}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              onInputChange={(event, value) => setNewCategory(value)}
            />
          </Box>
          <TextField
            margin="normal"
            label="Price *"
            fullWidth
            name="price"
            value={product.price}
            onChange={(e) => {
              const input = e.target.value;
              const sanitizedInput = input.replace(/\D/g, '');
              handleChange({ target: { name: 'price', value: sanitizedInput } });
            }}
          />
          <TextField
            margin="normal"
            label="Tax *"
            fullWidth
            name="tax"
            value={product.tax}
            onChange={(e) => {
              let input = e.target.value;
              input = input.replace(/[^\d.]/g, '');
              const parts = input.split('.');
              if (parts.length > 1) {
                input = `${parts[0]}.${parts[1].slice(0, 2)}`;
              }
              handleChange({ target: { name: 'tax', value: input } });
            }}
          />
          <TextField
            margin="normal"
            label="Note"
            fullWidth
            name="note"
            multiline
            rows={3}
            value={product.note}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateProduct}
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ position: 'relative' }}
          >
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
            Save Changes
          </Button>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditProductDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onUpdateProduct: PropTypes.func,
  productData: PropTypes.object,
  onOpenSnackbar: PropTypes.func,
};
