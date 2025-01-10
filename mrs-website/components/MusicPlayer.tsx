/** @format */

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackInterface } from '../constant/TrackInterface';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export default function MusicPlayer({
	track,
	playlist,
	trackIndex,
	setTrackIndex,
	setTrack,
}: {
	track: TrackInterface | null;
	playlist: TrackInterface[];
	trackIndex: number | undefined;
	setTrackIndex: (index: number) => void;
	setTrack: (updatedTrack: TrackInterface) => void;
}) {
	if (!track) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<Card className='w-full h-full flex flex-col justify-center items-center shadow-lg'>
					<CardContent>Select a track to play</CardContent>
				</Card>
			</div>
		);
	}

	const handleLike = () => setTrack({ ...track, liked: true });
	const handleDislike = () => setTrack({ ...track, liked: false, listening: false });
	const handleTrackEnd = () => {
		if (trackIndex !== undefined) {
			setTrack({ ...track, listened: true, listening: false });
			const nextIndex = trackIndex + 1 < playlist.length ? trackIndex + 1 : 0;
			setTrackIndex(nextIndex);
			setTrack(playlist[nextIndex]);
		}
	};

	return (
		<div className='w-full h-full flex flex-col justify-center'>
			<Card className='w-full h-full flex flex-col justify-between shadow-lg'>
				<CardHeader>
					<CardTitle>
						<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{track.title}</h3>
					</CardTitle>
					<div className='mt-4'>
						{track?.src ? (
							track.src.endsWith('.mp4') ? (
								<video controls key={track.src} onEnded={handleTrackEnd} className='rounded-lg'>
									<source src={track.src} type='video/mp4' />
									Your browser does not support the video element.
								</video>
							) : (
								<>
									<Image
										src={track.image || '/fallback-image.jpg'}
										alt='Music Cover'
										width={400}
										height={400}
										className='rounded-lg'
									/>
									<audio controls key={track.src} onEnded={handleTrackEnd} className='mt-4 w-full'>
										<source src={track.src} type='audio/mpeg' />
										Your browser does not support the audio element.
									</audio>
								</>
							)
						) : (
							<div>
								<Image
									src={track.image || '/fallback-image.jpg'}
									alt='Music Cover'
									width={400}
									height={400}
									className='rounded-lg'
								/>
								<p className='mt-4 text-center'>
									Preview not available.{' '}
									<a
										href={track?.external_urls?.spotify}
										target='_blank'
										rel='noopener noreferrer'
										className='text-blue-500'>
										Listen on Spotify
									</a>
								</p>
							</div>
						)}
					</div>
				</CardHeader>
				<CardFooter className='flex justify-between items-center player-footer'>
					<p className='mt-4 text-center'>
						{track.liked === true && 'You liked this!'}
						{track.liked === false && 'You disliked this.'}
						{track.liked === undefined && 'No feedback yet.'}
					</p>
					<div className='flex justify-center space-x-4 mt-6'>
						<Button
							variant='default'
							onClick={handleLike}
							title='Like this track'
							className={`px-4 py-2 flex items-center ${
								track.liked === true ? 'hover:bg-green-500 bg-green-500' : 'bg-gray-400'
							}`}>
							<ThumbsUp />
						</Button>
						<Button
							variant='default'
							onClick={handleDislike}
							title='Dislike this track'
							className={`px-4 py-2 flex items-center ${
								track.liked === false ? 'hover:bg-red-500 bg-red-500' : 'bg-gray-400'
							}`}>
							<ThumbsDown />
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
