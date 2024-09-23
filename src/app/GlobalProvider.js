import { CartProvider } from "src/context/CartContext";

export function GlobalProvider({ children }) {
  return <CartProvider>{children}</CartProvider>;
}
