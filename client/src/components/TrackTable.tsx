/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

type TrackType = {
  [key: string]: any;
};

function TrackTable({ filter, limit }: TrackType) {
  // 'items' are objects, gonna have to get more creative here.
  console.log(filter);
  console.log(limit);

  const previewRef = useRef<HTMLTableSectionElement>(null);

  const updatePreview = () => {
    // This is so ugly but this works LOL
    if (previewRef.current) {
      const arr = Array.from(previewRef.current.children);
      arr
        .slice(1)
        .forEach((element) =>
          (element.children[1].children[0] as HTMLAudioElement).load()
        );
    }
  };

  useEffect(() => {
    updatePreview();
  }, [filter]);

  return (
    <table className="top-tr-tb">
      <tbody ref={previewRef}>
        {filter.items
          ? filter.items
              .slice(0, limit)
              .map((entry: TrackType, index: number) => (
                <tr className="entry" key={index}>
                  <td width="65%">
                    <img
                      className="album-cover"
                      src={entry.album.images[1].url}
                      alt="cover-fallbacks"
                    />

                    <p className="song-name">{entry.name}</p>
                    <p className="artist">{entry.artists[0].name}</p>
                  </td>

                  <td>
                    <audio controls>
                      <source
                        key={index}
                        src={entry.preview_url}
                        type="audio/mpeg"
                      />
                    </audio>
                  </td>
                </tr>
              ))
          : null}
      </tbody>
    </table>
  );
}

TrackTable.propTypes = {
  filter: PropTypes.oneOfType([PropTypes.object]).isRequired,
  limit: PropTypes.number.isRequired,
};

export default TrackTable;
