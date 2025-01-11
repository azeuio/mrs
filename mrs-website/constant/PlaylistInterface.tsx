import { TrackInterface } from "./TrackInterface";

export default interface PlaylistInterface {
  name: string;
  tracks?: TrackInterface[];
}