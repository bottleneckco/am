import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import Chart from '../components/Chart';
import Loader from '../components/Loader';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

function TopCharts() {
  const [songCharts, setSongCharts] = useState([]);
  const [albumCharts, setAlbumCharts] = useState([]);
  const [playlistCharts, setPlaylistCharts] = useState([]);
  const [musicVideoCharts, setMusicVideoCharts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await window.MusicKitInstance.api.charts(
        ['albums', 'songs', 'playlists', 'music-videos'],
        { limit: 5 },
      );
      setSongCharts(data.songs);
      setAlbumCharts(data.albums);
      setPlaylistCharts(data.playlists);
      setMusicVideoCharts(data['music-videos']);
    }
    fetchData();
  }, []);

  if (
    isEmpty(songCharts)
    || isEmpty(albumCharts)
    || isEmpty(playlistCharts)
    || isEmpty(musicVideoCharts)
  ) {
    return <Loader />;
  }

  return (
    <Wrapper>
      {albumCharts.map((chart) => (
        <Chart chart={chart} />
      ))}
      {playlistCharts.map((chart) => (
        <Chart chart={chart} />
      ))}
      {songCharts.map((chart) => (
        <Chart chart={chart} />
      ))}
      {musicVideoCharts.map((chart) => (
        <Chart chart={chart} />
      ))}
    </Wrapper>
  );
}

export default TopCharts;
