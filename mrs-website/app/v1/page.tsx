/** @format */

'use client';
import MusicList from '@/components/MusicList';
import { TrackInterface } from '../../constant/TrackInterface';
import MusicPlayer from '@/components/MusicPlayer';
import { useEffect, useState } from 'react';
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
				const response_least_played = await axios.get('http://127.0.0.1:5000/least_played', {
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const least_played_songs = response_least_played.data.least_played_songs;

				const artistResponses = await Promise.all(
					least_played_songs.map((song: any) =>
						axios.get(`http://127.0.0.1:5000/api/artist/similar?q=${song.artist}`, {
							headers: {
								'Content-Type': 'application/json',
							},
						}),
					),
				);

				const artistSongsMap = artistResponses.map((response, index) => ({
					artist: least_played_songs[index].artist,
					songs: response.data,
				})).reverse();

				const formattedPlaylist: PlaylistInterface[] = [
					{
						name: 'Least Played Songs',
						researched: false,
						tracks: least_played_songs?.map((song: any) => ({
							id: song.title,
							title: song.title,
							artist: song.artist,
							album: song.album,
							release_date: song.release_date,
							image: '/disc.webp',
							listened: false,
							listening: false,
							liked: undefined,
						})),
					},
					...artistSongsMap.map((artistData) => ({
						name: artistData.artist,
						researched: false,
						tracks: artistData.songs?.map((song: any) => ({
							id: song.title || '',
							title: song.title || '',
							artist: song.artist || '',
							album: song.album,
							release_date: song.release_date || '',
							image: '/disc.webp',
							listened: false,
							listening: false,
							liked: undefined,
						})),
					})),
				];

				setPlaylist(formattedPlaylist);
				setCurrentPlaylist(formattedPlaylist[0]);
			} catch (error) {
				console.error('Error fetching playlists:', error);
			}
		};

		fetchPlaylist();
	}, []);

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
				<div className='h-[95vh] col-span-1'>
					<Playlist
						playlist={playlist}
						currentPlaylist={currentPlaylist}
						setCurrentPlaylist={setCurrentPlaylist}
					/>
				</div>
				<div className='h-[95vh] col-span-3'>
					<MusicList
						setCurrentPlaylist={setCurrentPlaylist}
						playlist={currentPlaylist}
						setCurrentTrack={setCurrentTrack}
					/>
				</div>
				<div className='h-[95vh] col-span-1'>
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
