import { useEffect, useState } from "react";
import ProductTable from "@/components/ProductsList"; 
import { message } from "antd";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

const [messageApi, contextHolder] = message.useMessage();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      const list = Array.isArray(json)
        ? json
        : json.products || json.data || [];

      setProducts(list);
    } catch (e) {
      console.error(e);
      messageApi.error("Failed loading products");
    }
    setLoading(false);
  };

  useEffect(() => {
    try {
      loadProducts();
      messageApi.success("Products loaded!");
    } catch (e) {
      console.error(e);
      messageApi.error("Failed loading products");
    }

  }, []);

  const handleAdd = async (values) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      messageApi.success("Product added!");
      loadProducts();
    } catch (err) {
      messageApi.error("Failed adding product");
    }
  };


  const handleEdit = async (values) => {
    try {
      const res = await fetch(`/api/products?id=${values.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      messageApi.success("Product updated!");
      loadProducts();
    } catch (err) {
      messageApi.error("Failed updating product");
    }
  };


  const handleDelete = async (product) => {
    try {
      const res = await fetch(`/api/products?id=${product.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      messageApi.success("Product deleted!");
      loadProducts();
    } catch (err) {
      messageApi.error("Failed deleting product");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {contextHolder}
      <ProductTable
        data={products}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRefresh={loadProducts}
      />
    </div>
  );
}
