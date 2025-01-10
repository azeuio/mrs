import { useEffect, useState } from 'react';
import Artist from '../components/artist';
import Release from '../components/release';
import MainLayout from '../layouts/MainLayout';

export default function Search() {
  const [artists, setArtists] = useState([]);
  const [releases, setReleases] = useState({});
  const [releaseOnly, setReleaseOnly] = useState([]);

  const searchArtists = (query) => {
    fetch(`http://localhost:5000/api/search?q=${query}&type=artist&limit=3`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.artists.filter((artist) => artist.score > 90));
      }).catch((err) => {
        console.error(err);
      });
  };

  const searchReleases = (release) => {
    fetch(`http://localhost:5000/api/search?q=${release}&type=release&limit=3&inc=artists`)
      .then((res) => res.json())
      .then((data) => {
        console.log('releases', data.releases);
        // setReleases(data.releases);
        setReleaseOnly(data.releases);
        setReleases([])
        setArtists([])
      }).catch((err) => {
        console.error(err);
      });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const artist = form.get('artist');
    const music = form.get('music');

    if (artist) {
      searchArtists(artist);
    } else if (music) {
      searchReleases(music);
    }
  };

  useEffect(() => {
    setReleases([]);
    let releases = [];
    Promise.all(artists.map((artist) => {
      return fetch(`http://localhost:5000/api/browse_releases?artist=${artist.id}&limit=100`)
        .then((res) => res.json())
        .then((data) => {
          console.log(artist.name, data.releases);
          releases.push(data.releases);
          setReleases(releases);
        }).catch((err) => {
          console.error(err);
        });
    }));
    // for (const artist_idx in artists) {
    //   const artist = artists[artist_idx];
    //   fetch(`http://localhost:5000/api/browse_releases?artist=${artist.id}&limit=100`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //       console.log(artist.name, data.releases);
    //       releases.push(data.releases);
    //       setReleases(releases);
    //     }).catch((err) => {
    //       console.error(err);
    //     });
    // }
  }, [artists]);


  return (
    <MainLayout>
    <div className="container">
      <form onSubmit={handleSearch} method='POST' className='flex gap-4'>
      <input
          className='p-2 rounded-md bg-stone-800'
          name="artist"
          type="text"
          placeholder="Rechercher un artiste..."
        />
        <input
          className='p-2 rounded-md bg-stone-800'
          name="music"
          type="text"
          placeholder="Rechercher une musique..."
        />
        <button type="submit" className='p-2 rounded-md bg-stone-400 hover:bg-stone-300 transition text-stone-700 hover:text-stone-900 font-bold'>
        Rechercher</button>
      </form>
      <div className='flex flex-col gap-4 justify-center w-[100vw] px-8'>
      <ul className='grid grid-cols-3 gap-4 w-full p-4'>
        {artists?.map((artist) => (
          <div className='aspect-square h-[40vh]' key={artist.id}>
            <Artist artist={artist} />
          </div>
        ))}
      </ul>
      <ul className='flex flex-col p-2 rounded-md bg-stone-800 divide-y-2 divide-solid divide-stone-900'>
    
        {Object.keys(releases).length === 0 && releaseOnly.length == 0 && <li className='text-center'>Aucun résultat</li>}
        {releases &&
          Object.entries(releases)?.map(([artistIdx, releases]) => releases.map((release) => (
    
            <Release key={release.id} release={release} artist={artists[artistIdx]} />
          )))
        }
        {releaseOnly?.length &&
          releaseOnly.map((release) => (
            <Release key={release.id} release={release} />
          ))
        }
        
      </ul>
      </div>
    </div>
    </MainLayout>
  );
}