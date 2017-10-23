import React, { Component } from 'react'
// import * as BooksAPI from './BooksAPI'
import '../App.css'
import { Book, Loading } from '../components';
import * as BooksAPI from '../BooksAPI';
import { Link } from 'react-router-dom';
import _ from 'lodash';

const BOOK_SECTIONS = [ 'Currently Reading', 'Want To Read', 'Read' ];

class Dashboard extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            books: null
        };
    }

    componentDidMount() {
        this.fetchBooks();
    }

    fetchBooks() {
        BooksAPI.getAll().then(books => this.setState({ books }));
    }
    
    formatSection(section) {
        return section.charAt(0).toLowerCase() + section.slice(1).replace(/ /g, '');
    }
    
    updateBook(book, opt) {
        let { books } = this.state;
        BooksAPI.update(book, opt).then(resp => {
            const index = _.findIndex(books, item => item.id === book.id);
            
            if(index !== -1)
                books[index].shelf = opt;

            this.setState({ books });
        });
    }

    renderBook(section){
        const { books } = this.state;
        return (
            <ol className="books-grid">
                { books.map(book => (
                    book.shelf === this.formatSection(section) &&
                        <li key={book.id}>
                            <Book 
                                onSelect={opt => this.updateBook(book, opt)}
                                book={book}
                            />
                        </li>
                ))}
            </ol>
        );
    }

    renderBookList() {
        return (
            <div className="list-books-content">
                <div>
                { BOOK_SECTIONS.map(section => {
                    return (
                        <div className="bookshelf" key={section}>
                            <h2 className="bookshelf-title">{section}</h2>
                            <div className="bookshelf-books">
                                {this.renderBook(section)}
                            </div>
                        </div>
                    );
                })}
                </div>
            </div>
        );
    }

    render() {
        const { books } = this.state;
        return(
            <div className="list-books">
                <div className="list-books-title">
                    <h1>MyReads</h1>
                </div>
                <div className='loading-container'>
                    { books ? this.renderBookList() : <Loading /> }
                </div>
                <div className="open-search">
                    <Link to='/search'>Add a book</Link>
                </div>
            </div>
        );
    }
}

export { Dashboard };