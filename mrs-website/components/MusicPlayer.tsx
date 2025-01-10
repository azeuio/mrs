/** @format */

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackInterface } from '../constant/TrackInterface';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

export default function MusicPlayer({
	track,
	setTrack,
}: {
	track: TrackInterface | null;
	setTrack: (updatedTrack: TrackInterface) => void;
}) {
	if (!track) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<div className='w-full h-full'>
					<Card className='w-full h-full flex flex-col justify-center items-center shadow-lg'>
						<CardContent>Select a track to play</CardContent>
					</Card>{' '}
				</div>{' '}
			</div>
		);
	}

	const handleLike = () => {
		if (track) {
			const updatedTrack = { ...track, liked: true };
			setTrack(updatedTrack);
		}
	};

	const handleDislike = () => {
		if (track) {
			const updatedTrack = { ...track, liked: false, listening: false };
			setTrack(updatedTrack);
		}
	};

	const handleTrackEnd = () => {
		if (track) {
			const updatedTrack = { ...track, listened: true, listening: false };
			setTrack(updatedTrack);
		}
	};

	return (
		<div className='w-full h-full flex flex-col justify-center'>
			<div className='w-full h-full'>
				<Card className='w-full h-full flex flex-col justify-between shadow-lg'>
					<CardHeader>
						<CardTitle>{track.title}</CardTitle>
						<div className='mt-4'>
							{track.src.endsWith('.mp4') ? (
								<video controls key={track.src} onEnded={handleTrackEnd} className='rounded-lg'>
									<source src={track.src} type='video/mp4' />
									Your browser does not support the video element.
								</video>
							) : (
								<>
									<Image
										src={track.image}
										alt='Music Cover'
										width={300}
										height={300}
										className='rounded-lg'
									/>
									<audio controls key={track.src} onEnded={handleTrackEnd} className='mt-4 w-full'>
										<source src={track.src} type='audio/mpeg' />
										Your browser does not support the audio element.
									</audio>
								</>
							)}
						</div>
					</CardHeader>
					{/* <CardContent className='flex flex-col '></CardContent> */}
					<CardFooter className='flex justify-between items-center'>
						<p className='mt-4 text-center'>
							{track.liked === undefined
								? 'No feedback yet.'
								: track.liked
								? 'You liked this!'
								: 'You disliked this.'}
						</p>
						<div className='flex justify-center space-x-4 mt-6'>
							<Button
								variant='default'
								onClick={handleLike}
								className={`px-4 py-2 flex items-center ${
									track.liked === true ? 'hover:bg-green-500 bg-green-500' : 'bg-gray-400'
								}`}>
								<ThumbsUp />
							</Button>
							<Button
								variant='default'
								onClick={handleDislike}
								className={`px-4 py-2 flex items-center ${
									track.liked === false ? 'hover:bg-red-500 bg-red-500' : 'bg-gray-400'
								}`}>
								<ThumbsDown />
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}
