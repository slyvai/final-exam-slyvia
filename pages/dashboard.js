import { useState, useEffect } from "react";
import { Card, Row, Col, List, Skeleton } from "antd";

export default function Dashboard({ products }) {
  const [randomProduct, setRandomProduct] = useState(null);


  const safeProducts = Array.isArray(products)
    ? products.filter((p) => p && typeof p === "object")
    : [];

  useEffect(() => {
    if (safeProducts.length > 0) {
      const random = safeProducts[Math.floor(Math.random() * safeProducts.length)];
      setRandomProduct(random);
    }
  }, [safeProducts]);

  const categories = [
    ...new Set(
      safeProducts
        .map((p) => p.category)
        .filter((c) => c != null && c !== "")
    ),
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        {/* Total Products */}
        <Col span={8}>
          <Card title="Total Products">{safeProducts.length}</Card>
        </Col>

        {/* Recommended Product */}
        <Col span={8}>
          <Card title="Recommended Product">
            {randomProduct ? (
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <h3>{randomProduct.name || "-"}</h3>
                {randomProduct?.price != null && `Rp ${randomProduct.price.toLocaleString()}`}
              </div>
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>

        {/* Categories List */}
        <Col span={8}>
          <Card title="Categories List">
            <List
              dataSource={categories}
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
    const json = await res.json();
    const data = json?.body?.data || json || [];

    // Filter out invalid entries
    const products = Array.isArray(data)
      ? data.filter((p) => p && typeof p === "object")
      : [];

    return { props: { products } };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { props: { products: [] } };
  }
}
