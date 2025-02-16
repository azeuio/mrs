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
import querystring from 'querystring';

const generateRandomString = (length: number) => {
	var text = '';
	var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (var i = 0; i < length; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

export default function Home() {
	const [playlist, setPlaylist] = useState<PlaylistInterface[]>([]);
	const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistInterface>();
	const [trackIndex, setTrackIndex] = useState<number>(0);
	const [currentTrack, setCurrentTrack] = useState<TrackInterface | undefined>(
		currentPlaylist?.tracks ? currentPlaylist.tracks[0] : undefined,
	);

	useEffect(() => {
		const client_id = 'e57b4566c37e4349bc9c9727912330eb'
  		const client_secret = 'e6594b856da641bc90cbc0d7b41d05b0';
		var state = generateRandomString(16);
		var scope = 'user-read-private user-read-email';

		// open in a new window 'https://accounts.spotify.com/authorize?'
		const popup = window.open('https://accounts.spotify.com/authorize?' +
			querystring.stringify({
				response_type: 'code',
				client_id: client_id,
				scope: scope,
				redirect_uri: 'http://localhost:3000/redirect/spotify',
				state: state
			}), '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

		popup?.addEventListener('load', () => {
			const url = new URL(popup?.location.href);
			const code = url.searchParams.get('code');
			const state = url.searchParams.get('state');
			if (code && state) {
				const params = new URLSearchParams();
				params.append('code', code);
				params.append('redirect_uri', 'http://localhost:3000/redirect/spotify');
				params.append('grant_type', 'authorization_code');
				fetch('https://accounts.spotify.com/api/token', {
				method: 'POST',
				body: params,
				headers: {
					'content-type': 'application/x-www-form-urlencoded',
					'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
				}
				})
				.then((response) => response.json())
				.then((data) => {
					document.cookie = `spotify_access_token=${data.access_token}`;
					document.cookie = `spotify_refresh_token=${data.refresh_token}`;
					document.cookie = `spotify_token_type=${data.token_type}`;
					document.cookie = `spotify_expires_in=${data.expires_in}`;
				}).finally(() => {
					popup?.close();
				});
			}
		});
	}, []);

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

				const artistSongsMap = artistResponses
					.map((response, index) => ({
						artist: least_played_songs[index].artist,
						songs: response.data,
					}))
					.reverse();

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
