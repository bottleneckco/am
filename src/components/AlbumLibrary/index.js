import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Album from '../Album';
import Loader from '../Loader';
import AlbumGrid from '../album-grid';

/* eslint-disable no-await-in-loop */

const sleep = async (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function AlbumLibrary({ onAlbumSelected }) {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    async function fetchData() {
      let prevLength = 0;
      let offset = 0;

      do {
        const temp = await window.MusicKitInstance.api.library.albums(null, {
          limit: 100,
          offset,
        });

        prevLength = temp.length;
        offset += temp.length;

        setAlbums((prevState) => [...prevState, ...temp]);
        await sleep(10);
      } while (prevLength > 0);
    }
    fetchData();
  }, []);

  if (albums.length === 0) {
    return <Loader />;
  }
  return (
    <AlbumGrid>
      {albums.map((album) => (
        <Album key={album.id} album={album} onSelected={onAlbumSelected} />
      ))}
    </AlbumGrid>
  );
}

AlbumLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default AlbumLibrary;
