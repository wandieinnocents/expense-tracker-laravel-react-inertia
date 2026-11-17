import InputError from '@/components/input-error';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ExpenseCategoryFormFields({ errors, category }) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={category?.name}
                    required
                    maxLength={255}
                    placeholder="e.g. Office Supplies"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    name="description"
                    rows={3}
                    defaultValue={category?.description ?? ''}
                    maxLength={1000}
                    placeholder="Optional"
                />
                <InputError message={errors.description} />
            </div>

            <div className="flex items-center gap-3">
                <Checkbox
                    id="is_active"
                    name="is_active"
                    value="1"
                    defaultChecked={category?.is_active ?? true}
                />
                <Label htmlFor="is_active">Active</Label>
                <InputError message={errors.is_active} />
            </div>
        </>
    );
}
