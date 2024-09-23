import PropTypes from 'prop-types';

// ----------------------------------------------------------------------

export default function EcommerceLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}

EcommerceLayout.propTypes = {
  children: PropTypes.node,
};
