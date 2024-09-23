import * as React from "react";
import IconButton from "@mui/material/IconButton";
// import AddIcon from '@mui/icons-material/Add';
// import RemoveIcon from '@mui/icons-material/Remove';
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Iconify from "../iconify";
import { useResponsive } from "src/hooks/use-responsive";

export default function Counter({
  count,
  setCount,
  maxCount,
  increaseQuantity,
  decreaseQuantity,
  isCart,
  isEdit,
}) {
  const mdUp = useResponsive("up", "md");

  const handleIncrement = () => {
    isCart && increaseQuantity();
    setCount((prevCount) => (prevCount < maxCount ? prevCount + 1 : maxCount));
  };

  const handleDecrement = () => {
    isCart && decreaseQuantity();
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  };

  const handleChange = (event) => {
    const value = event.target.value;

    // Allow the input to be empty temporarily
    if (value === "") {
      setCount(value);
    } else {
      // Make sure the parsed number is within the range before updating the count
      const number = parseInt(value, 10);
      if (!isNaN(number) && number >= 0) {
        setCount(Math.min(number, maxCount));
      }
    }
  };

  const handleBlur = () => {
    if (count === "") {
      // If all numbers are deleted, reset the count to 1
      setCount(1);
    } else {
      // Ensure that count is within the range when input loses focus
      const number = parseInt(count, 10);
      if (number < 1) {
        setCount(1);
      } else if (number > maxCount) {
        setCount(maxCount);
      }
    }
  };

  return (
    <Box
      fullWidth={!mdUp}
      sx={{
        display: "flex",
        alignItems: "center",
        "& > *": {
          margin: 1,
        },
      }}
    >
      <IconButton
        onClick={handleDecrement}
        color="primary"
        aria-label="remove"
        disabled={count <= 1}
      >
        <Iconify icon="carbon:subtract" />
      </IconButton>
      <TextField
        id="counter"
        value={count}
        onChange={handleChange}
        onBlur={handleBlur}
        type="number"
        variant="outlined"
        size="small"
        disabled={!isEdit}
        inputProps={{ min: 1, max: maxCount }}
        sx={{
          width: "4rem",
          textAlign: "center",
          input: { textAlign: "center" },
        }}
      />
      <IconButton
        onClick={handleIncrement}
        color="primary"
        aria-label="add"
        disabled={count >= maxCount}
      >
        <Iconify icon="carbon:add" />
      </IconButton>
    </Box>
  );
}
