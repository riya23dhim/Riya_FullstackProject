
export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#E5E7EB] border-t-[#4F46E5] rounded-full animate-spin"></div>
            </div>
            <div className="mt-8 text-center">
                <h2 className="text-xl font-bold text-[#111827] tracking-tight">Syncing Workspace</h2>
                <p className="text-[#6B7280] font-medium text-xs mt-2 animate-pulse">Establishing secure connection to nexus...</p>
            </div>
        </div>
    );
}
