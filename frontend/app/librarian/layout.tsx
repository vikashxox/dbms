import { Sidebar } from "@/components/sidebar";

export default function LibrarianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar role="librarian" />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
