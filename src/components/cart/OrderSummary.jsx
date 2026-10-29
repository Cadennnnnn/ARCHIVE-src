import OrderCustomerInfo from "./OrderCustomerInfo.jsx";
import OrderItemsTable from "./OrderItemsTable.jsx";
import OrderTotals from "./OrderTotals.jsx";

export default function OrderSummary({ cliente, items, total, etiquetaTotal = "Total pagado" }) {
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <>
      <OrderCustomerInfo cliente={cliente} />
      <OrderItemsTable items={items} />
      <OrderTotals subtotal={subtotal} total={total} etiquetaTotal={etiquetaTotal} />
    </>
  );
}