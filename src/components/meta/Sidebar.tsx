import MetaSidebarLink from "./MetaSidebarLink";



const MetaSidebar = () => {

    return (
        <div className="flex flex-col w-96 flex-1 shrink-0 min-w-max h-full bg-white border-r dark:bg-gray-800 dark:border-gray-600 min-h-screen">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mt-10 px-10">Meta Navigation</h2>
            <ul className="flex flex-col py-4 space-y-4 mt-6">
                <li>
                    <MetaSidebarLink href="/meta/companies">Companies</MetaSidebarLink>
                </li>
                <li>
                    <MetaSidebarLink href="/meta/users">Users</MetaSidebarLink>
                </li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default MetaSidebar;