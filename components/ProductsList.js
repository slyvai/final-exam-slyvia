import {
  Button,
  Image,
  Table,
  Tag,
  Space,
  Modal,
  Descriptions,
  Skeleton,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import Link from "next/link";
import { useState, useMemo } from "react";

export default function ProductTable({ data, onEdit, onDelete, onAdd, onRefresh, loading }) {
  const [viewing, setViewing] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  const categories = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const list = [...new Set(data.map((p) => p.category).filter(Boolean))];
    return list;
  }, [data]);


  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? data : [];


    if (searchText.trim() !== "") {
      result = result.filter((item) =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
      );
    }


    if (categoryFilter !== "") {
      result = result.filter((item) => item.category === categoryFilter);
    }

    return result;
  }, [data, searchText, categoryFilter]);

  
  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (src) =>
        src ? <Image width={48} src={src} alt="product" /> : <Tag>No Image</Tag>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => text || <Tag>No name</Tag>,
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (text) => text || <Tag>Uncategorized</Tag>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (v) =>
        typeof v === "number"
          ? Intl.NumberFormat("id-ID").format(v)
          : <Tag>N/A</Tag>,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (s) =>
        s === 0 ? <Tag color="red">Out</Tag> : s ?? <Tag>N/A</Tag>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              form.setFieldsValue(record);
              setIsEditOpen(true);
            }}
            type="primary"
          >
            Edit
          </Button>

          <Button
            type="danger"
            onClick={() => {
              Modal.confirm({
                title: "Delete product?",
                content: "This will permanently remove the product.",
                okText: "Confirm",
                onOk: () => onDelete(record),
              });
            }}
          >
            Delete
          </Button>

          <Button type="link" >
            <Link href={`/products/${record.id}`}>
            View Details
            </Link>
          </Button>
        </Space>
      ),
    },
  ];


  const handleSaveEdit = () => {
    form.validateFields().then((values) => {
      onEdit(values);
      setIsEditOpen(false);
    });
  };


  const handleAddProduct = () => {
    addForm.validateFields().then((values) => {
      onAdd(values);
      addForm.resetFields();
      setIsAddOpen(false);
    });
  };

  return (
    <>
      <div style={{ marginBottom: 16, display: "flex", gap: 12 }}>
        <Input
          placeholder="Search product name..."
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />

        <Select
          style={{ width: 200 }}
          placeholder="Filter category"
          allowClear
          value={categoryFilter || undefined}
          onChange={(v) => setCategoryFilter(v || "")}
        >
          {categories.map((cat) => (
            <Select.Option key={cat} value={cat}>
              {cat}
            </Select.Option>
          ))}
        </Select>

        <Button onClick={onRefresh}>
         Refresh
        </Button>


        <Button type="primary" onClick={() => setIsAddOpen(true)}>
          + Add Product
        </Button>
      </div>


      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <Table
          rowKey={(record) => record.id || record.name || Math.random()}
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
        />
      )}


      <Modal open={!!viewing} title="Product Details" footer={null} onCancel={() => setViewing(null)}>
        {!viewing ? (
          <Skeleton active />
        ) : (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Image">
              {viewing.image ? (
                <Image width={100} src={viewing.image} />
              ) : (
                <Tag>No Image</Tag>
              )}
            </Descriptions.Item>

            <Descriptions.Item label="Name">{viewing.name || "-"}</Descriptions.Item>
            <Descriptions.Item label="Category">{viewing.category || "-"}</Descriptions.Item>
            <Descriptions.Item label="Price">
              {typeof viewing.price === "number"
                ? Intl.NumberFormat("id-ID").format(viewing.price)
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Stock">
              {viewing.stock === 0 ? (
                <Tag color="red">Out of stock</Tag>
              ) : (
                <Tag color="green">In stock: {viewing.stock}</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Description">{viewing.description || "-"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      <Modal
        open={isEditOpen}
        title="Edit Product"
        okText="Save"
        onCancel={() => setIsEditOpen(false)}
        onOk={handleSaveEdit}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Name"/>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Input placeholder="Category"/>
          </Form.Item>

          <Form.Item label="Price" name="price">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Price"/>
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Stock"/>
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Image URL"/>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Description"/>
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        open={isAddOpen}
        title="Add Product"
        okText="Add"
        onCancel={() => setIsAddOpen(false)}
        onOk={handleAddProduct}
      >
        <Form layout="vertical" form={addForm}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="Name"/>
          </Form.Item>

          <Form.Item label="Category" name="category">
            <Input placeholder="Category"/>
          </Form.Item>

          <Form.Item label="Price" name="price">
            <InputNumber min={0} style={{ width: "100%" }} placeholder="Price" />
          </Form.Item>

          <Form.Item label="Stock" name="stock">
            <InputNumber min={0} style={{ width: "100%" }}  placeholder="Stock"/>
          </Form.Item>

          <Form.Item label="Image URL" name="image">
            <Input placeholder="Image URL"/>
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={3} placeholder="Description"/>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
