import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

const colorHexMap = {
  Black: "#000000",
  Blue: "#2563eb",
  Brown: "#92400e",
  Green: "#16a34a",
  Grey: "#6b7280",
  Orange: "#f97316",
  Pink: "#fb7185",
  Purple: "#9333ea",
  Red: "#dc2626",
  White: "#ffffff",
  Yellow: "#facc15",
  Cyan: "#06b6d4",
};

// ----------------------------------------------------------------------

export default function ProductColorPicker({ value, options, onChange, sx }) {
  return (
    <RadioGroup row value={value} onChange={onChange}>
      {options.map((option) => (
        <Stack
          key={option.name}
          alignItems="center"
          justifyContent="center"
          sx={{
            m: 1,
            width: 32,
            height: 32,
            borderRadius: 1,
            position: "relative",
            bgcolor: option.name,
            color: "common.white",
            border: (theme) => `1.5px solid ${theme.palette.grey[900]}`,
            ...sx,
          }}
        >
          {value === option.name && (
            <Iconify
              icon="carbon:checkmark"
              sx={{
                color: (theme) => theme.palette.getContrastText(colorHexMap[option.name] || "#ffffff"),
              }}
            />
          )}

          <FormControlLabel
            value={option.name}
            control={<Radio sx={{ display: "none" }} />}
            label=""
            sx={{
              m: 0,
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              position: "absolute",
            }}
          />
        </Stack>
      ))}
    </RadioGroup>
  );
}

ProductColorPicker.propTypes = {
  sx: PropTypes.object,
  value: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.array,
};
