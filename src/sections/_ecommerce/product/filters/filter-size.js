import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import { Button, Grid, Paper } from "@mui/material";
import { useState } from "react";

// ----------------------------------------------------------------------

export default function FilterSize({ selectedSizes, onChangeSize, sizes, ...other }) {
  // const [selected, setSelected] = useState(selectedSizes);

  // const handleSelectSize = (size) => {
  //   let newSelected;
  //   if (selected.includes(size)) {
  //     newSelected = selected.filter((s) => s !== size);
  //   } else {
  //     newSelected = [...selected, size];
  //   }
  //   setSelected(newSelected);
  //   onChangeSize(newSelected);
  // };

  return (
    <Stack {...other}>
      <Grid container spacing={2}>
        {sizes.map((size, index) => (
          <Grid item xs={4} key={size}>
            <Button
              variant={selectedSizes.includes(size) ? "contained" : "outlined"}
              color={selectedSizes.includes(size) ? "primary" : "inherit"}
              onClick={() => onChangeSize(size)}
              fullWidth
            >
              {size}
            </Button>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

FilterSize.propTypes = {
  selectedSizes: PropTypes.arrayOf(PropTypes.number),
  onChangeSize: PropTypes.func,
};

FilterSize.defaultProps = {
  selectedSizes: [],
  onChangeSize: () => {},
};
