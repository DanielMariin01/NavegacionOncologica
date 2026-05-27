export default function Background({ children }) {
    return (
        <section
            className="min-h-screen"
            style={{ backgroundColor: '#6272b0' }}
        >
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen bg-black/20">
                {children}
            </div>
        </section>
    );
}