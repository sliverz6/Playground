class Book {
    constructor(title, imageUrl, content, link, category) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.content = content;
        this.link = link;
        this.category = category;
    }
}

class UIHelper {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(book => {
            UIHelper.addBookToList(book);
        })
    }

    static addBookToList(book) {
        const root = document.querySelector(`#${book.category} ul`);

        const bookEl = document.createElement('li');
        bookEl.className = 'section__item';

        bookEl.innerHTML = `
            <div class="card">
                <div class="card__img">
                    <img src="${book.imageUrl}" alt="${book.title}">
                </div>
                <div class="card__content">
                    <h3 class="card__title">${book.title}</h3>
                    <p class="card__paragraph">${book.content}</p>
                    <a href="${book.link}" class="card__link">교보문고</a>
                </div>
            </div>
        `;

        root.append(bookEl);
    }

    static clearField() {
        document.querySelector('#title').value = '';
        document.querySelector('#imageUrl').value = '';
        document.querySelector('#content').value = '';
        document.querySelector('#link').value = ''; 
        document.querySelector('#select').value = '';
    }
}

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook() {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.title === title) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

class App {
    static init() {
        document.addEventListener('DOMContentLoaded', UIHelper.displayBooks);

        document.querySelector('.submit-btn').addEventListener('click', App.addBook);
    }   
    
    static addBook() {
        const title = document.querySelector('#title').value;
        const imageUrl = document.querySelector('#imageUrl').value;
        const content = document.querySelector('#content').value;
        const link = document.querySelector('#link').value; 
        const category = document.querySelector('#select').value;

        if (
            title.trim() === '' || 
            imageUrl.trim() === '' || 
            content.trim() === '' || 
            link.trim() === ''
        ) {
            alert('입력폼을 채워주세요.');
            return;
        }

        const book = new Book(title, imageUrl, content, link, category);

        UIHelper.addBookToList(book);

        Store.addBook(book);

        UIHelper.clearField();
    }
}

App.init();