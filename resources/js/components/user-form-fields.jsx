import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


export default function UserFormFields({ errors, user, passwordOptional = false }) {
    return (
        <>
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    defaultValue={user?.name}
                    required
                    autoComplete="name"
                    placeholder="Full name"
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user?.email}
                    required
                    autoComplete="email"
                    placeholder="email@example.com"
                />
                <InputError message={errors.email} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required={!passwordOptional}
                    autoComplete="new-password"
                    placeholder={
                        passwordOptional
                            ? 'Leave blank to keep the current password'
                            : 'Password'
                    }
                />
                <InputError message={errors.password} />
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password_confirmation">Confirm password</Label>
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required={!passwordOptional}
                    autoComplete="new-password"
                    placeholder="Confirm password"
                />
                <InputError message={errors.password_confirmation} />
            </div>
        </>
    );
}
