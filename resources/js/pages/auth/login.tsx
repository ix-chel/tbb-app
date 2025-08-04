// pages/login.tsx
import { ForgotPasswordForm } from '@/components/forgot-password-form';
import { LoginForm } from '@/components/login-form';
import downloadImage from '@/pages/download.jpg';
import toyaImage from '@/pages/toya.png';
import { useState } from 'react';

export default function LoginPage() {
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Kiri */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="/" className="flex items-center gap-2 font-medium">
                        <img src={toyaImage} alt="logo" className="h-12" />
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        {showForgotPassword ? (
                            <ForgotPasswordForm onBackToLogin={() => setShowForgotPassword(false)} />
                        ) : (
                            <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
                        )}
                    </div>
                </div>
            </div>

            {/* Kanan */}
            <div className="AVbg-muted relative hidden lg:block">
                <img src={downloadImage} alt="Image" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
            </div>
        </div>
    );
}
