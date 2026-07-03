import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import Swal from 'sweetalert2';
import { useRef, useState } from 'react';
import axios from 'axios';


export default function Registro() {


    const { data, setData, post, processing, errors, reset } = useForm({
        forceFormData: true,
        nombre1: '',
        nombre2: '',
        apellido1: '',
        apellido2: '',
        tipo_documento: '',
        numero_documento: '',
        edad: '',
        sexo: '',
        fecha_nacimiento: '',
        fecha_diagnostico: '',
        telefono: '',
        telefono2: '',
        correo: '',
        historiaClinica: null,
        patologia: null,
        imagenes: null,
    });

    const [verificando, setVerificando] = useState(false);


    const verificarDocumento = async () => {
        if (!data.numero_documento) return;

        setVerificando(true);

        try {
            const response = await axios.get(route('paciente.check', data.numero_documento));
            const { existe, origen, mensaje, datos } = response.data;

            if (existe && (origen === 'local' || origen === 'capbas') && datos) {
                
                Swal.fire({
                    icon: 'info',
                    title: 'El paciente ya existe',
                    text: mensaje,
                });

                setData(current => ({
                    ...current,
                    tipo_documento: datos.tipo_documento || current.tipo_documento,
                    nombre1: datos.nombre1 || '',
                    nombre2: datos.nombre2 || '',
                    apellido1: datos.apellido1 || '',
                    apellido2: datos.apellido2 || '',
                    sexo: datos.sexo || current.sexo,
                }));

                if (datos.fecha_nacimiento) {
                    calcularEdad(datos.fecha_nacimiento);
                }
            }
        } catch (error) {
            console.error('Error verificando documento:', error);
        } finally {
            setVerificando(false);
        }
    };

    const submit = (e) => {
        e.preventDefault();


        const tiposPermitidos = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const camposVacios = [];

        if (!data.nombre1) camposVacios.push('Primer nombre');
        if (!data.apellido1) camposVacios.push('Primer apellido');
        if (!data.tipo_documento) camposVacios.push('Tipo de documento');
        if (!data.numero_documento) camposVacios.push('Número de documento');
        if (!data.edad) camposVacios.push('Edad');
        if (!data.sexo) camposVacios.push('Sexo');
        if (!data.fecha_nacimiento) camposVacios.push('Fecha de nacimiento');
        if (!data.telefono) camposVacios.push('Teléfono principal');

        if (camposVacios.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos obligatorios',
                html: `Por favor completa los siguientes campos:<br>${camposVacios.join('<br>')}</b>`
            });
            return;
        }

        if (data.historiaClinica && !tiposPermitidos.includes(data.historiaClinica.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo no permitido',
                text: 'La historia clínica solo puede ser PDF o Word.',
            });
            return;
        }

        if (data.patologia && !tiposPermitidos.includes(data.patologia.type)) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo no permitido',
                text: 'La patología solo puede ser PDF o Word.',
            });
            return;
        }


        post(route('paciente.store'), {
            onSuccess: () => {
                reset();
                historiaClinicaRef.current.value = '';
                patologiaRef.current.value = '';
                imagenesRef.current.value = '';
                Swal.fire({
                    icon: 'success',
                    title: 'Registro exitoso',
                    text: 'El paciente fue registrado correctamente.',
                });
            },
            onError: () => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ocurrió un error al registrar el paciente.',
                });
            },
        });
    };

    const inputClass = "peer py-2.5 pe-0 ps-8 block w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-gray-300 text-base text-gray-900 placeholder:text-gray-400 focus:border-t-transparent focus:border-x-transparent focus:border-b-teal-400 focus:ring-0 focus:outline-none disabled:opacity-50";
    const getInputClass = (value) => {
        const base = "peer py-2.5 pe-0 ps-8 block w-full border-t-transparent border-b-2 border-x-transparent text-base focus:border-t-transparent focus:border-x-transparent focus:border-b-teal-400 focus:ring-0 focus:outline-none disabled:opacity-50 transition-colors duration-300";
        return value
            ? `${base} bg-teal-50 border-b-teal-400 text-teal-700`
            : `${base} bg-transparent border-b-gray-300 text-gray-900 placeholder:text-gray-400`;
    };
    const iconClass = "absolute inset-y-0 start-0 flex items-center pointer-events-none ps-2 text-gray-400";

    const calcularEdad = (fecha) => {
        if (!fecha) return;
        const hoy = new Date();
        const nacimiento = new Date(fecha);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mes = hoy.getMonth() - nacimiento.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        setData(data => ({ ...data, fecha_nacimiento: fecha, edad: edad.toString() }));
    };
    const soloNumeros = (e) => {
        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
        }
    };







    const formRef = useRef(null);

    const focusAdjacentField = (direction) => {
        const form = formRef.current;
        if (!form) return;

        const focusables = Array.from(
            form.querySelectorAll('input, select, button[type="submit"]')
        ).filter(el => !el.disabled && el.offsetParent !== null);

        const currentIndex = focusables.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        const next = focusables[currentIndex + direction];
        if (next) {
            next.focus();
            if (typeof next.select === 'function' && next.tagName === 'INPUT' && next.type !== 'file') {
                next.select();
            }
        }
    };

    const handleFormKeyDown = (e) => {
        const target = e.target;

        if (target.tagName === 'BUTTON') return;
        if (target.type === 'file') return;
        if (target.closest('.react-datepicker-wrapper')) return;

        const isEnter = e.key === 'Enter';
        const isArrowDown = e.key === 'ArrowDown';
        const isArrowUp = e.key === 'ArrowUp';

        if (!isEnter && !isArrowDown && !isArrowUp) return;
        if (target.tagName === 'SELECT' && !isEnter) return;

        e.preventDefault();
        focusAdjacentField(isArrowUp ? -1 : 1);
    };


    const historiaClinicaRef = useRef(null);
    const patologiaRef = useRef(null);
    const imagenesRef = useRef(null);
    return (
        <AuthenticatedLayout>
            <Head title="Registro de Paciente" />
            {/* OVERLAY PANTALLA COMPLETA */}
            {processing && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-200/80">
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-3 items-center">
                            <span className="w-4 h-4 rounded-full bg-cyan-500 animate-bounce-fade [animation-delay:0s]" />
                            <span className="w-4 h-4 rounded-full bg-cyan-500 animate-bounce-fade [animation-delay:150ms]" />
                            <span className="w-4 h-4 rounded-full bg-cyan-500 animate-bounce-fade [animation-delay:300ms]" />
                            <span className="w-4 h-4 rounded-full bg-cyan-500 animate-bounce-fade [animation-delay:450ms]" />
                        </div>
                        <p className="text-slate-600 text-xs font-semibold">Registrando paciente...</p>
                    </div>
                </div>
            )}
            <div className="max-w-6xl mx-auto py-12 px-6">
                <h1 className="text-xl font-bold text-white  bg-teal-500 px-6 py-3">
                    Registro de incidencias
                </h1>
                <div className="border border-gray-200 rounded-b-lg px-8 py-8 shadow">
                    <form ref={formRef} onSubmit={submit} onKeyDown={handleFormKeyDown} className="space-y-6">
                        <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2">
                            Identificación del paciente
                        </h2>
                        <div className="grid grid-cols-2 gap-6">

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 10h2" />
                                        <path d="M16 14h2" />
                                        <path d="M6.17 15a3 3 0 0 1 5.66 0" />
                                        <circle cx="9" cy="11" r="2" />
                                        <rect x="2" y="5" width="20" height="14" rx="2" />
                                    </svg>
                                </div>
                                <select
                                    value={data.tipo_documento}
                                    onChange={e => setData('tipo_documento', e.target.value)}
                                    className={getInputClass(data.tipo_documento)}
                                >
                                    <option value="" disabled>Tipo de documento</option>
                                    <option value="TI">TI - Tarjeta de Identidad</option>
                                    <option value="CC">CC - Cédula de Ciudadanía</option>
                                    <option value="CE">CE - Cédula de Extranjería</option>
                                    <option value="PA">PA - Pasaporte</option>
                                    <option value="CD">CD - Carné Diplomático</option>
                                    <option value="SC">SC - Salvoconducto de Permanencia</option>
                                    <option value="PR">PR - Pasaporte de la ONU</option>
                                    <option value="PE">PE - Permiso Especial de Permanencia</option>
                                    <option value="AS">AS - Adulto sin Identificación</option>
                                    <option value="PT">PT - Permiso por Protección Temporal</option>
                                </select>
                                {errors.tipo_documento && <p className="text-red-500 text-xs mt-1">{errors.tipo_documento}</p>}
                            </div>

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7V4h16v3" /><path d="M9 20h6" /><path d="M12 4v16" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Número de documento"
                                    value={data.numero_documento}
                                    onChange={e => setData('numero_documento', e.target.value.toUpperCase())}
                                    onBlur={verificarDocumento}
                                    className={getInputClass(data.numero_documento)}
                                />
                                {errors.numero_documento && <p className="text-red-500 text-xs mt-1">{errors.numero_documento}</p>}
                            </div>
                        </div>

                        {/* Nombres y apellidos separados */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Primer nombre"
                                    value={data.nombre1}
                                    onChange={e => setData('nombre1', e.target.value.toUpperCase())}
                                    className={getInputClass(data.nombre1)}
                                />
                                {errors.nombre1 && <p className="text-red-500 text-xs mt-1">{errors.nombre1}</p>}
                            </div>

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Segundo nombre (opcional)"
                                    value={data.nombre2}
                                    onChange={e => setData('nombre2', e.target.value.toUpperCase())}
                                    className={getInputClass(data.nombre2)}
                                />
                                {errors.nombre2 && <p className="text-red-500 text-xs mt-1">{errors.nombre2}</p>}
                            </div>

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Primer apellido"
                                    value={data.apellido1}
                                    onChange={e => setData('apellido1', e.target.value.toUpperCase())}
                                    className={getInputClass(data.apellido1)}
                                />
                                {errors.apellido1 && <p className="text-red-500 text-xs mt-1">{errors.apellido1}</p>}
                            </div>

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Segundo apellido (opcional)"
                                    value={data.apellido2}
                                    onChange={e => setData('apellido2', e.target.value.toUpperCase())}
                                    className={getInputClass(data.apellido2)}
                                />
                                {errors.apellido2 && <p className="text-red-500 text-xs mt-1">{errors.apellido2}</p>}
                            </div>
                        </div>

                        <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2 mt-4">
                            Datos personales
                        </h2>
                        <div className="grid grid-cols-3 gap-6">

                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Fecha de nacimiento
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                                <DatePicker
                                    selected={data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : null}
                                    onChange={(date) => {
                                        const formatted = date.toISOString().split('T')[0];
                                        calcularEdad(formatted);
                                    }}
                                    maxDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    locale={es}
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100}
                                    placeholderText="dd/mm/aaaa"
                                    className={getInputClass(data.fecha_nacimiento)}
                                />
                                {errors.fecha_nacimiento && <p className="text-red-500 text-xs mt-1">{errors.fecha_nacimiento}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Edad
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                                <input
                                    type="number"
                                    placeholder=""
                                    value={data.edad}
                                    readOnly
                                    onChange={e => setData('edad', e.target.value)}
                                    className={getInputClass(data.edad)}
                                />
                                {errors.edad && <p className="text-red-500 text-xs mt-1">{errors.edad}</p>}
                            </div>

                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Sexo
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 15v7" />
                                        <path d="M9 19h6" />
                                        <circle cx="12" cy="9" r="6" />
                                    </svg>
                                </div>
                                <select
                                    value={data.sexo}
                                    onChange={e => setData('sexo', e.target.value)}
                                    className={getInputClass(data.sexo)}
                                >
                                    <option value="" disabled>Selecione...</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                </select>
                                {errors.sexo && <p className="text-red-500 text-xs mt-1">{errors.sexo}</p>}
                            </div>

                        </div>

                        <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2 mt-4">
                            Contacto
                        </h2>
                        {/* Fila 3: Teléfono y Correo */}
                        <div className="grid grid-cols-3 gap-6">
                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Teléfono principal"
                                    value={data.telefono}
                                    onKeyDown={soloNumeros}
                                    onChange={e => setData('telefono', e.target.value)}
                                    className={getInputClass(data.telefono)}
                                />
                                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
                            </div>

                            <div className="relative">
                                <div className={iconClass}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Teléfono secundario (opcional)"
                                    value={data.telefono2}
                                    onKeyDown={soloNumeros}
                                    onChange={e => setData('telefono2', e.target.value)}
                                    className={getInputClass(data.telefono2)}
                                />
                                {errors.telefono2 && <p className="text-red-500 text-xs mt-1">{errors.telefono2}</p>}
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
                                    className={getInputClass(data.correo)}
                                />
                                {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
                            </div>
                        </div>

                        <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider mb-2 mt-4">
                            Información médica
                        </h2>
                        <div className="grid grid-cols-3 gap-6">

                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Fecha de diagnóstico
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                </div>
                                <DatePicker
                                    selected={data.fecha_diagnostico ? new Date(data.fecha_diagnostico) : null}
                                    onChange={(date) => {
                                        const formatted = date.toISOString().split('T')[0];
                                        setData('fecha_diagnostico', formatted);
                                    }}
                                    maxDate={new Date()}
                                    dateFormat="dd/MM/yyyy"
                                    locale={es}
                                    showYearDropdown
                                    scrollableYearDropdown
                                    yearDropdownItemNumber={100}
                                    placeholderText="dd/mm/aaaa"
                                    className={getInputClass(data.fecha_diagnostico)}
                                />
                                {errors.fecha_diagnostico && <p className="text-red-500 text-xs mt-1">{errors.fecha_diagnostico}</p>}
                            </div>
                            {/* HISTORIA CLINICA  */}
                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Subir historia clinica
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </div>
                                <input
                                    ref={historiaClinicaRef}
                                    type="file"
                                    onChange={e => setData('historiaClinica', e.target.files[0])}
                                    className="ps-8 block w-full text-sm text-gray-400 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-b-teal-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-base file:bg-teal-200 file:text-teal-600 hover:file:bg-teal-300"
                                />
                                {errors.historiaClinica && <p className="text-red-500 text-xs mt-1">{errors.historiaClinica}</p>}
                            </div>

                            {/* PATOLOGIA*/}
                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Subir patología
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </div>
                                <input
                                    ref={patologiaRef}
                                    type="file"
                                    onChange={e => setData('patologia', e.target.files[0])}
                                    className="ps-8 block w-full text-sm text-gray-400 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-b-teal-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-base file:bg-teal-200 file:text-teal-600 hover:file:bg-teal-300"
                                />
                                {errors.patologia && <p className="text-red-500 text-xs mt-1">{errors.patologia}</p>}
                            </div>

                            {/*IMAGENES*/}
                            <div className="relative">
                                <label className="block text-base text-gray-400 mb-1 ps-8">
                                    Subir imágenes diagnósticas
                                </label>
                                <div className={iconClass} style={{ top: '28px' }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                </div>
                                <input
                                    ref={imagenesRef}
                                    type="file"
                                    onChange={e => setData('imagenes', e.target.files[0])}
                                    className="ps-8 block w-full text-sm text-gray-400 border-b-2 border-gray-300 bg-transparent focus:outline-none focus:border-b-teal-400 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-base file:bg-teal-200 file:text-teal-600 hover:file:bg-teal-300"
                                />
                            </div>

                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            disabled={processing || verificando}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 rounded-lg transition duration-150 mt-4 disabled:opacity-50"
                        >
                            Registrar incidencia
                        </button>

                    </form>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}