export default function FiqhLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-[430px] mx-auto min-h-screen bg-background px-5 pt-6 pb-8 flex flex-col relative shadow-xl shadow-black/5">
            {children}
        </div>
    );
}
