/** @format */

import { TrackInterface } from '@/constant/TrackInterface';
import Image from 'next/image';
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
	addToPlaylist,
}: {
	setPlaylistResearched: (tracks: TrackInterface[]) => void;
	addToPlaylist: (track: TrackInterface) => void;
}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [results, setResults] = useState<TrackInterface[]>([]);
	const [loading, setLoading] = useState(false);

	const handleSearch = async () => {
		if (!searchQuery.trim()) return;
		setLoading(true);

		try {
			const accessToken = await getSpotifyAccessToken();

			const response = await fetch(
				`https://api.spotify.com/v1/search?q=${searchQuery}&type=track`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);
			const data = await response.json();
			console.log(data);
			const tracks: TrackInterface[] = data.tracks.items
				// .filter((track: any) => track.preview_url)
				.map((track: any) => ({
					id: track.id,
					title: track.name,
					src: track.preview_url,
					external_urls: track.external_urls.spotify,
					image: track.album.images[0]?.url || '',
					liked: undefined,
					listened: false,
					listening: false,
				}));
            console.log(tracks);
            setPlaylistResearched(tracks);
			setResults(tracks);
		} catch (error) {
			console.error('Error fetching tracks:', error);
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
			{/* <ul className="results-list space-y-2">
                {results.map((track) => (
                    <li key={track.id} className="flex items-center space-x-4">
                        <Image src={track.image} alt={track.title} width={50} height={50} className="rounded" />
                        <div className="flex-grow">
                            <p className="font-bold">{track.title}</p>
                            <audio controls src={track.src} />
                        </div>
                        <button
                            className="bg-green-500 text-white rounded p-1"
                            onClick={() => addToPlaylist(track)}
                        >
                            Add
                        </button>
                    </li>
                ))}
            </ul> */}
		</div>
	);
}

export default Research;
