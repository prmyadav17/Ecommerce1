import React from "react";
import Footer from "../features/common/Footer";
import Navbar from "../features/navbar/Navbar";
import ProductDetails from "../features/product/components/ProductDetails";

export default function ProductDetailPage() {
  return (
    <>
      <Navbar />
      <ProductDetails />
      <Footer />
    </>
  );
}
