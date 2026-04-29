import { Sidebar } from "@/components/sidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="member" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
