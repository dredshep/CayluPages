import JsonTable from "@/components/meta/JsonTable";
import { companies } from "@prisma/client";
import useFetch from "@/components/meta/hooks/useFetch";
import MetaLayout from "@/components/meta/Layout";

export default function Companies() {
    const comps = useFetch<companies[]>("/api/companies");
    return (
        <MetaLayout>
            <h1 className="mb-4 text-3xl font-semibold dark:text-white">Companies</h1>
            {comps ? <JsonTable data={comps} /> : <p>Loading data...</p>}
        </MetaLayout>
    );
}