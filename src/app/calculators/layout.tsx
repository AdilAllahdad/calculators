import Sidebar from '@/components/Sidebar';

export default function CalculatorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 p-6 overflow-y-auto content-area">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
