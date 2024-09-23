import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

// ----------------------------------------------------------------------

export default function ProductPrice({ price, priceSale = 0, sx, ...other }) {
  return (
    <Stack direction="row" sx={{ typography: 'subtitle2', ...sx }} {...other}>
      ฿{price}

      {/* <Box
        component="span"
        sx={{
          ml: 0.5,
          color: 'text.disabled',
          textDecoration: 'line-through',
          fontWeight: 'fontWeightMedium',
        }}
      >
        ฿{priceSale > 0 && priceSale}
      </Box> */}
    </Stack>
  );
}

ProductPrice.propTypes = {
  price: PropTypes.number,
  priceSale: PropTypes.number,
  sx: PropTypes.object,
};
