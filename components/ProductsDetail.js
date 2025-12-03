import React from "react";
import { Card, Descriptions, Button} from "antd";
import Image from "next/image";
import Link from "next/link";

export default function ProductsDetail({ products }) {
  if (!products) return <p>Product not found</p>;

  return (
    <Card>
      <Image
        src={products.image}
        alt={products.name}
        width={300}
        height={300}
        style={{ objectFit: "contain" }}
      />
      <Descriptions bordered column={1} style={{ marginTop: 16 }}>
        <Descriptions.Item label="Name">{products.name}</Descriptions.Item>
        <Descriptions.Item label="Description">{products.description}</Descriptions.Item>
        <Descriptions.Item label="Price"> {`Rp ${products.price.toLocaleString()}`}</Descriptions.Item>
        <Descriptions.Item label="Category">{products.category}</Descriptions.Item>
        <Descriptions.Item label="Stock">{products.stock}</Descriptions.Item>
      </Descriptions>
      <Button type="primary" style={{ marginTop: 16 }}> <Link href="/products">Back</Link></Button>
    </Card>
  );
}
