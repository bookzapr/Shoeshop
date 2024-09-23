import SvgColor from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const navConfig = [
  {
    title: "user",
    path: "/admin/user",
    icon: icon("ic_user"),
  },
  {
    title: "product",
    path: "/admin/products",
    icon: icon("ic_cart"),
  },
  {
    title: "order",
    path: "/admin/orders",
    icon: icon("ic_invoice"),
  },
];

export default navConfig;
