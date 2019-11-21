import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, withRouter } from 'react-router-dom'
import * as ReactRedux from 'react-redux'
import * as Redux from 'redux'
import './index.css';
import AuthorQuiz from './AuthorQuiz';
import AddAuthorForm from './AddAuthorForm';
import * as serviceWorker from './serviceWorker';
import { shuffle, sample } from 'underscore';
import { type } from 'os';


const authors = [
    {
        name: 'Mark Twain',
        imageUrl: 'images/authors/marktwain.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['The Adventures of Huckleberry Finn']
    },
    {
        name: 'Joseph Conrad',
        imageUrl: 'images/authors/josephconrad.png',
        imageSource: 'Wikimedia Commons',
        books: ['Heart of Darkness']
    },
    {
        name: 'J.K. Rowling',
        imageUrl: 'images/authors/jkrowling.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Daniel Ogren',
        books: ['Harry Potter and the Sorcerers Stone']
    },
    {
        name: 'Stephen King',
        imageUrl: 'images/authors/stephenking.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Pinguino',
        books: ['The Shining', 'IT']
    },
    {
        name: 'Charles Dickens',
        imageUrl: 'images/authors/charlesdickens.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['David Copperfield', 'A Tale of Two Cities']
    },
    {
        name: 'William Shakespeare',
        imageUrl: 'images/authors/williamshakespeare.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
];

function reducer(
    state = { authors, turnData: getTurnData(authors), highlight: '' },
    action) {
    switch (action.type) {
        case 'ANSWER_SELECTED':
            const isCorrect = state.turnData.author.books.some((book) => book === action.answer);
            return Object.assign(
                {},
                state, {
                highlight: isCorrect ? 'correct' : 'wrong'
            });
        case 'CONTINUE':
            return Object.assign({}, state, {
                highlight: '',
                turnData: getTurnData(state.authors)
            });
        case 'ADD_AUTHOR':
            return Object.assign({}, state, {
                authors: state.authors.concat([action.author])
            });
        default: return state;
    }
}

let store = Redux.createStore(reducer);

function getTurnData() {
    const allBooks = authors.reduce(function (prev, curr, index) {
        return prev.concat(curr.books);
    }, []);
    const fourRandomBooks = shuffle(allBooks).slice(0, 4);
    const answer = sample(fourRandomBooks);
    return {
        books: fourRandomBooks,
        author: authors.find((author) =>
            author.books.some((title) =>
                title === answer))
    }
}


function App() {
    return <ReactRedux.Provider store={store}>
        <AuthorQuiz />
    </ReactRedux.Provider>;
}

const AuthorWrapper = withRouter(({ history }) =>
    <AddAuthorForm onAddAuthor={(author) => {
        authors.push(author);
        history.push('/');
    }} />
);

ReactDOM.render(
    <BrowserRouter>
        <React.Fragment>
            <Route exact path="/" component={App} />
            <Route exact path="/add" component={AuthorWrapper} />
        </React.Fragment>
    </BrowserRouter>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
