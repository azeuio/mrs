/** @format */

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import PlaylistInterface from '@/constant/PlaylistInterface';

type PlaylistProps = {
	playlist: PlaylistInterface[];
	currentPlaylist: PlaylistInterface | undefined;
	setCurrentPlaylist: React.Dispatch<React.SetStateAction<PlaylistInterface | undefined>>;
};

export default function Playlist({ playlist, currentPlaylist, setCurrentPlaylist }: PlaylistProps) {
	const selectPlaylist = (index: number) => {
		setCurrentPlaylist(playlist[index]);
	};
	const currentPlaylistIndex = playlist.findIndex((playlist) => playlist.name === currentPlaylist?.name);
	if (currentPlaylistIndex === -1 && playlist.length && currentPlaylist) {
		currentPlaylist.isTemporary = true;
		if (playlist.length > 1 && playlist[0].isTemporary) {
			playlist[0] = currentPlaylist;
		} else {
			playlist.splice(0, 0, currentPlaylist);
		}
	} else if (currentPlaylistIndex > 0 && playlist.length > 0 && playlist[0].isTemporary) {
		playlist.splice(0, 1);
	}

	return (
		<Card className='w-full h-full flex flex-col shadow-lg'>
			<CardHeader>
				<CardTitle className='text-center'>
					<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>Playlist</h3>
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-4 w-full'>
				{!playlist ? (
					<div>
						<p className='text-center'>Loading...</p>
					</div>
				) : (
					playlist?.map((tracks, index) => (
						<div
							key={index}
							className={`w-full p-4 rounded-md flex items-center justify-between ${
								currentPlaylist?.name === tracks.name ? 'bg-blue-200' : 'bg-gray-100'
							}`}>
							<h4 className='text-lg font-semibold'>{tracks.name}</h4>
							<Button
								variant={currentPlaylist?.name === tracks.name ? 'default' : 'outline'}
								onClick={() => selectPlaylist(index)}>
								{currentPlaylist?.name === tracks.name ? 'Selected' : 'Select'}
							</Button>
						</div>
					))
				)}
			</CardContent>
		</Card>
	);
}
