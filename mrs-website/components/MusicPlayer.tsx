/** @format */

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackInterface } from '../constant/TrackInterface';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PlaylistInterface from '@/constant/PlaylistInterface';

export default function MusicPlayer({
	track,
	playlist,
	trackIndex,
	setTrackIndex,
	setTrack,
}: {
	track: TrackInterface | undefined;
	playlist: PlaylistInterface | undefined;
	trackIndex: number | undefined;
	setTrackIndex: (index: number) => void;
	setTrack: (updatedTrack: TrackInterface) => void;
}) {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [videoStarted, setVideoStarted] = useState<boolean>(false);

	useEffect(() => {
		if (track && track.title) {
			axios
				.get(`/api/stream?title=${encodeURIComponent(track.title)}`)
				.then((response) => {
					console.log('Video URL:', response.data.videoUrl);
					setVideoUrl(`${response.data.videoUrl}`);
				})
				.catch((error) => {
					console.error('Error fetching video URL:', error);
					setVideoUrl(null);
				});
		}
	}, [track]);

	const handleVideoStart = () => {
		if (!videoStarted && track) {
			setVideoStarted(true);

			const payload = {
				title: track.title,
				artist: track.artist,
				album: track.album,
				release: Date.now(),
				username: Cookies.get('user_email'),
			};
			axios
				.post('http://127.0.0.1:5000/play', payload, {
					headers: {
						'Content-Type': 'application/json',
					},
				})
				.then((response) => {
					console.log('Song play recorded:', response.data.message);
				})
				.catch((error) => {
					console.error('Error recording song play:', error);
				});
		}
	};

	const handleLike = () => setTrack({ ...track, liked: true });
	const handleDislike = () => setTrack({ ...track, liked: false, listening: false });

	const handleTrackEnd = () => {
		if (trackIndex !== undefined) {
			setTrack({ ...track, listened: true, listening: false });
			const nextIndex = (trackIndex + 1) % playlist?.length;
			setTrackIndex(nextIndex);
			setTrack(playlist[nextIndex]);
		}
	};

	const feedbackMessage =
		track?.liked === true
			? 'You liked this!'
			: track?.liked === false
			? 'You disliked this.'
			: 'No feedback yet.';

	if (!track) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<Card className='w-full h-full flex flex-col justify-center items-center shadow-lg'>
					<CardContent>Select a track to play</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='w-full h-full flex flex-col justify-center'>
			<Card className='w-full h-full flex flex-col justify-between shadow-lg'>
				<CardHeader>
					<CardTitle>
						<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{track.title}</h3>
						<Image
							src={track.image || '/fallback-image.jpg'}
							alt='Music Cover'
							width={400}
							height={400}
							className='rounded-lg'
						/>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='mt-4'>
						{videoUrl ? (
							<iframe
								width='100%'
								height='400'
								src={videoUrl}
								title={track.title}
								allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
								allowFullScreen
								onLoad={handleVideoStart}
								onEnded={handleTrackEnd}
							/>
						) : (
							<div>
								<p className='text-center'>Loading...</p>
							</div>
						)}
					</div>
				</CardContent>

				<CardFooter className='flex justify-between items-center player-footer'>
					<p className='mt-4 text-center'>{feedbackMessage}</p>

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
