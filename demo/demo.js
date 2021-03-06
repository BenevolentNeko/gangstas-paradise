import React, { Component } from 'react';

import {
  Analyser,
  Song,
  Sequencer,
  Sampler,
  Synth,
  Monosynth,
  Chorus,
  Gain,
  Reverb,
} from '../src';

import KaraokeLyric from 'react-karaoke-lyric';
import { paradise } from './lyrics';

import Polysynth from './polysynth';
import Visualization from './visualization';

import './index.css';

const tempo = 80;
let intervalRef = null;
let percentageIntervalRef = null;
export default class Demo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playing: true,
      lightMode: true,
      currentLine: 0,
      percentage: 1,
    };

    this.handleAudioProcess = this.handleAudioProcess.bind(this);
    this.handlePlayToggle = this.handlePlayToggle.bind(this);
    this.toggleLightMode = this.toggleLightMode.bind(this);
  }
  handleAudioProcess(analyser) {
    this.visualization.audioProcess(analyser);
  }
  handlePlayToggle() {
    const playing = !this.state.playing;
    this.setState({
      playing,
    });

    if (playing) {
      const barInterval = (60000 / 80) * 4;
      const percentageInterval = barInterval / 5000;
      intervalRef = setInterval(() => {
        const currentLine = this.state.currentLine + 1;
        this.setState({
          currentLine,
          percentage: 0
        });
      }, barInterval);

      percentageIntervalRef = setInterval(() => {
        const percentage = this.state.percentage + percentageInterval;
        this.setState({
          percentage
        });
      }, 16);
    } else {
      if (intervalRef) {
        clearInterval(intervalRef);
        this.setState({
          currentLine: 0,
          percentage: 0
        });
      }
      if (percentageIntervalRef) {
        clearInterval(percentageIntervalRef);
        this.setState({
          currentLine: 0,
          percentage: 0
        });
      }
    }
  }

  toggleLightMode(){
    this.setState({lightMode: !this.state.lightMode});
  }

  render() {
    return (
      <div style={this.state.lightMode ? {
        paddingTop: '30px'
      } : {
        backgroundColor: '#000',
        width: '100%',
        height: '100%',
        paddingTop: '30px'
      }}>
      <div style={{ textAlign: 'center' }}>
        <KaraokeLyric text={paradise[this.state.currentLine]} percentage={this.state.percentage} />
        { paradise[this.state.currentLine+1] && <KaraokeLyric text={paradise[this.state.currentLine+1]} percentage={0} /> }
      </div>
        <Song
          playing={this.state.playing}
          tempo={tempo}
        >
          <Analyser onAudioProcess={this.handleAudioProcess}>
            <Sequencer
              resolution={16}
              bars={1}
            >
              <Reverb>
                <Gain amount={1.8}>
                  <Sampler
                    sample="samples/kick.wav"
                    steps={[0, 8, 10]}
                  />
                </Gain>
                <Sampler
                  sample="samples/snare.wav"
                  steps={[4, 12]}
                />
              </Reverb>
            </Sequencer>
            <Sequencer
              resolution={8}
            >
              <Gain amount={0.6}>
                <Reverb>
                <Sampler
                  sample="samples/hihat.wav"
                  steps={[0,1,2,3,4,5,6,7]}
                />
                </Reverb>
              </Gain>
            </Sequencer>
            <Sequencer
              resolution={16}
              bars={2}
            >
                <Polysynth
                  steps={[
                    [0, 1, ['c6', 'g#5']],
                    [4, 1, ['c6', 'g#5']],
                    [8, 1, ['c6', 'g#5']],
                    [12, 1, ['c6', 'g#5']],
                    [16, 1, ['b5', 'd5']],
                    [20, 1, ['b5', 'd5']],
                    [24, 1, ['c6', 'g5']],
                    [28, 1, ['g5', 'c5']]
                  ]}
                />
            </Sequencer>
            <Sequencer
              resolution={16}
              bars={2}
            >
            <Reverb>
              <Gain amount={1.5}>
              <Synth
                type='sine'
                envelope={{
                  attack: 0.01,
                  sustain: 0.8,
                  decay: 2,
                  release: 0.5
                }}
                transpose={1} 
                gain={0.2}
                steps={[
                  [0, 7, ['g#2', 'c3', 'd#2']],
                  [8, 7, ['f2', 'g#2', 'c3']],
                  [16, 7, ['g2', 'd2', 'b2']],
                  [24, 7, ['c2', 'd#2', 'g2', 'c3']]
                ]}
              />
              </Gain>
              </Reverb>
            </Sequencer>
          </Analyser>
        </Song>

        <div style={{ textAlign: 'center' }}>
          <p style={this.state.lightMode ? {color: 'black'} : {color: 'white'}}>Light Mode</p>
          <label className="switch">
            <input type="checkbox" onChange={this.toggleLightMode} checked={this.state.lightMode} />
            <div className="slider round"></div>
          </label>
        </div>

        <Visualization ref={(c) => { this.visualization = c; }} />

        <button
          className="react-music-button"
          type="button"
          onClick={this.handlePlayToggle}
        >
          {this.state.playing ? 'Stop' : 'Play'}
        </button>
      </div>
    );
  }
}
