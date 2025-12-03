import { useRouter } from "next/router";
import { Skeleton } from "antd";
import ProductsDetail from "@/components/ProductsDetail";

export default function ProductDetailPage({ products }) {
  const router = useRouter();

  if (router.isFallback) return <Skeleton active />;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      <ProductsDetail products={products} />
    </div>
  );
}

export async function getStaticProps({ params }) {
  try {
    const res = await fetch("https://course.summitglobal.id/products");
    const data = await res.json();

    const productsArray = data.body?.data || [];
    const singleProduct = productsArray.find(p => p.id.toString() === params.id);

    if (!singleProduct) return { notFound: true };

    return {
      props: { products: singleProduct },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  try {
    const res = await fetch("https://course.summitglobal.id/products");
    const data = await res.json();

    const productsArray = data.body?.data || [];
    const paths = productsArray.map(p => ({ params: { id: p.id.toString() } }));

    return { paths, fallback: true };
  } catch (error) {
    console.error(error);
    return { paths: [], fallback: true };
  }
}
