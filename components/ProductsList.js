import { useState } from "react";
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Skeleton,
  Popconfirm,
  message,
  Modal,
  Form,
  InputNumber,
} from "antd";
import Image from "next/image";
import Link from "next/link";

export default function ProductsList({ initialProducts }) {
  const list = Array.isArray(initialProducts)
    ? initialProducts
    : initialProducts?.products || initialProducts?.data || [];

  const categories = [...new Set(list.map((p) => p.category))];
  const [products, setProducts] = useState(list);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Refresh products from API
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://course.summitglobal.id/products");
      const data = await res.json();
      setProducts(data);
      message.success("Data refreshed");
    } catch (err) {
      message.error("Failed to refresh");
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingProduct) {
        // PUT request to update
        const res = await fetch(
          `https://course.summitglobal.id/products?id=${editingProduct.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        if (!res.ok) throw new Error("Failed to update product");
        message.success("Product updated successfully");
      } else {
        // POST request to create
        const res = await fetch("https://course.summitglobal.id/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error("Failed to add product");
        message.success("Product added successfully");
      }

      setModalVisible(false);
      form.resetFields();
      refresh();
    } catch (err) {
      message.error(err.message || "Operation failed");
    }
  };

 
  const filtered = products.filter((item) => {
    const name = item.name || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? item.category === category : true;
    return matchSearch && matchCategory;
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (n) => n || "-",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (c) => c || "-",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => (p != null ? `Rp ${p.toLocaleString()}` : "-"),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (s) => (s != null ? s : "-"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete product?"
            okText="Yes"
            cancelText="No"
            onConfirm={async () => {
              try {
                const res = await fetch(
                  `https://course.summitglobal.id/products?id=${record.id}`,
                  { method: "DELETE" }
                );
                if (!res.ok) throw new Error("Delete failed");
                message.success("Product deleted");
                refresh();
              } catch (err) {
                message.error(err.message || "Failed to delete");
              }
            }}
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
          <Button>
            <Link href={`/products/${record.id}`}>Detail</Link>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>

      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          allowClear
          placeholder="Filter Category"
          value={category}
          onChange={(v) => setCategory(v)}
          style={{ width: 200 }}
          options={categories.map((c) => ({ label: c, value: c }))}
        />
        <Button onClick={refresh}>Refresh</Button>
        <Button type="primary" onClick={openAddModal}>
          Add Product
        </Button>
      </Space>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table columns={columns} dataSource={filtered} rowKey="id" />
      )}

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ price: 0, stock: 0 }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input product name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input price" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please input stock" }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please input category" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Image URL"
            name="image"
            rules={[{ required: true, message: "Please input image URL" }]}
          >
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
