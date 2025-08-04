// components/forgot-password-form.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

export function ForgotPasswordForm({ onBackToLogin }: { onBackToLogin: () => void }) {
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Forgot your password?</h1>
                <p className="text-muted-foreground text-sm">Enter your email to reset it</p>
            </div>

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="you@example.com"
                        required
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Sending...' : 'Send reset link'}
                </Button>

                <button type="button" onClick={onBackToLogin} className="mt-2 text-sm text-blue-600 hover:underline">
                    Back to login
                </button>
            </div>
        </form>
    );
}
