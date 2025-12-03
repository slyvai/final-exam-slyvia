import ProductsList from "@/components/ProductsList";

export async function getServerSideProps() {
  try {
    const res = await fetch("https://course.summitglobal.id/products");

    if (!res.ok) {
      console.log("API ERROR:", res.status);
      return { props: { initialProducts: [] } };
    }

    const json = await res.json();
    const data = json?.body?.data || [];

    return { props: { initialProducts: data } };

  } catch (err) {
    console.log("SSR fetch error:", err);
    return { props: { initialProducts: [] } };
  }
}

export default function ProductsPage({ initialProducts }) {
  return <ProductsList initialProducts={initialProducts} />;
}
