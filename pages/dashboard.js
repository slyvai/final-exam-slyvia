import { useState, useEffect } from "react";
import { Card, Row, Col, List, Skeleton } from "antd";
import Image from "next/image";

export default function Dashboard({ products }) {
  const [randomProduct, setRandomProduct] = useState(null);

  useEffect(() => {
    if (products.length > 0) {
      const random = products[Math.floor(Math.random() * products.length)];
      setRandomProduct(random);
    }
  }, [products]);

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Products">{products.length}</Card>
        </Col>
        <Col span={8}>
          <Card title="Recommended Product">
            {randomProduct ? (
              <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                {randomProduct.image && (
                  <Image
                    src={randomProduct.image}
                    alt={randomProduct.name}
                    width={150}
                    height={150}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                )}
                <h3>{randomProduct.name}</h3>
                {randomProduct.price && `Rp ${randomProduct.price.toLocaleString()}`}
              </div>
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Categories List">
            <List
              dataSource={[...new Set(products.map((p) => p.category))]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const res = await fetch("https://course.summitglobal.id/products");
    const products = await res.json();
    const data = products?.body?.data || [];

    return { props: { products: data } };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { props: { products: [] } };
  }
}
