/** @format */

'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await fetch('http://127.0.0.1:5000/api/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData),
			});
			const data = await response.json();
			console.log(data.message); // Handle the response (e.g., show success message)
		} catch (error) {
			console.error('Error during registration:', error);
		}
	};

	return (
		<div className={cn('flex flex-col gap-6', className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle className='text-2xl'>Register</CardTitle>
					<CardDescription>Enter your email and password to register an account</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit}>
						<div className='flex flex-col gap-6'>
							<div className='grid gap-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									name='email'
									type='email'
									placeholder='m@example.com'
									value={formData.email}
									onChange={handleChange}
									required
								/>
							</div>
							<div className='grid gap-2'>
								<div className='flex items-center'>
									<Label htmlFor='password'>Password</Label>
									<a
										href='#'
										className='ml-auto inline-block text-sm underline-offset-4 hover:underline'>
										Forgot your password?
									</a>
								</div>
								<Input
									id='password'
									name='password'
									type='password'
									value={formData.password}
									onChange={handleChange}
									required
								/>
							</div>
							<Button type='submit' className='w-full'>
								Register
							</Button>
						</div>
						<div className='mt-4 text-center text-sm'>
							Already have an account?{' '}
							<a href='/login' className='underline underline-offset-4'>
								Login
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
