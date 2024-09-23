import EcommerceProductView from 'src/sections/_ecommerce/view/ecommerce-product-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Shoe Shop: Product',
};

export default function EcommerceProductPage({ params }) {
  return <EcommerceProductView params={params} />;
}
