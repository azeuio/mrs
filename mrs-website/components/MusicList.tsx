/** @format */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlaylistInterface from '@/constant/PlaylistInterface';
import { TrackInterface } from '@/constant/TrackInterface';
import {
	BadgePlus,
	Check,
	CheckIcon,
	CircleCheck,
	CirclePlus,
	TimerIcon,
	Trash,
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

type MusicListProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
	title?: string;
};

type TrackProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
};

const formatDuration = (ms: number) => {
	const totalSeconds = Math.floor(ms / 1000); // Convert to seconds
	const minutes = Math.floor(totalSeconds / 60); // Extract minutes
	const seconds = totalSeconds % 60; // Extract remaining seconds
	return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format as MM:SS
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
						<TableRow className='group' key={index} onClick={() => handlePlay(track)}>
							<TableCell className='text-center'>{index + 1}</TableCell>
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
										handleRemove(track.id);
									}}>
									{!playlist.researched ? <CheckIcon /> : <CirclePlus />}
								</Button>
							</TableCell>
							<TableCell>{!track.duration ? "0:00" : formatDuration(track.duration)} </TableCell>
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
}: MusicListProps) {
	console.log('playlist', playlist);
	return (
		<Card className='w-full h-full flex flex-col shadow-lg overflow-y-scroll'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
						{playlist?.name || title}
					</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-2 w-full'>
				<TrackDisplayed
					playlist={playlist}
					setCurrentPlaylist={setCurrentPlaylist}
					setCurrentTrack={setCurrentTrack}
				/>
			</CardContent>
		</Card>
	);
}
