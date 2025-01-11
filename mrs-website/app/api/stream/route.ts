/** @format */

import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const title = searchParams.get('title');

		if (!title) {
			console.error('Title is required');
			return NextResponse.json({ error: 'Title is required' }, { status: 400 });
		}
		console.log('Title:', title);

		const params = {
			part: 'snippet',
			q: title,
			type: 'video',
			key: process.env.YOUTUBE_API_KEY,
		};

		console.log('Request URL:', BASE_URL);
		console.log('Request Params:', params);

		const searchResponse = await axios.get(BASE_URL, { params });

		const searchResults = searchResponse.data.items;
		if (!searchResults || searchResults.length === 0) {
			return NextResponse.json({ error: 'No video found' }, { status: 404 });
		}

		const videoId = searchResults[0].id.videoId;
		const videoUrl = `https://www.youtube.com/embed/${videoId}`; // Embed URL
		console.log('Embed Video URL:', videoUrl);

		return NextResponse.json({ videoUrl });
	} catch (error) {
		console.error('Error handling the request:', error);
		return NextResponse.json({ error: `Server error: ${error}` }, { status: 500 });
	}
}
