export default function Background({ children }) {
    return (
        <section
            className="min-h-screen"
            style={{ backgroundColor: '#1a3c5e' }}
        >
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen">
                {children}
            </div>
        </section>
    );
}