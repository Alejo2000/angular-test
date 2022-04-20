import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookService } from 'src/app/services/book.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { Book } from 'src/app/models/book.model';

const listbook: Book[] = [
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
describe('Cart Component', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CartComponent],
      providers: [BookService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    const service = fixture.debugElement.injector.get(BookService);
    spyOn(service, 'getBooksFromCart').and.callFake(() => listbook);
  });

  it('should creat', () => {
    expect(component).toBeTruthy();
  });
  it('getTotalPrice return  an amount ', () => {
    const totalPrice = component.getTotalPrice(listbook);
    expect(totalPrice).toBeGreaterThan(0);
    expect(totalPrice).not.toBeNull();
  });
  it('onInputNumberChange increment ', () => {
    const action = 'plus';
    const book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 2,
    };
    const service = fixture.debugElement.injector.get(BookService);
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);
    expect(book.amount).toBe(2);
    component.onInputNumberChange(action, book);

    expect(book.amount).toBe(3);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('onInputNumberChange decrement correctly ', () => {
    const action = 'minus';
    const book = {
      name: '',
      author: '',
      isbn: '',
      price: 15,
      amount: 3,
    };
    const service = fixture.debugElement.injector.get(BookService);
    const spy1 = spyOn(service, 'updateAmountBook').and.callFake(() => null);
    const spy2 = spyOn(component, 'getTotalPrice').and.callFake(() => null);
    component.onInputNumberChange(action, book);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('onClearBooks works correctly', () => {
    component.listCartBook = listbook;
    const service = fixture.debugElement.injector.get(BookService);
    const spy1 = spyOn(
      component as any,
      '_clearListCartBook'
    ).and.callThrough();
    const spy2 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.onClearBooks();
    expect(component.listCartBook.length).toBe(0);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('_clearListCartBook works correctly', () => {
    const service = fixture.debugElement.injector.get(BookService);
    const spy1 = spyOn(service, 'removeBooksFromCart').and.callFake(() => null);
    component.listCartBook = listbook;
    component['_clearListCartBook']();
    expect(spy1).toHaveBeenCalled();
  });
});
