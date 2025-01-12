/** @format */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlaylistInterface from '@/constant/PlaylistInterface';
import { TrackInterface } from '@/constant/TrackInterface';
import { Pause, Play, ThumbsDown, ThumbsUp, Trash } from 'lucide-react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';

type MusicListProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
	title?: string;
	currentTrack: TrackInterface | undefined;
};

type TrackProps = {
	playlist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
	setCurrentTrack: (track: TrackInterface) => void;
	currentTrack: TrackInterface | undefined;
};

function TrackDisplayed({ playlist, setCurrentPlaylist, setCurrentTrack, currentTrack }: TrackProps) {
	const handleLike = (e: any, id: string, value: boolean | undefined) => {
		e.stopPropagation();
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				name: prev.name,
				tracks: prev.tracks?.map((track) => (track.id === id ? { ...track, liked: value } : track)),
			};
		});
	};

	const handleRemove = (e: any, id: string) => {
		e.stopPropagation();
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				tracks: prev.tracks?.filter((track) => track.id !== id),
			};
		});
	};

	const handlePlay = (e: any, track: TrackInterface) => {
		e.stopPropagation();
		setCurrentTrack(track);
		setTimeout(() => {
			setCurrentTrack({ ...track, listening: !track.listening });
		}, 0);
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			if (track.listening) {
				return {
					...prev,
					name: prev.name,
					tracks: prev.tracks?.map((t) => ({ ...t, listening: false })),
				};
			}

			return {
				...prev,
				name: prev.name,
				tracks: prev.tracks?.map((t) =>
					t.id === track.id ? { ...t, listening: true } : { ...t, listening: false },
				),
			};
		});
	};

	const handleSelected = (track: TrackInterface) => {
		// if (currentTrack?.id === track.id) {
		// 	setCurrentTrack(null);
		// }
		setCurrentTrack(track);
		setCurrentPlaylist((prev) => {
			if (!prev) return prev;

			return {
				...prev,
				name: prev.name,
				tracks: prev.tracks?.map((t) =>
					({ ...t, listening: false }),
				),
			};
		});
	};

	return (
		<Table className='overflow-y-scroll'>
			{/* <TableCaption>A list of your recent invoices.</TableCaption> */}
			<TableHeader>
				<TableRow>
					<TableHead>#</TableHead>
					<TableHead className='w-[500px]'>Title</TableHead>
					<TableHead>Album</TableHead>
					<TableHead>Date added</TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{playlist?.tracks?.map((track, index) => {
					return (
						<TableRow key={index} onClick={() => handleSelected(track)} className='cursor-pointer'>
							<TableCell>{index + 1}</TableCell>
							<TableCell className='font-medium'>{track.title}</TableCell>
							<TableCell>{track.album[0]}</TableCell>
							<TableCell>{track.release_date}</TableCell>
							<TableCell className=''>
								<div className='flex space-x-2'>
									<Button
										variant='outline'
										size='sm'
										className='items-center'
										onClick={(e) => handlePlay(e, track)}>
										{track.listening ? <Pause /> : <Play />}
									</Button>
									<Button
										variant='outline'
										size='sm'
										className={`${
											track.liked === true
												? 'hover:bg-green-500 bg-green-500 text-white'
												: track.liked === false
												? 'hover:bg-red-500 bg-red-500 text-white'
												: 'bg-gray-100'
										} items-center`}
										onClick={(e) => handleLike(e, track.id, track.liked === true ? undefined : true)}>
										<ThumbsUp />
									</Button>
									<Button
										variant='outline'
										size='sm'
										className={`${
											track.liked === false
												? 'hover:bg-red-500 bg-red-500 text-white'
												: track.liked === true
												? 'bg-green-500 text-white'
												: 'bg-gray-100'
										} items-center`}
										onClick={(e) => handleLike(e, track.id, track.liked === false ? undefined : false)}>
										<ThumbsDown />
									</Button>
									<Button
										className='items-center'
										variant='destructive'
										size='sm'
										onClick={(e) => handleRemove(e, track.id)}>
										<Trash />
									</Button>
								</div>
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
	currentTrack,
}: MusicListProps) {
	return (
		<Card className='w-full h-full flex flex-col shadow-lg overflow-y-scroll'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
						{playlist?.name || title || 'No Playlist Selected'}
					</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-2 w-full'>
				<TrackDisplayed playlist={playlist} setCurrentPlaylist={setCurrentPlaylist} setCurrentTrack={setCurrentTrack} currentTrack={currentTrack} />
			</CardContent>
		</Card>
	);
}
