import JsonTable from "@/components/meta/JsonTable";
import { products } from "@prisma/client";
import useFetch from "@/components/meta/hooks/useFetch";
import MetaLayout from "@/components/meta/Layout";

export default function Products() {
  const prods = useFetch<products[]>("/api/companies/products");
  return (
    <MetaLayout>
      <h1 className="mb-4 text-3xl font-semibold dark:text-white">Products</h1>
      <pre className="text-white">{JSON.stringify(prods?.[0], null, 2)}</pre>
      {prods ? <JsonTable data={prods} /> : <div>Loading data...</div>}
    </MetaLayout>
  );
}
