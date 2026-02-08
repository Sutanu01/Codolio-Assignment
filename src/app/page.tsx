import { SheetView } from "@/components/sheet/SheetView";

export default function Home() {
  return (
    <main className="min-h-screen transition-colors">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <SheetView />
      </div>
    </main>
  );
}
