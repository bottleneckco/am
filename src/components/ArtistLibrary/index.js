import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.scss';
import Loader from '../Loader';
import Artist from '../Artist';
import Album from '../Album';

/* eslint-disable no-await-in-loop */

class ArtistLibrary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artists: [],
      currentArtist: null,
      indivAlbums: [],
    };

    this.load = this.load.bind(this);
    this.loadIndiv = this.loadIndiv.bind(this);
    this.setArtist = this.setArtist.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    this.load();
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  setArtist(artist) {
    this.setState({
      currentArtist: artist,
    }, () => {
      this.loadIndiv();
    });
  }

  async load() {
    let temp = [];
    do {
      temp = await window.MusicKitInstance.api.library.artists(null, {
        limit: 100,
        offset: this.state.artists.length,
      });

      if (!this.mounted) {
        break;
      }

      this.setState({
        artists: [...this.state.artists, ...temp],
      });
    } while (temp.length > 0);
  }

  async loadIndiv() {
    const { id } = this.state.currentArtist;
    const { relationships } = await window.MusicKitInstance.api.library.artist(id, {
      include: ['albums'],
    });
    this.setState({
      indivAlbums: relationships.albums.data,
    });
  }

  render() {
    const { onAlbumSelected } = this.props;
    const { artists, currentArtist, indivAlbums } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles['artist-list']}>
          {
            artists.length > 0 ? artists.map((artist) => (
              <Artist artist={artist} onSelected={() => this.setArtist(artist)} />
            )) : <Loader />
          }
        </div>
        <div className={styles.indiv}>
          <span className={styles.title}>
            {
              currentArtist !== null ? currentArtist.attributes.name : ''
            }
          </span>
          <span className={styles['album-count']}>
            {
              indivAlbums.length > 0 ? `${indivAlbums.length} albums` : null
            }
          </span>
          <div className={styles.albums}>
            {
              indivAlbums.length > 0 ? indivAlbums.map((album) => (
                <Album key={album.id} album={album} onSelected={onAlbumSelected} />
              )) : null
            }
            {
              currentArtist !== null && indivAlbums.length === 0 ? <Loader /> : null
            }
          </div>
        </div>
      </div>
    );
  }
}

ArtistLibrary.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
};

export default ArtistLibrary;