// components/login-form.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export function LoginForm({ onForgotPassword }: { onForgotPassword: () => void }) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        email: string;
        password: string;
        remember: boolean;
    }>({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onSuccess: () => {},
            onError: () => {
                reset('password');
            },
        });
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm">Enter your email and password below</p>
            </div>

            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="m@example.com"
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid gap-3">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        <button type="button" onClick={onForgotPassword} className="ml-auto text-sm text-blue-600 hover:underline">
                            Forgot your password?
                        </button>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            className="pr-10"
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <Label htmlFor="remember" className="text-sm">
                        Remember me
                    </Label>
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                    {processing ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </form>
    );
}
