import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import debounce from 'lodash.debounce';

import Album from '../Album';
import Song from '../Song';
import Loader from '../Loader';
import styles from './styles.scss';

class SearchCatalog extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: '',
      isSearching: false,
      songs: [],
      albums: [],
      artists: [],
      playlists: [],
      suggestions: [],
    };

    this.getResultsView = this.getResultsView.bind(this);
    this.fetchSuggestions = debounce(this.fetchSuggestions.bind(this), 300);
    this.clearSuggestions = this.clearSuggestions.bind(this);
    this.search = this.search.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onChange(event, { newValue }) {
    this.setState({
      term: newValue,
    });
  }

  onSuggestionSelected(event, { suggestion }) {
    this.setState({ term: suggestion }, () => this.search());
  }

  getResultsView() {
    if (this.state.isSearching) {
      return (
        <Loader />
      );
    }
    return (
      <div className={styles.results}>
        <div className={styles.section}>
          <span className={styles.title}>Artists</span>
          {
            this.state.artists.map((artist) => <span>{artist.attributes.name}</span>)
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Songs</span>
          {
            this.state.songs.map((song, index) => (
              <Song
                song={song}
                onSelected={() => this.props.onSongSelected(this.state.songs, index)}
              />
            ))
          }
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Albums</span>
          <div className={styles.albums}>
            {
              this.state.albums.map((album) => (
                <Album album={album} onSelected={this.props.onAlbumSelected} />
              ))
            }
          </div>
        </div>
        <div className={styles.section}>
          <span className={styles.title}>Playlists</span>
          {
            this.state.playlists.map((playlist) => <span>{playlist.attributes.name}</span>)
          }
        </div>
      </div>
    );
  }

  async fetchSuggestions({ value }) {
    const hints = await window.MusicKitInstance.api.searchHints(value);
    this.setState({ suggestions: hints.terms });
  }

  async clearSuggestions() {
    this.setState({ suggestions: [] });
  }

  async search() {
    this.setState({ isSearching: true });

    const {
      songs,
      albums,
      artists,
      playlists,
    } = await window.MusicKitInstance.api.search(this.state.term);

    this.setState({
      isSearching: false,
      songs: songs.data,
      albums: albums.data,
      artists: artists.data,
      playlists: playlists ? playlists.data : [],
    });
  }

  render() {
    return (
      <div className={styles.container}>
        <form
          className={styles.search}
          onSubmit={(e) => {
          e.preventDefault();
          this.search();
        }}
        >
          <Autosuggest
            suggestions={this.state.suggestions}
            onSuggestionsFetchRequested={this.fetchSuggestions}
            onSuggestionsClearRequested={this.clearSuggestions}
            onSuggestionSelected={this.onSuggestionSelected}
            renderSuggestion={(sug) => <span>{sug}</span>}
            getSuggestionValue={(sug) => sug}
            inputProps={{
              value: this.state.term,
              onChange: this.onChange,
            }}
          />
          {/* <input type="text" onChange={(e) => this.setState({ term: e.target.value })} /> */}
          <input type="submit" value="Search" />
        </form>
        { this.getResultsView() }
      </div>
    );
  }
}

SearchCatalog.propTypes = {
  onAlbumSelected: PropTypes.func.isRequired,
  onSongSelected: PropTypes.func.isRequired,
};

export default SearchCatalog;
