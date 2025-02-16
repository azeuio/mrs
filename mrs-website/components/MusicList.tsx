/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlaylistInterface from '@/constant/PlaylistInterface';
import { TrackInterface } from '@/constant/TrackInterface';
import {
	AudioLines,
	CheckIcon,
	CirclePlus,
	TimerIcon,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import Image from 'next/image';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import React from 'react';

type MusicListProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
	setPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface[]>>;
	playlists: PlaylistInterface[];
	title?: string;
};

type TrackProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
};

const formatDuration = (ms: number) => {
	const totalSeconds = Math.floor(ms / 1000);
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

function TrackDisplayed({ playlist, setCurrentPlaylist, setCurrentTrack }: TrackProps) {
	const handleRemove = (id: string) => {
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				tracks: prev.tracks?.filter((track) => track.id !== id),
			};
		});
	};

	const handlePlay = (track: TrackInterface) => {
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				name: prev.name,
				tracks: prev.tracks?.map((t) =>
					t.id === track.id ? { ...t, listening: true } : { ...t, listening: false },
				),
			};
		});
		setCurrentTrack(track);
		const username = document.cookie.split('; ').find((row) => row.startsWith('user_email'))?.split('=')[1];
		if (!username) {
			console.error('No user found');
			return;
		}
		fetch(`http://localhost:5000/play/${JSON.stringify(track.title)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username }),
		});
	};

	return (
		<Table>
			{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
			<TableHeader>
				<TableRow>
					<TableHead className='w-[5%] text-center'>#</TableHead>
					<TableHead className='w-[35%]'>Title</TableHead>
					<TableHead className='w-[25%]'>Album</TableHead>
					<TableHead className='w-[20%]'>Date added</TableHead>
					<TableHead className='w-[5%]'></TableHead>
					<TableHead className='w-[5%]'>
						<TimerIcon className='text-gray-400' />
					</TableHead>
					<TableHead className='w-[5%]'></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlist?.tracks?.map((track, index) => {
					return (
						<TableRow
							className='group hover:cursor-pointer'
							key={index}
							onClick={() => handlePlay(track)}>
							<TableCell className='text-center'>
								{track.listening ? <AudioLines color='green' /> : index + 1}
							</TableCell>
							<TableCell className='flex items-center gap-2'>
								<Image
									src={track.image || '/fallback-image.jpg'}
									alt='Music Cover'
									width={40}
									height={40}
									className='rounded-lg'
								/>
								<div className='flex flex-col'>
									<p className='leading-5 font-bold'>{track.title}</p>
									<p className='leading-5'>{track.artist}</p>
								</div>
							</TableCell>
							<TableCell>{track.album}</TableCell>
							<TableCell>{track.release_date}</TableCell>
							<TableCell>
								<Button
									className={cn(
										playlist.researched ? '' : 'bg-green-400 hover:bg-green-600',
										'w-6 h-6 rounded-full items-center justify-center hidden group-hover:flex',
									)}
									variant='ghost'
									size='sm'
									onClick={(e) => {
										e.stopPropagation();
										if (track.id) handleRemove(track.id);
									}}>
									{!playlist.researched ? <CheckIcon /> : <CirclePlus />}
								</Button>
							</TableCell>
							<TableCell>{!track.duration ? '0:00' : formatDuration(track.duration)} </TableCell>
							<TableCell>
								<DropdownMenu>
									<DropdownMenuTrigger className='hidden group-hover:flex items-center justify-center'>
										...
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuLabel>My Account</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>Profile</DropdownMenuItem>
										<DropdownMenuItem>Billing</DropdownMenuItem>
										<DropdownMenuItem>Team</DropdownMenuItem>
										<DropdownMenuItem>Subscription</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					);
				})}
			</TableBody>
		</Table>
	);
}

export default function MusicList({
	title,
	playlist,
	setCurrentPlaylist,
	setCurrentTrack,
	setPlaylist,
	playlists,
}: MusicListProps) {
	console.log('playlist', playlist);
	const [isBusy, setIsBusy] = React.useState(false);

	const savePlaylist = async () => {
		if (!playlist) return;
		setIsBusy(true);
		const prevName = playlist.name;
		if (playlist.name.toLowerCase() === 'least played songs') {
			playlist.name = `Least Played Songs ${new Date().toLocaleDateString()}`;
		}
		playlist.name = playlist.name.replace('Results for ', '');
		const newPlaylist = await fetch('http://localhost:5000/api/playlists', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(playlist),
		}).then((res) => res.json());
		setPlaylist([...playlists.filter((p) => p.name !== prevName), newPlaylist]);
		setCurrentPlaylist(newPlaylist);
		setIsBusy(false);
	};

	const deletePlaylist = async () => {
		if (!playlist) return;
		setIsBusy(true);
		const response = await fetch(`http://localhost:5000/api/playlists/${playlist.name}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		setCurrentPlaylist(undefined);
		setPlaylist(playlists.filter((p) => p.name !== playlist.name));
		setIsBusy(false);
	};

	return (
		<Card className='w-full h-full flex flex-col shadow-lg overflow-y-scroll'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
						{playlist?.name || title}
					</h3>
					<div className='flex justify-end'>
						{(playlist?.isTemporary || playlist?.name?.toLowerCase() === 'least played songs') ? (
							<Button
								className='bg-blue-500 text-white rounded p-2'
								onClick={savePlaylist}
								disabled={isBusy}
							>
									Save Playlist
							</Button>
						) : (
							<Button
								className='bg-blue-500 text-white rounded p-2'
								onClick={deletePlaylist}
								disabled={isBusy}
							>
									Delete playlist
							</Button>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-2 w-full'>
				{!playlist?.tracks ? (
					<div>
						<p className='text-center'>Loading...</p>
					</div>
				) : (
					<TrackDisplayed
						playlist={playlist}
						setCurrentPlaylist={setCurrentPlaylist}
						setCurrentTrack={setCurrentTrack}
					/>
				)}
			</CardContent>
		</Card>
	);
}
