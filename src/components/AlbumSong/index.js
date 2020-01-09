import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

import trackPropType from '../../prop_types/track';

const Wrapper = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 8fr;
  grid-column-gap: 5px;
  font-size: 0.9em;
  align-items: baseline;
`;

const TrackNumber = styled.span`
  font-family: "SF Mono", Consolas, monospace;
  color: ${(props) => props.theme.text.secondary};
`;

const Title = styled.span`
  text-align: start;
  color: ${(props) => props.theme.text.primary};

  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const AlbumSong = ({ onSelected, song, song: { attributes } }) => (
  <Wrapper
    onClick={(e) => {
      e.stopPropagation();
      onSelected(song);
    }}
    role="presentation"
  >
    <TrackNumber>{attributes.trackNumber}</TrackNumber>
    <Title>{attributes.name}</Title>
  </Wrapper>
);

AlbumSong.defaultProps = {
  onSelected: () => {},
};

AlbumSong.propTypes = {
  song: trackPropType.isRequired,
  onSelected: PropTypes.func,
};

export default AlbumSong;
