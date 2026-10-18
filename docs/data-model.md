# Data Model: Music Universe

## Node types
- `artist`
- `track`
- `genre`

Each node has a stable ID, type, label, optional activity metric, optional media/external links, optional metadata, and a data-origin marker.

## Edge types
- `artist_track`: artist performs a track.
- `artist_genre`: artist is associated with a genre.
- `track_genre`: track is associated with a genre only when supported by source/demo data.
- `related_artist`: optional; must be sourced or explicitly marked as derived.

## Example
```json
{
  "nodes": [
    {"id":"artist-tame-impala","type":"artist","label":"Tame Impala","listeningCount":128,"dataOrigin":"demo"},
    {"id":"track-let-it-happen","type":"track","label":"Let It Happen","listeningCount":42,"dataOrigin":"demo"},
    {"id":"genre-psychedelic-pop","type":"genre","label":"Psychedelic Pop","dataOrigin":"demo"}
  ],
  "edges": [
    {"id":"edge-artist-track","source":"artist-tame-impala","target":"track-let-it-happen","type":"artist_track","dataOrigin":"demo"},
    {"id":"edge-artist-genre","source":"artist-tame-impala","target":"genre-psychedelic-pop","type":"artist_genre","dataOrigin":"demo"}
  ]
}
```

## Metric semantics
- `listeningCount` is a real count only when the source provides a defined count.
- Demo counts are illustrative and labeled as demo.
- Missing metric means unknown, not automatically zero.
- If a provider offers a ranking or time-windowed metric, represent it accurately instead of fabricating a count.
- Document aggregation formulas and avoid double-counting.

## Invariants
- IDs are unique.
- Every edge endpoint exists.
- Edge IDs are unique.
- Node/edge combinations are valid.
- No self-edges unless a future use case defines them.
- `dataOrigin` is always present.
