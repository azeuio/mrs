/** @format */

'use client';
import MusicList from '@/components/MusicList';
import { TrackInterface } from '../../constant/TrackInterface';
import MusicPlayer from '@/components/MusicPlayer';
import { useEffect, useState } from 'react';
import Playlist from '@/components/Playlist';
import Research from '@/components/Research';

const tracks2: TrackInterface[] = [
	{
		id: '0',
		title: 'Track 4',
		src: '/music1.mp4',
		image: '/music_cover1.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
	{
		id: '1',
		title: 'Track 5',
		src: 'https://open.spotify.com/track/6hKkzk8UlVUj9ioPCyeH1O',
		image: '/music_cover2.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
	{
		id: '2',
		title: 'Track 6',
		src: '/music3.mp3',
		image: '/music_cover3.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
];

const tracks1: TrackInterface[] = [
	{
		id: '0',
		title: 'Track 1',
		src: '/music1.mp4',
		image: '/music_cover1.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
	{
		id: '1',
		title: 'Track 2',
		src: 'https://open.spotify.com/track/6hKkzk8UlVUj9ioPCyeH1O',
		image: '/music_cover2.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
	{
		id: '2',
		title: 'Track 3',
		src: '/music3.mp3',
		image: '/music_cover3.png',
		liked: undefined,
		listened: false,
		listening: false,
		type: 'audio',
	},
];

export default function Home() {
	const [playlist, setPlaylist] = useState<TrackInterface[][]>([tracks1, tracks2]);
	const [currentPlaylist, setCurrentPlaylist] = useState<TrackInterface[]>(tracks1);
	const [currentTrack, setCurrentTrack] = useState<TrackInterface>(currentPlaylist[0]);
	const [trackIndex, setTrackIndex] = useState<number>(0);

	return (
		<div className='h-screen w-screen p-2 gap-2 flex flex-col'>
			<div className='grid grid-cols-5'>
				<div className='col-span-1'></div>
				<div className='flex col-span-3 justify-center items-center'>
					<div className='w-1/2'>
						<Research setCurrentPlaylist={setCurrentPlaylist} />
					</div>
				</div>
				<div className='col-span-1'></div>
			</div>
			<div className='h-full w-full gap-2 grid grid-cols-5'>
				<div className='col-span-1'>
					<Playlist
						playlist={playlist}
						currentPlaylist={currentPlaylist}
						setCurrentPlaylist={setCurrentPlaylist}
					/>
				</div>
				<div className='col-span-3'>
					<MusicList
						playlistIndex={-1}
						setCurrentPlaylist={setCurrentPlaylist}
						playlist={currentPlaylist}
						setCurrentTrack={setCurrentTrack}
					/>
				</div>
				<div className='col-span-1'>
					<MusicPlayer
						trackIndex={trackIndex}
						playlist={currentPlaylist}
						setTrackIndex={setTrackIndex}
						track={currentTrack}
						setTrack={setCurrentTrack}
					/>
				</div>
			</div>
		</div>
	);
}
