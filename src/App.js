import React, { Component } from 'react';
import './App.css';
import Uploader from './components/Uploader';
import Results from './components/Results';

class App extends Component {
  // applicationState = pending | uploading | error | results
  state = { applicationState: 'pending', results: null, error: null };
  handleUploaderEvent = (event, data) => {
    let applicationState = '';
    let results = null;
    let error = null;
    switch (event) {
      case 'UPLOADING':
        applicationState = 'uploading';
        break;
      case 'UPLOAD_COMPLETE':
        applicationState = 'results';
        results = data;
        break;
      case 'ERROR':
        applicationState = 'error';
        error = data;
        break;
      default:
        applicationState = 'pending';
    }

    this.setState(() => ({ applicationState, results, error }));
  };

  handleReset = () => {
    this.setState(() => ({
      applicationState: 'pending',
      results: null,
    }));
  };

  renderBody = () => {
    if (this.state.applicationState === 'error') {
      return (
        <React.Fragment>
          <h1>Something went wrong!</h1>
          <p>{this.state.error}</p>
          <button className="App-button" onClick={this.handleReset}>
            Try Again
          </button>
        </React.Fragment>
      );
    } else if (this.state.results) {
      return (
        <React.Fragment>
          <Results results={this.state.results} />
          <button className="App-button" onClick={this.handleReset}>
            Try Again
          </button>
        </React.Fragment>
      );
    } else {
      return <Uploader onEvent={this.handleUploaderEvent} />;
    }
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Is this a Cat?</h1>
        </header>
        <section className="App-content">{this.renderBody()}</section>
      </div>
    );
  }
}

export default App;
