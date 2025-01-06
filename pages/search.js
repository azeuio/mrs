import { useState } from 'react';

export default function Search() {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Recherche pour :', query);
  };

  return (
    <div className="container">
      <h1>Recherche</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher une musique..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Rechercher</button>
      </form>
    </div>
  );
}