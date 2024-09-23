import EcommerceAccountOrderIdView from 'src/sections/_ecommerce/view/ecommerce-account-order-id-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: "Shoe Shop: Account Orders",
};

export default function EcommerceAccountOrderIdPage({ params }) {
  return <EcommerceAccountOrderIdView params={params} />
}
