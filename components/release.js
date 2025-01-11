import { useEffect, useState } from "react";
import Heart from '../assets/heart.svg';
import HeartFilled from '../assets/heart-filled.svg';
import HeartBroken from '../assets/heart-broken.svg';
import HeartBrokenFilled from '../assets/heart-broken-filled.svg';
import Play from '../assets/play.svg';
import Pause from '../assets/pause.svg';
import Image from "next/image";

export default function Release({ release, artist }) {
  const [cover, setCover] = useState('');
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch(`http://coverartarchive.org/release/${release.id}`)
      .then((res) => res.json())
      .then((data) => {
        setCover(data.images[0].image);
      }).catch((err) => {
        console.error(err);
      });
    if (!artist) {
      console.log(release)
    }
  }, [release.id]);

 
  const like = () => {
    console.log('Like', release.title);
    setLiked(!liked);
    if (!liked) {
      setDisliked(false);
    }
  }
  const dislike = () => {
    console.log('Dislike', release.title);
    setDisliked(!disliked);
    if (!disliked) {
      setLiked(false);
    }
  }

  const togglePlay = () => {
    setPlaying(!playing);
  }

  const updateProgress = (e) => {
    setProgress(e.target.value);
  }

  return (
    <li key={release.id} className='grid grid-cols-12 w-full h-fit'>
      <img src={cover} className='object-cover aspect-square w-full justify-start' alt={"cover_" + release.title} />
      <div className="relative col-span-11 grid grid-cols-11 h-full w-full">
        <div className='contents p-4 gap-4 justify-evenly *:px-4 *:flex *:items-center h-[100px] w-full text-white'>
          <h2 className="col-span-4">{release.title}</h2>
          <p className="col-span-2">{artist?.name}</p>
          <p className='col-span-3'>{release.disambiguation}</p>
          <p>{release.date}</p>
          <div className="flex gap-4 justify-end items-center *:size-8 text-white">
            <button onClick={togglePlay}>
              <Image src={playing ? Pause : Play} alt="play" />
            </button>
            <button onClick={like}>
              <Image src={liked ? HeartFilled : Heart} alt="like" />
            </button>
            <button onClick={dislike}>
              <Image src={disliked ? HeartBrokenFilled : HeartBroken} alt="dislike" />
            </button>
          </div>
        </div>
        <input onChange={updateProgress} type="range" value={progress} className="absolute bottom-0 left-[6%] w-11/12 accent-stone-50" />
      </div>
    </li>
  );
}
