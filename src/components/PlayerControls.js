import React, { useState, useEffect } from 'react';
import {
  FormattedTime,
  PlayerIcon,
  Slider,
  Direction,
} from 'react-player-controls';

import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  align-items: center;
  justify-items: center;
  grid-template-areas:
    "progress-bar progress-bar"
    "time-marker bitrate"
    "playback-controls playback-controls";
  grid-template-columns: "1fr 1fr";
  grid-template-rows: 1fr;
  grid-column-gap: 10px;
  row-gap: 12px;
`;

const StyledSlider = styled(Slider)`
  display: grid;
`;

const SliderBar = styled.div`
  height: 6px;
  width: 100%;
`;

const SliderBarBackground = styled(SliderBar)`
  background-color: ${(props) => props.theme.background.secondary};
  border-radius: 3px;
  grid-area: 1/1;
`;
const SliderBarBuffer = styled(SliderBar)`
  background-color: ${(props) => props.theme.background.tertiary};
  width: ${(props) => props.progress}%;
  border-radius: 3px;
  grid-area: 1/1;
`;
const SliderBarPlayTime = styled(SliderBar)`
  background-color: ${(props) => props.theme.branding};
  border-radius: 3px;
  width: ${(props) => props.progress || 0}%;
  grid-area: 1/1;
`;
const SliderBarSeek = styled(SliderBar)`
  background-color: ${(props) => props.theme.branding};
  border-radius: 3px;
  opacity: 0.7;
  width: ${(props) => props.progress}%;
  grid-area: 1/1;
`;

const SliderHandle = styled.div`
  position: absolute;
  left: ${(props) => props.progress}%;
  background: ${(props) => props.theme.branding};
  width: 16px;
  height: 16px;
  border-radius: 100%;
  transform: translate(-50%, -30%);
  opacity: 0;
  transition: opacity 40ms;
`;

const SliderWrapper = styled.div`
  grid-area: ${(props) => props.gridArea};

  justify-self: stretch;
  &:hover {
    cursor: pointer;
    ${SliderHandle} {
      opacity: 1;
    }
  }
`;

const TimeDisplay = styled(FormattedTime)`
  justify-self: start;
  color: ${(props) => props.theme.text.secondary};
  font-weight: 500;
  font-size: 0.7em;
`;

const Controls = styled.div`
  grid-area: playback-controls;
`;

const Bitrate = styled.span`
  justify-self: end;
  grid-area: bitrate;
  color: ${(props) => props.theme.text.secondary};
  font-weight: 500;
  font-size: 0.7em;
`;

const StyledButton = styled.button`
  overflow: hidden;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  transition: transform 40ms;

  &:hover {
    cursor: pointer;
    transform: scale(1.3);
  }

  svg {
    fill: ${(props) => props.theme.branding};
  }
`;

const VolumeMenu = styled.div`
  position: absolute;
  background: #fff;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.2);
  width: 90px;
  padding: 12px;
  bottom: 12px;
  right: 12px;
  border-radius: 3px;
`;

function PlayerControls() {
  const { player } = window.MusicKitInstance;
  const { Events, PlaybackStates } = window.MusicKit;

  const [bitrate, setBitrate] = useState(player.bitrate);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [playbackState, setPlaybackState] = useState(player.playbackState);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [currentBufferedProgress, setCurrentBufferedProgress] = useState(0);
  const [volume, setVolume] = useState(player.volume);
  const [seekIntentValue, setSeekIntentValue] = useState(0);
  const [isVolumeMenuOpen, setIsVolumeMenuOpen] = useState(false);

  const isPlaying = playbackState === PlaybackStates.playing;

  function onPlaybackChange() {
    switch (playbackState) {
      case PlaybackStates.playing:
        window.MusicKitInstance.pause();
        break;
      case PlaybackStates.paused:
        window.MusicKitInstance.play();
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    const playbackStateCb = ({ state }) => setPlaybackState(state);
    const progressCb = ({ currentPlaybackDuration, currentPlaybackTime }) => {
      setPlaybackTime(currentPlaybackTime);
      setPlaybackDuration(currentPlaybackDuration);
      setCurrentBufferedProgress(player.currentBufferedProgress);
    };
    const volumeCb = ({ target }) => setVolume(target.volume);
    const bitrateCb = ({ bitrate: b }) => setBitrate(b);
    player.addEventListener(Events.playbackStateDidChange, playbackStateCb);
    player.addEventListener(Events.playbackTimeDidChange, progressCb);
    player.addEventListener(Events.playbackVolumeDidChange, volumeCb);
    player.addEventListener(Events.playbackBitrateDidChange, bitrateCb);

    return () => {
      player.removeEventListener(
        Events.playbackStateDidChange,
        playbackStateCb,
      );
      player.removeEventListener(Events.playbackProgressDidChange, progressCb);
      player.removeEventListener(Events.playbackVolumeDidChange, volumeCb);
      player.removeEventListener(Events.playbackBitrateDidChange, bitrateCb);
    };
  }, []);

  const playbackPercentage = (playbackTime / playbackDuration) * 100; // out of 100

  return (
    <Wrapper>
      <SliderWrapper gridArea="progress-bar">
        <StyledSlider
          direction={Direction.HORIZONTAL}
          onIntent={setSeekIntentValue}
          onIntentEnd={() => setSeekIntentValue(0)}
          onChange={(value) => player.seekToTime(value * playbackDuration)}
        >
          <SliderBarBackground />
          <SliderBarBuffer progress={currentBufferedProgress} />
          <SliderBarSeek progress={seekIntentValue * 100} />
          <SliderBarPlayTime progress={playbackPercentage} />
          <SliderHandle progress={playbackPercentage} />
        </StyledSlider>
      </SliderWrapper>

      {isVolumeMenuOpen && (
        <VolumeMenu>
          <SliderWrapper gridArea="volume">
            <StyledSlider
              direction={Direction.HORIZONTAL}
              onChange={(vol) => {
                player.volume = vol;
              }}
            >
              <SliderBarBackground />
              <SliderBarPlayTime progress={volume * 100} />
              <SliderHandle progress={volume * 100} />
            </StyledSlider>
          </SliderWrapper>
        </VolumeMenu>
      )}

      <TimeDisplay numSeconds={playbackTime} />
      <Controls>
        <StyledButton
          onClick={() => {
            if (playbackPercentage <= 10) {
              player.skipToPreviousItem();
            } else {
              player.seekToTime(0);
            }
          }}
        >
          <PlayerIcon.Previous />
        </StyledButton>
        <StyledButton onClick={() => onPlaybackChange(!isPlaying)}>
          {isPlaying && <PlayerIcon.Pause />}
          {!isPlaying && <PlayerIcon.Play />}
        </StyledButton>
        <StyledButton onClick={() => player.skipToNextItem()}>
          <PlayerIcon.Next />
        </StyledButton>
        <StyledButton onClick={() => setIsVolumeMenuOpen((open) => !open)}>
          <PlayerIcon.SoundOn />
        </StyledButton>
      </Controls>
      <Bitrate>
        {bitrate}
k
      </Bitrate>
    </Wrapper>
  );
}

export default PlayerControls;
