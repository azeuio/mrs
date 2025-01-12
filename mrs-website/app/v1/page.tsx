/** @format */

'use client';
import MusicList from '@/components/MusicList';
import { TrackInterface } from '../../constant/TrackInterface';
import MusicPlayer from '@/components/MusicPlayer';
import { createContext, useEffect, useState } from 'react';
import Playlist from '@/components/Playlist';
import Research from '@/components/Research';
import PlaylistInterface from '@/constant/PlaylistInterface';
import axios from 'axios';

export default function Home() {
	const [playlist, setPlaylist] = useState<PlaylistInterface[]>([]);
	const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistInterface>();
	const [trackIndex, setTrackIndex] = useState<number>(0);
	const [currentTrack, setCurrentTrack] = useState<TrackInterface | undefined>(
		currentPlaylist?.tracks ? currentPlaylist.tracks[0] : undefined,
	);

	useEffect(() => {
		const fetchPlaylist = async () => {
			try {
				const response = await axios.get('http://127.0.0.1:5000/least_played', {
					headers: {
						'Content-Type': 'application/json',
						'Referrer-Policy': 'no-referrer',
					},
				});
				const data = response.data.least_played_songs;
				console.log(data);
				const formattedPlaylist = {
					name: 'Least Played Songs',
					tracks: [
						{
							id: '1',
							title: 'Title',
							artist: 'artist',
							album: 'album',
							release_date: 'release_date',
							src: '',
							image: '/disc.webp',
							liked: undefined,
							listened: false,
							listening: false,
						},
					],
				};

				// const formattedPlaylist = {
				// 	name: 'Least Played Songs',
				// 	tracks: data.map((song: any) => ({
				// 		id: song.title,
				// 		title: song.title,
				// 		artist: song.artist,
				// 		album: song.album,
				// 		release_date: song.release_date,
				// 		image: '/disc.webp',
				// 		listened: false,
				// 		listening: false,
				// 		liked: undefined,
				// 	})),
				// };

				setPlaylist([formattedPlaylist]);
				setCurrentPlaylist(formattedPlaylist);
			} catch (error) {
				console.error('Erreur lors de la récupération des playlists :', error);
			}
		};

		fetchPlaylist();
	}, []);

	return (
		<div className='h-full w-screen p-2 gap-2 flex flex-col'>
			<div className='grid grid-cols-5'>
				<div className='col-span-1'></div>
				<div className='flex col-span-3 justify-center items-center'>
					<div className='w-1/2'>
						<Research setCurrentPlaylist={setCurrentPlaylist} />
					</div>
				</div>
				<div className='col-span-1'></div>
			</div>
			<div className='grow max-h-full w-full gap-2 grid grid-cols-5'>
				<div className='col-span-1'>
					<Playlist
						playlist={playlist}
						currentPlaylist={currentPlaylist}
						setCurrentPlaylist={setCurrentPlaylist}
					/>
				</div>
				<div className='col-span-3 max-h-full overflow-scroll'>
					<MusicList
						setCurrentPlaylist={setCurrentPlaylist}
						playlist={currentPlaylist}
						setCurrentTrack={setCurrentTrack}
						currentTrack={currentTrack}
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
