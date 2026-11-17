import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    CalendarRange,
    CircleCheck,
    CircleDashed,
    CircleX,
    Wallet,
} from 'lucide-react';
import ExpenseController from '@/actions/App/Http/Controllers/ExpenseController';
import ExpenseReportController from '@/actions/App/Http/Controllers/ExpenseReportController';
import Heading from '@/components/heading';
import StatCard from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

export default function Dashboard({ summary }) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <Heading title="Dashboard" description="Expense overview" />
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={ExpenseReportController()}>
                                View reports
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href={ExpenseController.create()}>
                                Record expense
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <StatCard
                        title="Total expenses"
                        icon={Wallet}
                        {...summary.total}
                    />
                    <StatCard
                        title="This month"
                        icon={CalendarDays}
                        {...summary.this_month}
                    />
                    <StatCard
                        title="This year"
                        icon={CalendarRange}
                        {...summary.this_year}
                    />
                    <StatCard
                        title="Paid"
                        icon={CircleCheck}
                        {...summary.paid}
                    />
                    <StatCard
                        title="Unpaid"
                        icon={CircleX}
                        {...summary.unpaid}
                    />
                    <StatCard
                        title="Partially paid"
                        icon={CircleDashed}
                        {...summary.partial}
                    />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
