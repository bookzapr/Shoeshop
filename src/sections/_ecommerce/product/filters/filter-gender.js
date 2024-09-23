import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

// ----------------------------------------------------------------------

export default function FilterGender({ options, filterGender, onChangeGender, ...other }) {
  return (
    <Stack {...other}>
      {options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              size="small"
              value={option}
              checked={filterGender.includes(option)}
              onChange={() => onChangeGender(option)}
            />
          }
          label={option}
        />
      ))}
    </Stack>
  );
}

FilterGender.propTypes = {
  filterGender: PropTypes.arrayOf(PropTypes.string),
  onChangeGender: PropTypes.func,
  options: PropTypes.array,
};
