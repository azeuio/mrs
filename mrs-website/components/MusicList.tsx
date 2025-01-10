/** @format */

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackInterface } from '@/constant/TrackInterface';
import { Pause, Play, ThumbsDown, ThumbsUp, Trash } from 'lucide-react';

type MusicListProps = {
	tracks: TrackInterface[];
	setTracks: React.Dispatch<React.SetStateAction<TrackInterface[]>>;
	setCurrentTrack: (track: TrackInterface) => void;
	playlistIndex: number;
};

export default function MusicList({
	tracks,
	setTracks,
	setCurrentTrack,
	playlistIndex,
}: MusicListProps) {
	const handleLike = (id: string, value: boolean | undefined) => {
		setTracks((prev: TrackInterface[]) =>
			prev.map((track) => (track.id === id ? { ...track, liked: value } : track)),
		);
	};

	const handleRemove = (id: string) => {
		setTracks((prev: TrackInterface[]) => prev.filter((track) => track.id !== id));
	};

	const handlePlay = (track: TrackInterface) => {
		tracks.forEach((track) => (track.listening = false));
		track.listening = true;
		setCurrentTrack(track);
	};

	return (
		<Card className='w-full h-full flex flex-col shadow-lg'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>
						Playlist {playlistIndex + 1}
					</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-2 w-full'>
				{tracks.map((track) => (
					<div key={track.id} className='flex w-full p-1 justify-between items-center'>
						<div className='flex items-center'>
							<span className='text-sm font-medium mr-2'>{track.title}</span>
						</div>
						<div className='flex space-x-2'>
							<Button
								variant='outline'
								size='sm'
								className='items-center'
								onClick={() => handlePlay(track)}>
								{track.listening ? <Pause /> : <Play />}
							</Button>
							<Button
								variant='outline'
								size='sm'
								className={`${
									track.liked === true
										? 'hover:bg-green-500 bg-green-500 text-white'
										: 'bg-gray-100'
								} items-center`}
								onClick={() => handleLike(track.id, track.liked === true ? undefined : true)}>
								<ThumbsUp />
							</Button>
							<Button
								variant='outline'
								size='sm'
								className={`${
									track.liked === false ? 'hover:bg-red-500 bg-red-500 text-white' : 'bg-gray-100'
								} items-center`}
								onClick={() => handleLike(track.id, track.liked === false ? undefined : false)}>
								<ThumbsDown />
							</Button>
							<Button
								className='items-center'
								variant='destructive'
								size='sm'
								onClick={() => handleRemove(track.id)}>
								<Trash />
							</Button>
						</div>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
