import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function MainLayout({ children, className }) {
  const router = useRouter();
  const message = useSearchParams().get('message');
  const error = useSearchParams().get('error');


  return (
    <div className={"min-h-screen min-w-[100vw] bg-stone-500 text-white p-4" }>
      {message && <div className="flex justify-between top-0 left-0 bg-emerald-800 p-4 w-full font-bold">
        {message}
        <button onClick={() => router.push(window.location.pathname)}>X</button>
      </div>}
      {error && <div className="flex justify-between top-0 left-0 bg-amber-700 p-4 w-full font-bold">
        {error}
        <button onClick={() => router.push(window.location.pathname)}>X</button>
      </div>}
      <div className={className}>
        {children}
      </div>
    </div>
  );
}
