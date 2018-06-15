import 'normalize.css';
import 'babel-polyfill';

import React, { Component } from 'react';
import Header from './components/Header';
import LoginContainer from './components/LoginContainer';
import Library from './components/Library';
import TrackList from './components/TrackList';

import styles from './App.scss';

const checkIsLogged = () => {
  try {
    window.MusicKit.getInstance();
    return true;
  } catch (e) {
    return false;
  }
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: checkIsLogged(),
      currentAlbum: null,
    };

    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.setCurrentAlbum = this.setCurrentAlbum.bind(this);
  }

  onLoginSuccess() {
    this.setState({ isLoggedIn: true });
  }

  setCurrentAlbum(currentAlbum) {
    this.setState({ currentAlbum });
  }

  render() {
    return (
      <div className={styles.container}>
        <Header />
        {
          this.state.isLoggedIn ? (
            <div className={styles['main-content']}>
              <Library onAlbumSelected={this.setCurrentAlbum} />
              <TrackList album={this.state.currentAlbum} />
            </div>
          ) : (
            <LoginContainer onLoginSuccess={this.onLoginSuccess} />
          )
        }
      </div>
    );
  }
}

export default App;