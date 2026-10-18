import type { FilterOptions, GraphStats } from "../../domain/musicGraph.types";
import { Mic2, Disc3, Radio } from "lucide-react";

interface TypeFiltersProps {
  filters: FilterOptions;
  stats: GraphStats;
  onFilterChange: (newFilters: FilterOptions) => void;
}

export const TypeFilters: React.FC<TypeFiltersProps> = ({
  filters,
  stats,
  onFilterChange,
}) => {
  const toggleArtist = () => {
    onFilterChange({ ...filters, showArtists: !filters.showArtists });
  };

  const toggleTrack = () => {
    onFilterChange({ ...filters, showTracks: !filters.showTracks });
  };

  const toggleGenre = () => {
    onFilterChange({ ...filters, showGenres: !filters.showGenres });
  };

  return (
    <div className="type-filters-container">
      <span className="filters-title">Filter Galaxy:</span>
      <div className="filters-group">
        <button
          type="button"
          className={`filter-chip chip-genre ${filters.showGenres ? "active" : ""}`}
          onClick={toggleGenre}
          aria-pressed={filters.showGenres}
        >
          <Radio size={13} />
          <span>Genres</span>
          <span className="filter-count">{stats.genreCount}</span>
        </button>

        <button
          type="button"
          className={`filter-chip chip-artist ${filters.showArtists ? "active" : ""}`}
          onClick={toggleArtist}
          aria-pressed={filters.showArtists}
        >
          <Mic2 size={13} />
          <span>Artists</span>
          <span className="filter-count">{stats.artistCount}</span>
        </button>

        <button
          type="button"
          className={`filter-chip chip-track ${filters.showTracks ? "active" : ""}`}
          onClick={toggleTrack}
          aria-pressed={filters.showTracks}
        >
          <Disc3 size={13} />
          <span>Tracks</span>
          <span className="filter-count">{stats.trackCount}</span>
        </button>
      </div>
    </div>
  );
};
