export interface TrackInterface {
  id: string;
	title: string;
	src: string;
	image: string;
	liked: boolean | undefined;
	listened: boolean;
	external_urls?: any;
	listening: boolean;
}