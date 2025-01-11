export interface TrackInterface {
  id: string;
  title: string;
  artist: string;
  album: string;
  release_date?: string;
  src: string;
  image: string;
  liked?: boolean | undefined;
  listened: boolean;
  listening: boolean;
}
