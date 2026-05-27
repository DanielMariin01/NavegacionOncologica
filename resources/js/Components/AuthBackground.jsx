export default function AuthBackground({ children }) {
    return (
        <section
            className="min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/imagenes/fondo.jpg')" }}
        >
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen bg-black/60">
                {children}
            </div>
        </section>
    );
}