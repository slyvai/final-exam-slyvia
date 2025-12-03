import { useState, useEffect } from "react";
import { Card, Row, Col, List, Skeleton, Typography } from "antd";

const { Title, Text } = Typography;

export default function Dashboard({ products }) {
  const [randomProduct, setRandomProduct] = useState(null);

  const safeProducts = Array.isArray(products) ? products.filter(Boolean) : [];

  useEffect(() => {
    if (safeProducts.length > 0) {
      const random =
        safeProducts[Math.floor(Math.random() * safeProducts.length)];
      setRandomProduct(random);
    }
  }, [safeProducts]);

  const categories = [
    ...new Set(safeProducts.map((p) => p.category).filter(Boolean)),
  ];

  const cardStyle = {
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card title="Total Products" style={cardStyle}>
            <Title level={2} style={{ margin: 0 }}>
              {safeProducts.length}
            </Title>
          </Card>
        </Col>

  
        <Col span={8}>
          <Card title="Recommended Product" style={cardStyle}>
            {randomProduct ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "10px 0",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  {randomProduct.name || "-"}
                </Title>

                <Text strong style={{ fontSize: 18 }}>
                  {randomProduct.price != null &&
                    `Rp ${randomProduct.price.toLocaleString()}`}
                </Text>
              </div>
            ) : (
              <Skeleton active />
            )}
          </Card>
        </Col>

        <Col span={8}>
          <Card title="Categories" style={cardStyle}>
            <List
              dataSource={categories}
              size="small"
              pagination={{
                pageSize: 5,
                size: "small",
              }}
              renderItem={(item) => (
                <List.Item style={{ paddingLeft: 8 }}>{item}</List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export async function getServerSideProps({ req }) {
  try {
    const baseUrl = process.env.NODE_ENV === "production"
      ? `https://${req.headers.host}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/products`);
    const data = await res.json();

    return {
      props: {
        products: Array.isArray(data) ? data : data.products || []
      },
    };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return { props: { products: [] } };
  }
}

