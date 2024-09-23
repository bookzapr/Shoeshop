import PropTypes from "prop-types";

import Toolbar from "@mui/material/Toolbar";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function OrderTableToolbar({ filterOrder, onFilterOrder }) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: "flex",
        justifyContent: "space-between",
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      <OutlinedInput
        value={filterOrder}
        onChange={onFilterOrder}
        placeholder="Search OrderId..."
        startAdornment={
          <InputAdornment position="start">
            <Iconify
              icon="eva:search-fill"
              sx={{ color: "text.disabled", width: 20, height: 20 }}
            />
          </InputAdornment>
        }
      />
    </Toolbar>
  );
}

OrderTableToolbar.propTypes = {
  filterOrder: PropTypes.string,
  onFilterOrder: PropTypes.func,
};
