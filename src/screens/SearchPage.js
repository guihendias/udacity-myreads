import React, { Component } from 'react'
import '../App.css'
import { Link } from 'react-router-dom';
import { Book, Loading } from '../components';
import * as BooksAPI from '../BooksAPI';
import _ from 'lodash';

class SearchPage extends Component {

    constructor(props) {
        super(props);
        
        this.state = {
            term: '',
            books: []
        };
    }

    search(term) {
        term && this.setState({ books: null }, () => {
            BooksAPI.search(term).then(books => {
                books.error ? 
                this.setState({ books }) 
                :
                BooksAPI.getAll().then(shelfBooks => {
                    const bookIds = _.map(shelfBooks, 'id');
                    
                    books = books.filter(book => !bookIds.includes(book.id))
                    this.setState({ books });
                });

            }).catch(error => console.log(error));
        });
    }

    updateBook(book, opt) {
        let { books } = this.state;
        BooksAPI.update(book, opt).then(resp => {
            this.setState({ books: books.filter(item => item.id !== book.id) });
        });
    }

    renderBookList() {
        const { books } = this.state;
        
        if(books.error == 'empty query')
            return <p style={{ textAlign: 'center' }}>Nenhum resultado disponível</p>
        return (
            <ol className="books-grid">
                { books.map(book => (
                    <li key={book.id} >
                        <Book 
                            onSelect={opt => this.updateBook(book, opt)}
                            book={book}
                        />
                    </li>
                ))}
            </ol>
        )
    }

    render() {
        const booksSearch = _.debounce(term => { this.search(term) }, 300);
        const { books } = this.state; 

        return(
            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className='close-search'>Close</Link>
                    <div className="search-books-input-wrapper">
                        <input 
                            type="text" 
                            onChange={event => booksSearch(event.target.value)} 
                            placeholder="Search by title or author" />
                    </div>
                </div>
                <div className="search-books-results">
                    { books ? this.renderBookList() : <Loading /> }
                </div>
            </div>
        );
    }
}

export { SearchPage };