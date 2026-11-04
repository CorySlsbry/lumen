import { BottomNav } from "@/components/dashboard/BottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh text-white lumen-night relative">
      <div className="pointer-events-none absolute top-0 inset-x-0 h-96 opacity-30 blur-3xl lumen-aurora" />
      <div className="relative z-10 mx-auto max-w-md pb-24">{children}</div>
      <BottomNav />
    </div>
  );
}
