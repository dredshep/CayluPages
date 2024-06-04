import Link from 'next/link';
import { useRouter } from 'next/router';
import cn from 'classnames';

export default function MetaSidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
    const router = useRouter();
    const isActive = router.pathname === href;
    return (
        <Link
            className={cn(
                'flex items-center w-full py-4 px-6 text-base font-normal text-gray-900 dark:text-white',
                {
                    'bg-gray-100 dark:bg-gray-700 cursor-default': isActive,
                    'hover:bg-gray-100 dark:hover:bg-gray-600': !isActive,
                }
            )}
            href={isActive ? "#" : href}
        >
            {children}
        </Link>
    );
}

