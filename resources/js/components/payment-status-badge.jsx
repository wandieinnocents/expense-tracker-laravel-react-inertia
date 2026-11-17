import { Badge } from '@/components/ui/badge';
import { paymentStatusClasses, paymentStatusLabels } from '@/lib/expenses';

export default function PaymentStatusBadge({ status }) {
    return (
        <Badge variant="outline" className={paymentStatusClasses[status]}>
            {paymentStatusLabels[status] ?? status}
        </Badge>
    );
}
