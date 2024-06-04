import JsonTable from "@/components/meta/JsonTable";
import { companies } from "@prisma/client";
import { useEffect, useState } from "react";

export default function MetaCompanies() {
    const [comps, setComps] = useState<companies[] | null>(null);

    useEffect(() => {
        fetch("/api/getCompanies")
            .then(res => res.json())
            .then(data => setComps(data));
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 w-full">
            {/* Sidebar */}
            <div className="flex flex-col w-64 h-full p-4 bg-white border-r dark:bg-gray-800 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Meta Navigation</h2>
                <ul className="flex flex-col py-4 space-y-1">
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ml-3">Companies</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                            <span className="ml-3">Users</span>
                        </a>
                    </li>
                    {/* Add more links as needed */}
                </ul>
            </div>
            {/* Content Area */}
            <div className="flex-1 p-10 dark:bg-gray-900">
                <h1 className="mb-4 text-3xl font-semibold dark:text-white">Companies</h1>
                {comps ? <JsonTable data={comps} /> : <p>Loading data...</p>}
            </div>
        </div>
    );
}
