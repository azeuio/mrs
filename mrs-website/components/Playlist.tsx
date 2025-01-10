/** @format */

import { TrackInterface } from '@/constant/TrackInterface';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

type PlaylistProps = {
	playlist: TrackInterface[][];
	currentPlaylist: number;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<number>>;
};

export default function Playlist({ playlist, currentPlaylist, setCurrentPlaylist }: PlaylistProps) {
	const selectPlaylist = (index: number) => {
		setCurrentPlaylist(index);
	};

	return (
		<Card className='w-full h-full flex flex-col shadow-lg'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Music Playist</h3>
				</CardTitle>
			</CardHeader>{' '}
			<CardContent className='flex flex-col gap-4 w-full'>
				{playlist.map((tracks, index) => (
					<div
						key={index}
						className={`w-full p-4 rounded-md flex items-center justify-between ${
							currentPlaylist === index ? 'bg-blue-200' : 'bg-gray-100'
						}`}>
						<h4 className='text-lg font-semibold'>Playlist {index + 1}</h4>
						<Button
							variant={currentPlaylist === index ? 'default' : 'outline'}
							onClick={() => selectPlaylist(index)}>
							{currentPlaylist === index ? 'Selected' : 'Select'}
						</Button>
					</div>
				))}
			</CardContent>
		</Card>
	);
}
