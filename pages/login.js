import { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import { redirect, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    const submitType = e.nativeEvent.submitter.value;
    if (submitType == 'login') {
      fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Erreur de connexion');
      }})
        .then((data) => {
          router.push(`/search?message=${data.message}`);
        }).catch((err) => {
          router.push(`/login?error=${err.toString()}`);
        });
    } else if (submitType === 'register') {
      fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Erreur de connexion');
      }})
        .then((data) => {
          router.push(`/login?message=${data.message}`);
        }).catch((err) => {
          router.push(`/login?error=${err.message}`);
        });
    }
  };

  return (
    <MainLayout className="flex flex-col items-center justify-center" >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className='text-3xl font-bold mb-8'>
        Connexion</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4' id='f'>
          <div className='bg-stone-600 h-1 w-full self-center'/>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='p-1 rounded-sm text-stone-800'
            name='email'
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='p-1 rounded-sm text-stone-800'
            name='password'
          />
          {/* separator */}
          <div className='bg-stone-600 h-1 w-full self-center'/>
          <button type="submit" name="submit" value="login" className='hover:bg-stone-400 rounded-md transition-all duration-200 p-1'>Se connecter</button>
          <button type="submit" name="submit" value="register" className='hover:bg-stone-400 rounded-md transition-all duration-200 p-1'>Créer un compte</button>
        </form>
      </div>
    </MainLayout>
  );
}