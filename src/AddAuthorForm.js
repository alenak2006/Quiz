import React from 'react';
import './AddAuthorForm.css';
import AuthorQuiz from './AuthorQuiz';

class AuthorForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            imageUrl: "",
            books: [],
            bookTemp: ''
        }
        this.onFieldChange = this.onFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddBook = this.handleAddBook.bind(this);
    }
    onFieldChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.onAddAuthor(this.state);
    }

    handleAddBook(event) {
        this.setState({
            books: this.state.books.concat([this.state.bookTemp]),
            bookTemp: ''
        })

    }

    render() {
        return <form onSubmit={this.handleSubmit}>
            <div className="AddAuthorForm_input">
                <label htmlFor="name">Name</label>
                <input type="textbox" name="name" value={this.state.name} onChange={this.onFieldChange}></input>
            </div>
            <div className="AddAuthorForm_input">
                <label htmlFor="imageUrl">Image Url</label>
                <input type="textbox" name="imageUrl" value={this.state.imageUrl} onChange={this.onFieldChange}></input>
            </div>
            <div className="AddAuthorForm_input">
                {this.state.books.map((book) => <p key={book}>{book}</p>)}
                <label htmlFor="bookTemp" name="books">Books</label>
                <input type="textbox" name="bookTemp" value={this.state.bookTemp} onChange={this.onFieldChange}></input>
                <input type="button" value="+" onClick={this.handleAddBook}></input>
            </div>
            <div>
                <input type="submit" value="Add" />
            </div>
        </form>
    }
}

function AddAuthorForm({ match, onAddAuthor }) {
    return (
        <div className="AddAuthorForm">
            <h1>Add Author</h1>
            <AuthorForm onAddAuthor={onAddAuthor} />

        </div>)
}

export default AddAuthorForm