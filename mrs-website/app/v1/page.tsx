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
				const response = await axios.get('http://127.0.0.1:5000/least_played', {
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const data = response.data.least_played_songs;
				console.log(data);
				// const tmpTracks: TrackInterface[] = [
				// 	{
				// 		id: '6hKkzk8UlVUj9ioPCyeH1O',
				// 		title: 'Sous la lune',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Rien 100 Rien',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b2733c505b5ddcbdf80c7dff5a1f',
				// 		duration: 171000,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '0Qx1ecCyHjCwGdKy85DZ8y',
				// 		title: "Un jour, je l'aurai",
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: "Un jour, je l'aurai",
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273edf3b8872ea84a42248c76b6',
				// 		duration: 226760,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '6J2LdBN97cDWn0MLxYh9HB',
				// 		title: 'July',
				// 		src: '',
				// 		artist: 'Noah Cyrus',
				// 		album: 'THE END OF EVERYTHING',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b2737f66b73bd6e86f4c8d2a7692',
				// 		duration: 156106,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '3cJYHDT0jfBt8PLNOsKHZE',
				// 		title: 'Capata',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Inarrêtable',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27384fcb225fcd2a8fb7d7b26c5',
				// 		duration: 200920,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '0SKNkEMV313mE6oYsgVCgm',
				// 		title: "J'oublie tout",
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Dans ma paranoïa',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27385d9fb2e7833cb239769c02d',
				// 		duration: 316777,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '72EqEemOS6xMrn3zmzL12Y',
				// 		title: 'Julien',
				// 		src: '',
				// 		artist: 'Damso',
				// 		album: 'Lithopédion',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27327b75c8f94720797618b890a',
				// 		duration: 202386,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '5I2FIj9EDp0Fz32CJ9lZNF',
				// 		title: 'Tu la love',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Dans ma paranoïa',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27385d9fb2e7833cb239769c02d',
				// 		duration: 212373,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '0goer5e8B6SJaTV2B51k6f',
				// 		title: 'La bandite',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Rien 100 Rien',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b2733c505b5ddcbdf80c7dff5a1f',
				// 		duration: 160893,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '03qc5kF29KsqdEn6LfYSBR',
				// 		title: 'BIRTHDAY (feat. Jul)',
				// 		src: '',
				// 		artist: 'Gazo',
				// 		album: 'APOCALYPSE',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273dfc950ea8ef5cf436cf1c6d4',
				// 		duration: 213133,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '49qQQcd8wONsOy3PwnZKHB',
				// 		title: 'Ma jolie',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Je ne me vois pas briller',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273554900f75e6e959bdfa49f74',
				// 		duration: 233853,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '6uqUEyqPScFznadOkI7Nvm',
				// 		title: "Un jour, je l'aurai",
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Inarrêtable',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27384fcb225fcd2a8fb7d7b26c5',
				// 		duration: 226760,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '10iesoGb4mCYTcur1QfdO9',
				// 		title: 'JCVD',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Rien 100 Rien',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b2733c505b5ddcbdf80c7dff5a1f',
				// 		duration: 194266,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '2cqtTAnI9E7buORFB9q4ts',
				// 		title: 'Faut pas',
				// 		src: '',
				// 		artist: 'PLK',
				// 		album: 'Chambre 140 (Part.3)',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273478b7d68b5755066144886e5',
				// 		duration: 138933,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '6wo88ISzGpdCSPl0yTibhJ',
				// 		title: 'Amnésia',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'My World (Edition collector)',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b2739619db1287681309e4afdeb0',
				// 		duration: 132030,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '1fMOAIge1jLxq4ONi9bIFL',
				// 		title: 'Parfum quartier',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Parfum quartier',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27343c8b89de39bc66cf21c4674',
				// 		duration: 226210,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '3VLn1Xwy0CaNVYv7O7MNsA',
				// 		title: 'Sort le cross volé',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Dans ma paranoïa',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27385d9fb2e7833cb239769c02d',
				// 		duration: 258823,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '0TGUKOXoQp6aEIkL3xEjLR',
				// 		title: 'Je veux que toi',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Inarrêtable',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27384fcb225fcd2a8fb7d7b26c5',
				// 		duration: 185533,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '7sZas5ww0qoNF9B5B8ebir',
				// 		title: 'Dans ma paranoïa',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: 'Dans ma paranoïa',
				// 		image: 'https://i.scdn.co/image/ab67616d0000b27385d9fb2e7833cb239769c02d',
				// 		duration: 160654,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '4DMSNaJcSirQN31BSf2BeZ',
				// 		title: 'Toto et Ninetta',
				// 		src: '',
				// 		artist: 'Jul',
				// 		album: "Inspi d'ailleurs",
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273f3e8990652f0a336ae55f26a',
				// 		duration: 211666,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// 	{
				// 		id: '2OrVl8djetZs39Mr3Ujkaf',
				// 		title: 'Vanillée',
				// 		src: '',
				// 		artist: 'Houari',
				// 		album: "C'est de la Cali",
				// 		image: 'https://i.scdn.co/image/ab67616d0000b273c5cdaab8d922994038185969',
				// 		duration: 167013,
				// 		listened: false,
				// 		listening: false,
				// 	},
				// ];

				// const formattedPlaylist = [
				// 	{
				// 		name: 'Least Played Songs',
				// 		researched: false,
				// 		tracks: tmpTracks,
				// 	},
				// 	{
				// 		name: 'Daily Mix 1',
				// 		researched: false,
				// 		tracks: tmpTracks,
				// 	},
				// 	{
				// 		name: 'Daily Mix 2',
				// 		researched: false,
				// 		tracks: tmpTracks,
				// 	},
				// 	{
				// 		name: 'Daily Mix 3',
				// 		researched: false,
				// 		tracks: tmpTracks,
				// 	},
				// 	{
				// 		name: 'Discovery of the week',
				// 		researched: false,
				// 		tracks: tmpTracks,
				// 	}
				// ];

				const formattedPlaylist : PlaylistInterface = {
					name: 'Least Played Songs',
					researched: false,
					tracks: data.map((song: any) => ({
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
				};

				setPlaylist([formattedPlaylist]);
				setCurrentPlaylist(formattedPlaylist);
			} catch (error) {
				console.error('Erreur lors de la récupération des playlists :', error);
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
