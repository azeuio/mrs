/** @format */

'use client';

import { SidebarProvider } from '@/components/ui/sidebar';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider>
			{/* <div className='flex h-screen'> */}
				{/* <main className='flex-1 p-4'>{children}</main> */}
				{children}
			{/* </div> */}
		</SidebarProvider>
	);
}
