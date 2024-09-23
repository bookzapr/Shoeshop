import React, { forwardRef, useCallback } from "react";
import PropTypes from "prop-types";
import Stack from "@mui/material/Stack";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import Iconify from "../../../../components/iconify";

// eslint-disable-next-line react/display-name
const ColorPicker = forwardRef(
  ({ colorOptions, selected, onSelectColor, sx, ...other }, ref) => {
    const handleSelect = useCallback(
      (option) => {
        onSelectColor(option); // Pass the entire option object
      },
      [onSelectColor]
    );

    return (
      <Stack
        ref={ref}
        direction="row"
        flexWrap="wrap"
        spacing={2}
        sx={{ ...sx }}
        {...other}
      >
        {colorOptions.map((option) => {
          const isSelected = selected.includes(option.label); // Check by label

          return (
            <Stack key={option.label} alignItems="center" spacing={1} width={40}>
              <ButtonBase
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: option.color,
                  border: (theme) =>
                    `solid 1px ${alpha(theme.palette.grey[600], 0.16)}`,
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
                onClick={() => handleSelect(option)}
              >
                {isSelected && (
                  <Iconify
                    icon="eva:checkmark-fill"
                    sx={{
                      color: (theme) =>
                        theme.palette.getContrastText(option.color),
                    }}
                  />
                )}
              </ButtonBase>
              <Typography variant="caption">{option.label}</Typography>
            </Stack>
          );
        })}
      </Stack>
    );
  }
);

ColorPicker.propTypes = {
  colorOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
  onSelectColor: PropTypes.func.isRequired,
  selected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  sx: PropTypes.object,
};

export default ColorPicker;
