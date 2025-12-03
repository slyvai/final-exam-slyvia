import { useState } from "react";
import { Table, Input, Select, Button, Space, Skeleton, Popconfirm, message } from "antd";
import Image from "next/image";
import Link from "next/link";

export default function ProductsList({ initialProducts }) {
  const list = Array.isArray(initialProducts)
  ? initialProducts
  : initialProducts?.products || 
  initialProducts?.data || [];

  const categories = [...new Set(list.map((p) => p.category))];
  const [products, setProducts] = useState(list);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");



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


  const filtered = products.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category ? item.category === category : true;
    return matchSearch && matchCategory;
  });

  const columns = [
    {
  title: "Image",
  dataIndex: "image",
  key: "image",
  render: (src) => (
    <Image
      width={100}
      height={100}
      src={src}
      alt="product"
      style={{ objectFit: "cover", borderRadius: 8 }}
      fallback="https://via.placeholder.com/60"
    />
  ),
},
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (p) => `Rp ${p.toLocaleString()}`,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary">Edit</Button>
          <Popconfirm
            title="Delete product?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => message.info(`Deleted: ${record.name}`)}
          >
            <Button type="danger" style={{color : 'red'}}>Delete</Button>
          </Popconfirm>

          <Button type="dash"><Link href={`/products/${record.id}`}>Detail</Link></Button>
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

        <Button>Add Products</Button>
      </Space>

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table columns={columns} dataSource={filtered} rowKey="id" />
      )}
    </div>
  );
}
