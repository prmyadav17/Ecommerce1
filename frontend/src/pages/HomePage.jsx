import React from "react";
import Footer from "../features/common/Footer";
import Navbar from "../features/navbar/Navbar";
import ProductList from "../features/product/components/ProductList";

export default function HomePage() {
  return (
    <div>
      <Navbar />
      <ProductList />
      <Footer />
    </div>
  );
}
