import JsonTable from "@/components/meta/JsonTable";
import { companies } from "@prisma/client";
import useFetch from "@/components/meta/hooks/useFetch";
import MetaLayout from "@/components/meta/Layout";
import { useRouter } from "next/router";

export default function Companies() {
  const router = useRouter();
  // url will be /meta/companies/1 or so
  const id = router.query.id as string;

  const comps = useFetch<companies[]>(`/api/companies/${id}`);
  return (
    <MetaLayout>
      <h1 className="mb-4 text-3xl font-semibold dark:text-white">Companies</h1>
      {comps ? <JsonTable data={comps} /> : <div>Loading data...</div>}
    </MetaLayout>
  );
}
