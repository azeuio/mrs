/** @format */

'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackInterface } from '../constant/TrackInterface';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import PlaylistInterface from '@/constant/PlaylistInterface';
import Script from 'next/script';
import { redirect } from 'next/navigation';
import { SpotifyContext } from '@/app/contexts/spotify';

export default function MusicPlayer({
	track,
	playlist,
	trackIndex,
	setTrackIndex,
	setTrack,
}: {
	track: TrackInterface | undefined;
	playlist: PlaylistInterface | undefined;
	trackIndex: number | undefined;
	setTrackIndex: (index: number) => void;
	setTrack: (updatedTrack: TrackInterface) => void;
}) {
	const [videoUrl, setVideoUrl] = useState<string | null>(null);
	const [videoStarted, setVideoStarted] = useState<boolean>(false);
	const [spotifyStarted, setSpotifyStarted] = useState<boolean>(false);
	// const [spotifyCurrentTrack, setSpotifyCurrentTrack] = useState<string | null>(null);
	const [spotifyCurrentTrack, setSpotifyCurrentTrack] = useState<TrackInterface | null>(null);
	const [currentProgress, setCurrentProgress] = useState<{ current: number; total: number } | null>(null);
	const [time, setTime] = useState(Date.now());

	const context = useContext(SpotifyContext);
	const redirect_uri = 'http://localhost:3000/redirect/spotify';
	const CLIENT_ID = 'e57b4566c37e4349bc9c9727912330eb';
	const CLIENT_SECRET = 'e6594b856da641bc90cbc0d7b41d05b0';

	useEffect(() => {
		const interval = setInterval(() => setTime(Date.now()), 2500);
		const spotifyTokenExpiration = context.expiresIn;
		let spotifyTokenExpirationTimeout: NodeJS.Timeout;

		if (spotifyTokenExpiration && context.refreshToken) {
			spotifyTokenExpirationTimeout = setTimeout(() => {
				refreshAccessToken(context.refreshToken || '');
			}, spotifyTokenExpiration * 1000);
		}

		return () => {
			clearInterval(interval);
			clearTimeout(spotifyTokenExpirationTimeout);
		}
	}, [context.expiresIn, context.refreshToken]);

	useEffect(() => {
		axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
			headers: {
				Authorization: 'Bearer ' + context.accessToken
			}
		}).then(response => {
			// console.log('Current track:', response);
			if (!response.data) {
				setSpotifyCurrentTrack(null);
				setCurrentProgress(null);
				return;
			}
			setSpotifyCurrentTrack({
				id: response.data.item.id,
				title: response.data.item.name,
				artist: response.data.item.artists[0].name,
				album: response.data.item.album.name,
				release_date: response.data.item.album.release_date,
				image: response.data.item.album.images[0].url,
				src: response.data.item.preview_url,
				listened: false,
				listening: response.data.is_playing,
				liked: undefined,
			} as TrackInterface);
			setCurrentProgress({ current: response.data.progress_ms, total: response.data.item.duration_ms });
			if (response?.data?.item && !track)
			{
				setTrack({
					id: response.data.item.id,
					title: response.data.item.name,
					artist: response.data.item.artists[0].name,
					album: response.data.item.album.name,
					release_date: response.data.item.album.release_date,
					src: response.data.item.preview_url,
					image: response.data.item.album.images[0].url,
					liked: undefined,
					listened: false,
					listening: response.data.is_playing,
				});
			}
		}).catch(error => {
			if (error?.response?.status == 401) {
				refreshAccessToken(context.refreshToken || '');
			}
			console.error('Error getting current track:', error);
		})
	}, [time]);
	
	const handleLike = () => {
		if (track) setTrack({ ...track, liked: true })
	};
	const handleDislike = () => {
		if (track) setTrack({ ...track, liked: false, listening: false })
	};

	const generateRandomString = (length: number) => {
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

		for (var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	const getAccessToken = () => {
		Cookies.remove('spotify_access_token');
		Cookies.remove('spotify_refresh_token');
		var state = generateRandomString(16);
		var scope = 'user-read-private user-read-email user-read-playback-state user-modify-playback-state';

		if (context.code) {
			return;
		}

		// open new window
		var authWindow = window.open('https://accounts.spotify.com/authorize?' +
			new URLSearchParams({
				response_type: 'code',
				client_id: CLIENT_ID,
				scope: scope,
				redirect_uri: redirect_uri,
				state: state
			}), 'Spotify', 'width=800,height=600');
		
		// listen for authWindow close
		window.addEventListener('message', function(event) {
			if (event.origin !== 'http://localhost:3000') {
				return;
			}
			console.log('Event:', event);
			context.code = event.data.code;
			context.state = event.data.state;
			authWindow?.close();

				
			var authOptions = {
				url: 'https://accounts.spotify.com/api/token',
				form: {
				code: context.code,
				redirect_uri: redirect_uri,
				grant_type: 'authorization_code'
				},
				headers: {
				'content-type': 'application/x-www-form-urlencoded',
				'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
				},
				json: true
			};
			console.log('Auth options:', authOptions);
			axios.post(authOptions.url, authOptions.form, {
			  headers: authOptions.headers
			}).then(function(response) {
			  console.log('Access token:', response);
			  context.accessToken = response.data.access_token;
			  context.refreshToken = response.data.refresh_token;
			  context.expiresIn = response.data.expires_in;
			  context.scope = response.data.scope;
			  Cookies.set('spotify_access_token', response.data.access_token, {sameSite: 'None', secure: true});
			  Cookies.set('spotify_refresh_token', response.data.refresh_token, {sameSite: 'None', secure: true});
			}).catch(function(error) {
			  console.error('Error getting access token:', error);
			})
		}, false);
	};

	const refreshAccessToken = (refresh_token: string) => {
		axios.post('https://accounts.spotify.com/api/token', {
			grant_type: 'refresh_token',
			refresh_token: refresh_token,
			client_id: CLIENT_ID,
			client_secret: CLIENT_SECRET
		}).then(response => {
			console.log('Refresh token response:', response);
			context.accessToken = response.data.access_token;
			context.expiresIn = response.data.expires_in;
			Cookies.set('spotify_access_token', response.data.access_token, {sameSite: 'None', secure: true});
		}).catch(error => {
			console.error('Error refreshing access token, getting new one:', error);
			getAccessToken();
		})
	}

	const playSpotifyTrack = () => {
		if (!track || !context.accessToken) return;
		axios.put('https://api.spotify.com/v1/me/player/play', {
			uris: ['spotify:track:' + track.id]
		}, {
			headers: {
				Authorization: 'Bearer ' + context.accessToken
			}
		}).then(response => {
			console.log('Play response:', response);
			setSpotifyStarted(true);
			setSpotifyCurrentTrack(track);
		}
		).catch(error => {
			console.error('Error playing track:', error);
		})
	}

	const pauseSpotifyTrack = () => {
		if (!context.accessToken) return;
		axios.put('https://api.spotify.com/v1/me/player/pause', {}, {
			headers: {
				Authorization: 'Bearer ' + context.accessToken
			}
		}).then(response => {
			console.log('Pause response:', response);
			setSpotifyStarted(false);
		}).catch(error => {
			console.error('Error pausing track:', error);
		})
	}

	const setTrackProgress = (progress: number) => {
		if (!context.accessToken) return;
		axios.put('https://api.spotify.com/v1/me/player/seek?' + new URLSearchParams({
			position_ms: progress.toFixed(0)
		}), {}, {
			headers: {
				Authorization: 'Bearer ' + context.accessToken
			}
		}).then(response => {
			console.log('Set progress response:', response);
		}).catch(error => {
			console.error('Error setting progress:', error);
		})
	}

	const milliToString = (millis: number) => {
		var minutes = Math.floor(millis / 60000);
		var seconds = ((millis % 60000) / 1000).toFixed(0);
		return minutes + ':' + (parseInt(seconds) < 10 ? '0' : '') + seconds;
	}

	useEffect(() => {
		if (context.accessToken) return;
		if (Cookies.get('spotify_access_token')) {
			context.accessToken = Cookies.get('spotify_access_token') || null;
			context.refreshToken = Cookies.get('spotify_refresh_token') || null;
		}
		if (Cookies.get('spotify_refresh_token')) {
			refreshAccessToken(Cookies.get('spotify_refresh_token') || context.refreshToken || '');
		}
	}, []);

	useEffect(() => {
		console.log('Listening:', track?.listening, {'listening': track?.listening, 'accessToken': context.accessToken, 'spotifyCurrentTrack': spotifyCurrentTrack, 'track?.id === spotifyCurrentTrack?.id,': track?.id === spotifyCurrentTrack?.id, '!spotifyCurrentTrack': !spotifyCurrentTrack}, spotifyCurrentTrack);
		if (track?.listening && context.accessToken && ((spotifyCurrentTrack && track?.id === spotifyCurrentTrack?.id) || !spotifyCurrentTrack || !spotifyCurrentTrack.listening)) {
			playSpotifyTrack();
		} else if (!track?.listening && context.accessToken && spotifyStarted && track?.id === spotifyCurrentTrack?.id) {
			pauseSpotifyTrack();
		}
	}, [track?.listening]);

	const feedbackMessage =
		track?.liked === true
			? 'You liked this!'
			: track?.liked === false
			? 'You disliked this.'
			: 'No feedback yet.';

	if (!track) {
		return (
			<div className='w-full h-full flex flex-col justify-center'>
				<Card className='w-full h-full flex flex-col justify-center items-center shadow-lg'>
					<CardContent>Select a track to play</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='w-full h-full flex flex-col justify-center'>
			<Card className='w-full h-full flex flex-col  shadow-lg'>
				<CardHeader>
					<CardTitle>
						<h3 className='scroll-m-20 text-2xl font-semibold tracking-tight'>{track.title}</h3>
						<Image
							src={track.image || '/fallback-image.jpg'}
							alt='Music Cover'
							width={400}
							height={400}
							className='rounded-lg'
						/>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className='mt-4 bg-black rounded-sm p-2 gap-2 flex flex-col justify-center'>
						{track.id && context.accessToken && (context.expiresIn ?? 0) > 0 && (
							
								<Button
									onClick={() => {
										track.listening
											? pauseSpotifyTrack()
											: playSpotifyTrack();
									}}
									className='bg-green-500 text-white'
								>
									{track.listening ? 'Pause ' : 'Play '}
									on Spotify
								</Button>
							
						)}
						{track.id && (!context.accessToken || (context.expiresIn ?? 0) === 0) && (
							<div className='w-full h-full flex flex-col justify-center'>
								<Card className='w-full h-full flex flex-col justify-center items-center shadow-lg'>
									<CardContent>
										<Button onClick={getAccessToken}>Connect to Spotify</Button>
									</CardContent>
								</Card>
							</div>
						)}
						{spotifyCurrentTrack && (
							<p className='w-full h-full text-center text-white underline overflow-x-hidden overflow-ellipsis text-nowrap'>
								{spotifyCurrentTrack.title}
							</p>
						)}
						{currentProgress && (
								<p className='h-full text-center text-white text-nowrap'>
									{milliToString(currentProgress.current)} / {milliToString(currentProgress.total)}
								</p>
							)}
							<input type='range' min='0' max='100'
								value={currentProgress ? currentProgress.current / currentProgress.total * 100 : 0}
								disabled={false} className='w-full'
								onChange={(e) => {
									if (!currentProgress) return;
									const valAsNumber = parseInt(e?.target?.value ?? currentProgress.current / currentProgress.total * 100);
									setTrackProgress(valAsNumber / 100 * currentProgress.total);
								}}
							/>
					</div>
				</CardContent>

				<CardFooter className='flex justify-between items-center player-footer'>
					<p className='mt-4 text-center'>{feedbackMessage}</p>

					<div className='flex justify-center space-x-4 mt-6'>
						<Button
							variant='default'
							onClick={handleLike}
							title='Like this track'
							className={`px-4 py-2 flex items-center ${
								track.liked === true ? 'hover:bg-green-500 bg-green-500' : 'bg-gray-400'
							}`}>
							<ThumbsUp />
						</Button>
						<Button
							variant='default'
							onClick={handleDislike}
							title='Dislike this track'
							className={`px-4 py-2 flex items-center ${
								track.liked === false ? 'hover:bg-red-500 bg-red-500' : 'bg-gray-400'
							}`}>
							<ThumbsDown />
						</Button>
					</div>
				</CardFooter>
			</Card>
		</div>
	);
}
