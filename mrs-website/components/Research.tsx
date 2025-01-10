/** @format */

import { TrackInterface } from '@/constant/TrackInterface';
import Image from 'next/image';
import { useState } from 'react';

const YOUTUBE_API_KEY = 'AIzaSyCng6QuzliJp145iQk-dWmPEUf6KyCCGXg';

async function getYouTubeVideoPreview(query: string) {
	const response = await fetch(
		`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
			query,
		)}&type=video&videoCategoryId=10&key=${YOUTUBE_API_KEY}`,
	);
	const data = await response.json();

	if (data.items && data.items.length > 0) {
		return `https://www.youtube.com/watch?v=${data.items[0].id.videoId}`;
	}
	return null;
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
			const response = await fetch(
				`https://musicbrainz.org/ws/2/recording?query=${encodeURIComponent(searchQuery)}&fmt=json`,
			);

			if (!response.ok) {
				throw new Error('Failed to fetch from MusicBrainz API');
			}

			const data = await response.json();
			const tracks: TrackInterface[] = [];

			for (const recording of data.recordings) {
				const youtubeUrl = await getYouTubeVideoPreview(recording.title);

				tracks.push({
					id: recording.id,
					title: recording.title,
					src: youtubeUrl,
					external_urls: `https://musicbrainz.org/recording/${recording.id}`,
					image: '/placeholder-image.jpg',
					liked: undefined,
					listened: false,
					listening: false,
				});
			}

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
			{/* <ul className='results-list space-y-2'>
				{results.map((track) => (
					<li key={track.id} className='flex items-center space-x-4'>
						<Image src={track.image} alt={track.title} width={50} height={50} className='rounded' />
						<div className='flex-grow'>
							<p className='font-bold'>{track.title}</p>
							<a
								href={track.external_urls}
								target='_blank'
								rel='noopener noreferrer'
								className='text-blue-500'>
								View on MusicBrainz
							</a>
							{track.src ? (
								<iframe
									width='200'
									height='113'
									src={track.src.replace('watch?v=', 'embed/')}
									title={track.title}
									frameBorder='0'
									allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
									allowFullScreen></iframe>
							) : (
								<p>No preview available</p>
							)}
						</div>
						<button
							className='bg-green-500 text-white rounded p-1'
							onClick={() => addToPlaylist(track)}>
							Add
						</button>
					</li>
				))}
			</ul> */}
		</div>
	);
}

export default Research;
