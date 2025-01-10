/** @format */

'use client';

import MusicList from '@/components/MusicList';
import { TrackInterface } from '../../constant/TrackInterface';
import MusicPlayer from '@/components/MusicPlayer';
import { useState } from 'react';
import Playlist from '@/components/Playlist';

export default function Home() {
	const [tracks, setTracks] = useState<TrackInterface[]>([
		{
			id: '1',
			title: 'Track 1',
			src: '/music1.mp4',
			image: '/music_cover1.png',
			liked: undefined,
			listened: false,
			listening: false,
		},
		{
			id: '2',
			title: 'Track 2',
			src: '/music2.mp3',
			image: '/music_cover2.png',
			liked: undefined,
			listened: false,
			listening: false,
		},
		{
			id: '3',
			title: 'Track 3',
			src: '/music3.mp3',
			image: '/music_cover3.png',
			liked: undefined,
			listened: false,
			listening: false,
		},
	]);

	const [playlist, setPlaylist] = useState<TrackInterface[][]>([tracks, tracks]);
	const [currentTrack, setCurrentTrack] = useState<TrackInterface | null>(null);
	const [currentPlaylist, setCurrentPlaylist] = useState<number>(0);

	return (
		<div className='h-screen w-4/5 m-auto flex flex-row justify-around items-center'>
			<div className='w-96 h-[650px] p-2'>
				<MusicList playlistIndex={currentPlaylist} tracks={playlist[currentPlaylist]} setTracks={setTracks} setCurrentTrack={setCurrentTrack} />
			</div>
			<div className='w-[650px] h-[650px] p-2'>
				<MusicPlayer track={currentTrack} setTrack={setCurrentTrack} />
			</div>
			<div className='w-96 h-[650px] p-2'>
				<Playlist
					playlist={playlist}
					currentPlaylist={currentPlaylist}
					setCurrentPlaylist={setCurrentPlaylist}
				/>
			</div>
		</div>
	);
}
