import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment.prod';
import swal from 'sweetalert2';
import { Book } from '../models/book.model';
import { BookService } from './book.service';

const listBook: Book[] = [
  {
    name: '',
    author: '',
    isbn: '',
    price: 15,
    amount: 2,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 20,
    amount: 1,
  },
  {
    name: '',
    author: '',
    isbn: '',
    price: 8,
    amount: 7,
  },
];
const book: Book = {
  name: '',
  author: '',
  isbn: '',
  price: 15,
  amount: 2,
};

fdescribe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  let storage = {};
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });
  beforeEach(() => {
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
    storage = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return storage[key] ? storage[key] : null;
    });
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => {
        return (storage[key] = value);
      }
    );
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('shoul create', () => {
    expect(service).toBeTruthy();
  });
  it('getBook return a list of book and get method', () => {
    service.getBooks().subscribe((response: Book[]) => {
      expect(response).toEqual(listBook);
    });
    const req = httpMock.expectOne(environment.API_REST_URL + '/book');
    expect(req.request.method).toBe('GET');
    req.flush(listBook);
  });
  it('getBookFromCart return empty', () => {
    const listbook = service.getBooksFromCart();
    expect(listbook.length).toBe(0);
  });

  it('addBookToCart add book succesfully when the lisbook does not exist in localstorage', () => {
    const toast = {
      fire: () => null,
    } as any;
    const spy1 = spyOn(swal, 'mixin').and.callFake(() => {
      return toast;
    });
    let listbook = service.getBooksFromCart();
    expect(listbook.length).toBe(0);
    service.addBookToCart(book);
    listbook = service.getBooksFromCart();
    expect(listbook.length).toBe(1);
    expect(spy1).toHaveBeenCalled();
  });

  xit('removeBookFromCart removes the list from the localstorage', () => {
    service.addBookToCart(book);
    let listbook = service.getBooksFromCart();
    expect(listBook.length).toBe(1);
    service.removeBooksFromCart();
    listbook = service.getBooksFromCart();
    expect(listBook.length).toBe(0);
  });
});
