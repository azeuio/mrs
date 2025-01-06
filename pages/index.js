import Link from 'next/link';


export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-6">Bienvenue sur MRS</h1>
      <nav className="space-x-6">
        <Link href="/search" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Recherche
        </Link>
        <Link href="/login" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          Connexion
        </Link>
      </nav>
    </div>
  );
}
