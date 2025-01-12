import { TrackInterface } from "./TrackInterface";

export default interface PlaylistInterface {
  name: string;
  researched: boolean;
  tracks?: TrackInterface[];
}