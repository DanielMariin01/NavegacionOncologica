import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import AuthBackground from '@/Components/AuthBackground';


export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthBackground>
            <Head title="Log in" />

            <Link href="/" className="flex items-center mb-6">
                <ApplicationLogo className="h-28 w-auto" />
            </Link>

            <div className="w-full bg-white rounded-lg shadow sm:max-w-md">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Iniciar sesión
                    </h1>

                    {status && (
                        <div className="text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form className="space-y-4 md:space-y-6" onSubmit={submit}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                                Correo electrónico
                            </label>
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                placeholder="nombre@clinica.com"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                                Contraseña
                            </label>
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-2.5"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-gray-500">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                Recordarme
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-medium text-teal-600 hover:underline"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <PrimaryButton className="w-full justify-center py-2.5" disabled={processing}>
                            Iniciar sesión
                        </PrimaryButton>
                    </form>
                </div>
            </div>

        </AuthBackground>
    );
}