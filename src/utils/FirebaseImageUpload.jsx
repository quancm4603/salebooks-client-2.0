import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { Button, Box } from '@mui/material';

import { imageDb } from './Config';

function FirebaseImageUpload({ showImageUpload, onCloseImageUpload, onChange }) {
  const [img, setImg] = useState('');
  const [imgUrl, setImgUrl] = useState([]);

  const handleClick = () => {
    if (img !== null) {
      const imgRef = ref(imageDb, `files/${v4()}`);
      uploadBytes(imgRef, img).then((value) => {
        console.log(value);
        getDownloadURL(value.ref).then((url) => {
          setImgUrl((data) => [...data, url]);
          onChange(imgUrl);
        });
      });
    }
  };

  useEffect(() => {
    if (showImageUpload) {
      listAll(ref(imageDb, 'files')).then((imgs) => {
        console.log(imgs);
        imgs.items.forEach((val) => {
          getDownloadURL(val).then((url) => {
            setImgUrl((data) => [...data, url]);
          });
        });
      });
    }
  }, [showImageUpload]);

  return (
    <>
      <input type="file" onChange={(e) => setImg(e.target.files[0])} />
      <button type="button" onClick={handleClick}>
        Upload
      </button>
      <br />
      {imgUrl.map((dataVal) => (
        <Box key={dataVal}>
          <img src={dataVal} height="200px" width="200px" alt="uploaded" />
          <br />
        </Box>
      ))}
      <Button onClick={onCloseImageUpload} variant="outlined" color="primary">
        Close Image Upload
      </Button>
    </>
  );
}

FirebaseImageUpload.propTypes = {
  showImageUpload: PropTypes.bool.isRequired,
  onCloseImageUpload: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FirebaseImageUpload;