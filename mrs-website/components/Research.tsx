/** @format */
'use client';
import PlaylistInterface from '@/constant/PlaylistInterface';
import { SetStateAction, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

async function getSpotifyAccessToken() {
	if (document.cookie.includes('spotify_access_token')) {
		const cookie = document.cookie
			.split('; ')
			.find((row) => row.startsWith('spotify_access_token'));
		return cookie?.split('=')[1];
	}
	const clientId = '49e2816d35894848ac6f8358bf5bcf54';
	const clientSecret = '19b37297cc884f8784ff858ad68423ca';

	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
		},
		body: 'grant_type=client_credentials',
	});

	const data = await response.json();
	return data.access_token;
}

function Research({
	setCurrentPlaylist,
}: {
	setCurrentPlaylist: (tracks: SetStateAction<PlaylistInterface | undefined>) => void;
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [loading, setLoading] = useState(false);
	const [searchError, setSearchError] = useState<string | null>(null);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		setLoading(true);
		setSearchError(null);

		try {
			const accessToken = await getSpotifyAccessToken();

			const similarArtist: string[] = await fetch(
				`http://localhost:5000/api/artist/search_similar?artist=${searchQuery}&limit=5`,
				{
					method: 'GET',
				}
			)
				.then((res) => res.json())
			console.log('similarArtist', similarArtist);
			const responses = await Promise.all([
				fetch(
					`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&market=FR&limit=7`,
					{
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					},
				),
				...similarArtist.map((artist) =>
					fetch(
						`https://api.spotify.com/v1/search?q=${artist}&type=track&market=FR&limit=2`,
						{
							headers: {
								Authorization: `Bearer ${accessToken}`,
							},
						},
					)
				),
			]);

			if (!responses.reduce((acc, response) => acc && response.ok, true)) {
				throw new Error('Failed to fetch tracks from Spotify');
			}
			const data = await Promise.all(responses.map((response) => response.json()))
				.then((data) => data.reduce((acc, response) => acc.concat(response.tracks.items), []))
			console.log('response', data);
			const playlist: PlaylistInterface = {
				name: `Results for ${searchQuery}`,
				researched: true,
				tracks: data.map((track: any) => ({
					id: track.id,
					title: track.name,
					src: track.preview_url,
					artist: track.artists[0].name,
					album: track.album.name,
					external_urls: track.external_urls.spotify,
					image: track.album.images[0]?.url || '',
					duration: track.duration_ms,
					liked: undefined,
					listened: false,
					listening: false,
				})),
			};
			setCurrentPlaylist(playlist);
		} catch (error: any) {
			console.error('Error fetching tracks:', error);
			setSearchError(error.message || 'Error fetching tracks');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full'>
			<div className='flex items-center space-x-2'>
				<Input
					type='text'
					className='border rounded p-2 flex-grow'
					placeholder='Search for an artist or track...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<Button
					className='bg-blue-500 text-white rounded p-2'
					onClick={handleSearch}
					disabled={loading}>
					{loading ? 'Searching...' : 'Search'}
				</Button>
			</div>
			{searchError && <div className='text-red-500 mt-4'>{searchError}</div>}
		</div>
	);
}

export default Research;
