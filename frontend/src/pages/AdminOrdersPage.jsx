import React from "react";
import AdminOrders from "../features/admin/components/AdminOrders";
import Navbar from "../features/navbar/Navbar";

export default function AdminOrdersPage() {
  return (
    <Navbar>
      <AdminOrders />
    </Navbar>
  );
}
