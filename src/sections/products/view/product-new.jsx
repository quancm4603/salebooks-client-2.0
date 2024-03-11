import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
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

export default function AddProductDialog({ open, onClose, onAddProduct }) {
  const [product, setProduct] = useState({
    id: 0,
    name: '',
    type: '',
    price: '',
    tax: '',
    note: '',
    categoryName: '',
    imageUrls: [],
  });

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [loading, setLoading] = useState(false); // State for controlling the visibility of progress indicator

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

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setProduct({ ...product, imageUrls: [...product.imageUrls, ...urls] });
  };

  const removeImage = (index) => {
    const updatedImages = product.imageUrls.filter((_, i) => i !== index);
    setProduct({ ...product, imageUrls: updatedImages });
  };

  const handleAddProduct = async () => {
    if (!product.name || !product.type || !product.price || !product.categoryName || !product.tax) {
      setShowValidationPopup(true);
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    onAddProduct(product);
    setProduct({
      id: 0,
      name: '',
      type: '',
      price: '',
      tax: '',
      note: '',
      categoryName: '',
      imageUrls: [],
    });
    setLoading(false);
    onClose();
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
        <DialogTitle>New Product</DialogTitle>
        <DialogContent dividers key={product.id}>
          <TextField
            autoFocus
            margin="normal"
            label="Name *"
            fullWidth
            name="name"
            value={product.name}
            onChange={handleChange}
          />
          <Box marginTop={1}>
            <Autocomplete
              fullWidth
              options={['Consumable', 'Service']}
              renderInput={(params) => <TextField {...params} label="Type *" />}
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
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            label="Tax *"
            fullWidth
            name="tax"
            value={product.tax}
            onChange={handleChange}
          />
          <Button component="label" variant="contained">
            Upload Images
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
          </Button>
          <Box display="flex" flexWrap="wrap">
            {product.imageUrls.map((url, index) => (
              <Box key={index} sx={{ position: 'relative', m: 1 }}>
                <Avatar alt={`Product ${index + 1}`} src={url} sx={{ width: 100, height: 100 }} />
                <IconButton
                  onClick={() => removeImage(index)}
                  size="small"
                  sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                >
                  <Iconify icon="bi:trash" />
                </IconButton>
              </Box>
            ))}
          </Box>
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
            onClick={handleAddProduct}
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
            Add Product
          </Button>
          <Button onClick={onClose} variant="outlined" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

AddProductDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAddProduct: PropTypes.func,
};
