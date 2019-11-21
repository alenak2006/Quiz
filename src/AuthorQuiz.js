import React from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom'
import * as ReactRedux from 'react-redux'
import * as Redux from 'redux'
import logo from './logo.svg';
import './App.css';
import './bootstrap.min.css';
import PropTypes from 'prop-types';

function Hero() {
  return (<div className="row">
    <div className="jumbotron col-10 offset-1">
      <h1>Author Quiz</h1>
      <p>Select the book written by the author shown</p>
    </div>
  </div>)
}

function Book({ title, onClick }) {
  return (<div className="answer" onClick={() => { onClick(title); }}>
    <h4>{title}</h4>
  </div>)
}

function Turn({ author, books, highlight, onAnswerSelected }) {
  function highlightToBGColor(highlight) {
    const mapping = {
      'none': '',
      'correct': 'green',
      'wrong': 'red'
    }
    return mapping[highlight];
  }
  return (<div className="row turn" style={{ backgroundColor: highlightToBGColor(highlight) }}>
    <div className="col-4 offset-1">
      <img src={author.imageUrl} className="authorimage" alt="Author" />

    </div>
    <div className="col-6">
      {books.map((title) => <Book title={title} key={title} onClick={onAnswerSelected} />)}
    </div>

  </div>)

}

Turn.propTypes = {
  author: PropTypes.shape({
    name: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    imageSource: PropTypes.string.isRequired,
    books: PropTypes.arrayOf(PropTypes.string).isRequired
  }),
  books: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAnswerSelected: PropTypes.func.isRequired,
  highlight: PropTypes.string.isRequired
}

function Continue({ show, onContinue }) {
  return (
    <div className="row continue">
      {show
        ? <div className="col-11">
          <button className="btn btn-primary btn-lg float-right" onClick={onContinue}>Continue</button>
        </div>
        : null}
    </div>);
}



function Footer() {
  return (<div id="footer" className="row">
    <div className="col- 12">
      <p className="text-muted credit">
        All images are from <a href="http://commons.wikimedia.org/wiki/Main_Page">Wikemedia Commons</a> and are in the public domain
      </p>
    </div>
  </div>)


}

let container = Redux.createStore((model = { running: false, time: 0 }, action) => {
  const updates = {
    'START': (model) => Object.assign({}, model, { running: true }),
    'STOP': (model) => Object.assign({}, model, { running: false }),
    'TICK': (model) => Object.assign({}, model, { time: model.time + (model.running ? 1 : 0) })
  };
  return (updates[action.type] || (() => model))(model);
});

const mapStateToPropsW = (state) => state;
const mapDispatchToPropsW = (dispatch, props) => ({
  onStart: () => { dispatch({ type: 'START' }); },
  onStop: () => { dispatch({ type: 'STOP' }); }
});

const Stopwatch = ReactRedux.connect(mapStateToPropsW, mapDispatchToPropsW)((props) => {
  let minutes = Math.floor(props.time / 60);
  let seconds = props.time - (minutes * 60);
  let secondsFormatted = `${seconds < 10 ? '0' : ''}${seconds}`;

  return <div className="row timer">
    <p className="timer">Game Timer {minutes}:{secondsFormatted}</p>
    <button className="btn btn-secondary" onClick={props.running ? props.onStop : props.onStart}>
      {props.running ? 'Stop' : 'Start'}
    </button>
  </div>;
});

setInterval(() => {
  container.dispatch({ type: 'TICK' })
}, 1000)

function mapStateToProps(state) {
  return {
    turnData: state.turnData,
    highlight: state.highlight
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onEventSelected: (answer) => {
      dispatch({ type: 'ANSWER_SELECTED', answer })
    },
    onContinue: () => {
      dispatch({ type: 'CONTINUE' })
    }
  }
}


const AuthorQuiz = ReactRedux.connect(mapStateToProps, mapDispatchToProps)(
  function ({ turnData, highlight, onAnswerSelected, onContinue }) {
    return (
      <div className="container-fluid">
        <ReactRedux.Provider store={container}>
          <Stopwatch />
        </ReactRedux.Provider>
        <Hero />
        <Turn {...turnData} highlight={highlight} onAnswerSelected={onAnswerSelected} />
        <Continue show={highlight === "correct"} onContinue={onContinue} />
        <p><Link to="/add">Add an author</Link></p>
        <Footer />
      </div>
    );
  });


export default AuthorQuiz;
