import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import AuthBackground from '@/Components/AuthBackground';
import Background from '@/Components/Background';


export default function Registro() {
    const { data, setData, post, processing, errors } = useForm({
        nombre_completo: '',
        tipo_documento: '',
        numero_documento: '',
        edad: '',
        sexo: '',
        fecha_diagnostico: '',
        telefono: '',
        correo: '',
        archivo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('paciente.store'));
    };

    const inputClass = "peer py-2.5 pe-0 ps-8 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-300 text-base text-gray-900 placeholder:text-gray-400 focus:border-t-transparent focus:border-x-transparent focus:border-b-teal-400 focus:ring-0 focus:outline-none disabled:opacity-50";

    const iconClass = "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 text-gray-400";

    return (
        <AuthenticatedLayout>
            <Head title="Registro de Paciente" />

            <div className="max-w-4xl mx-auto py-10 px-6">
                <h1 className="text-xl font-bold text-white mb-8 bg-blue-500 px-6 py-3">
                    Registro de paciente
                </h1>

                <form onSubmit={submit} className="space-y-6">


                    <div className="relative">
                        <div className={iconClass}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={data.nombre_completo}
                            onChange={e => setData('nombre_completo', e.target.value)}
                            className={inputClass}
                        />
                        {errors.nombre_completo && <p className="text-red-500 text-xs mt-1">{errors.nombre_completo}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="14" x="3" y="5" rx="2" /><path d="M3 10h18" /></svg>
                            </div>
                            <select
                                value={data.tipo_documento}
                                onChange={e => setData('tipo_documento', e.target.value)}
                                className={inputClass}
                            >
                                <option value="" disabled>Tipo de documento</option>
                                <option value="CC">Cédula de ciudadanía</option>
                                <option value="TI">Tarjeta de identidad</option>
                                <option value="CE">Cédula de extranjería</option>
                                <option value="PA">Pasaporte</option>
                                <option value="RC">Registro civil</option>
                            </select>
                            {errors.tipo_documento && <p className="text-red-500 text-xs mt-1">{errors.tipo_documento}</p>}
                        </div>

                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
                            </div>
                            <input
                                type="number"
                                placeholder="Número de documento"
                                value={data.numero_documento}
                                onChange={e => setData('numero_documento', e.target.value)}
                                className={inputClass}
                            />
                            {errors.numero_documento && <p className="text-red-500 text-xs mt-1">{errors.numero_documento}</p>}
                        </div>
                    </div>

                    {/* Fila 2: Edad, Sexo, Fecha diagnóstico */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6v6l4 2" /></svg>
                            </div>
                            <input
                                type="number"
                                placeholder="Edad"
                                value={data.edad}
                                onChange={e => setData('edad', e.target.value)}
                                className={inputClass}
                            />
                            {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
                        </div>

                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M18.66 5.34l1.41-1.41" /></svg>
                            </div>
                            <select
                                value={data.sexo}
                                onChange={e => setData('sexo', e.target.value)}
                                className={inputClass}
                            >
                                <option value="" disabled>Sexo</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                            {errors.sexo && <p className="text-red-500 text-xs mt-1">{errors.sexo}</p>}
                        </div>

                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                            </div>
                            <input
                                type="date"
                                value={data.fecha_diagnostico}
                                onChange={e => setData('fecha_diagnostico', e.target.value)}
                                className={inputClass}
                            />
                            {errors.fecha_diagnostico && <p className="text-red-500 text-xs mt-1">{errors.fecha_diagnostico}</p>}
                        </div>
                    </div>

                    {/* Fila 3: Teléfono y Correo */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                            </div>
                            <input
                                type="tel"
                                placeholder="Teléfono"
                                value={data.telefono}
                                onChange={e => setData('telefono', e.target.value)}
                                className={inputClass}
                            />
                            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                        </div>

                        <div className="relative">
                            <div className={iconClass}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                value={data.correo}
                                onChange={e => setData('correo', e.target.value)}
                                className={inputClass}
                            />
                            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                        </div>
                    </div>

                    {/* Archivo */}
                    <div className="relative">
                        <label className="block text-sm text-gray-400 mb-1 ps-8">
                            Subir documento
                        </label>
                        <div className={iconClass} style={{ top: '28px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                        </div>
                        <input
                            type="file"
                            onChange={e => setData('archivo', e.target.files[0])}
                            className="ps-8 block w-full text-sm text-gray-400 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-b-teal-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-teal-50 file:text-teal-600 hover:file:bg-teal-100"
                        />
                        {errors.archivo && <p className="text-red-500 text-xs mt-1">{errors.archivo}</p>}
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-teal-400 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg transition duration-150 mt-4 disabled:opacity-50"
                    >
                        Registrar paciente
                    </button>

                </form>
            </div>

        </AuthenticatedLayout>
    );
}