import JsonTable from "@/components/meta/JsonTable";
import { users } from "@prisma/client";
import useFetch from "@/components/meta/hooks/useFetch";
import MetaLayout from "@/components/meta/Layout";

export default function Users() {
    const comps = useFetch<users[]>("/api/users");
    return (
        <MetaLayout>
            <h1 className="mb-4 text-3xl font-semibold dark:text-white">Users</h1>
            {comps ? <JsonTable data={comps} /> : <p>Loading data...</p>}
        </MetaLayout>
    );
}