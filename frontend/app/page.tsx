'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Bloxtek Technical Test</h1>
      <button
        onClick={() => router.push('/login')}
        className="w-min bg-primary mt-5 text-primary-foreground py-2.5 px-24 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
      Continuar
      </button>
    </main>
  );
}