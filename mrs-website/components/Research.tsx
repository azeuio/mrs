/** @format */

import { TrackInterface } from '@/constant/TrackInterface';
import { useState } from 'react';

async function getSpotifyAccessToken() {
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
	setPlaylistResearched,
}: {
	setPlaylistResearched: (tracks: TrackInterface[]) => void;
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

			const response = await fetch(
				`https://api.spotify.com/v1/search?q=${searchQuery}&type=track&market=FR`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error('Failed to fetch tracks from Spotify');
			}

			const data = await response.json();
			const tracks: TrackInterface[] = data.tracks.items.map((track: any) => ({
				id: track.id,
				title: track.name,
				src: track.preview_url,
				external_urls: track.external_urls.spotify,
				image: track.album.images[0]?.url || '',
				liked: undefined,
				listened: false,
				listening: false,
			}));
			setPlaylistResearched(tracks);
		} catch (error: any) {
			console.error('Error fetching tracks:', error);
			setSearchError(error.message || 'Error fetching tracks');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='research-component'>
			<div className='flex items-center space-x-2 mb-4'>
				<input
					type='text'
					className='border rounded p-2 flex-grow'
					placeholder='Search for an artist or track...'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
				<button
					className='bg-blue-500 text-white rounded p-2'
					onClick={handleSearch}
					disabled={loading}>
					{loading ? 'Searching...' : 'Search'}
				</button>
			</div>
			{searchError && <div className='text-red-500 mt-4'>{searchError}</div>}
		</div>
	);
}

export default Research;
