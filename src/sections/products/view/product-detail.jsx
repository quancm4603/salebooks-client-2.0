import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { API_BASE_URL } from '../../../../config';

// ----------------------------------------------------------------------

const fetchProductDetails = async (productId) => {
  try {
    const token = localStorage.getItem('jwttoken');
    const response = await fetch(`${API_BASE_URL}/api/Product/${productId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch product details');
      throw Error;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Response is not in JSON format');
      throw Error;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export default function ProductDetailDialog({ open, onClose, productId }) {
  const [productDetails, setProductDetails] = useState(null);
  const [, setError] = useState(null);

  useEffect(() => {
    if (open && productId) {
      fetchProductDetails(productId)
        .then((data) => {
          setProductDetails(data);
        })
        .catch((fetchError) => {
          setError(fetchError.message);
        });
    }
  }, [open, productId]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Product Details</DialogTitle>
      <DialogContent style={{ display: 'flex' }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
            {productDetails?.imageUrls.map((imageUrl, index) => (
              <img
                key={index}
                src={
                  imageUrl ||
                  'https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.15752-9/430854051_3569145256631762_695375072275222205_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=6riD3q6WO9gAX-mMJM_&_nc_oc=AQlgwn7LYnzIVqUkmhm9YSdQVgDjsvygGRfa4Q6mzMlduPLd5sv0ws7qMP06XzvApQc&_nc_ht=scontent.fsgn2-7.fna&oh=03_AdRKs53PeBPhYq_hGkGgyjgexb2mMaDI4LEPV2hzJ4MlZA&oe=66171F1F'
                } // Provide a placeholder URL here
                alt=""
                style={{ width: 200, height: 200, marginRight: 10 }}
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src =
                    'https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.15752-9/430854051_3569145256631762_695375072275222205_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=6riD3q6WO9gAX-mMJM_&_nc_oc=AQlgwn7LYnzIVqUkmhm9YSdQVgDjsvygGRfa4Q6mzMlduPLd5sv0ws7qMP06XzvApQc&_nc_ht=scontent.fsgn2-7.fna&oh=03_AdRKs53PeBPhYq_hGkGgyjgexb2mMaDI4LEPV2hzJ4MlZA&oe=66171F1F'; // Fallback to placeholder if image fails to load
                }}
              />
            ))}
            {(!productDetails || productDetails.imageUrls.length === 0) && (
              <img
                src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t1.15752-9/430854051_3569145256631762_695375072275222205_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=5f2048&_nc_ohc=6riD3q6WO9gAX-mMJM_&_nc_oc=AQlgwn7LYnzIVqUkmhm9YSdQVgDjsvygGRfa4Q6mzMlduPLd5sv0ws7qMP06XzvApQc&_nc_ht=scontent.fsgn2-7.fna&oh=03_AdRKs53PeBPhYq_hGkGgyjgexb2mMaDI4LEPV2hzJ4MlZA&oe=66171F1F" // Placeholder for no images
                alt=""
                style={{ width: 200, height: 200, marginRight: 10 }}
              />
            )}
          </div>
        </div>
        <div style={{ flex: 1, marginLeft: 10 }}>
          {productDetails && (
            <>
              <TextField
                fullWidth
                label="Name"
                value={productDetails.name}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Type"
                value={productDetails.type}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Price"
                value={productDetails.price}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Tax"
                value={productDetails.tax}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Category"
                value={productDetails.categoryName}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Note"
                multiline
                rows={3}
                value={productDetails.note}
                InputProps={{ readOnly: true }}
                margin="normal"
              />
            </>
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ProductDetailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  productId: PropTypes.number,
};
