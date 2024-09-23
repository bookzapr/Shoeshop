import EcommerceProductsView from "src/sections/_ecommerce/view/ecommerce-products-view";
import { Suspense } from "react";

// ----------------------------------------------------------------------

export const metadata = {
  title: "Shoe Shop: Products",
};

export default function EcommerceProductsPage() {
  return (
    <Suspense fallback={null}>
      <EcommerceProductsView />
    </Suspense>
  );
}
