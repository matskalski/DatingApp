import { TestBed } from "@angular/core/testing";
import { LocalStorageService } from "./local-storage-service";

describe('local storage service', () => {
  let localStorageService: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({})

    localStorageService = TestBed.inject(LocalStorageService);
    localStorage.clear();
  });

  it('creates a service', () => {
    expect(localStorageService).toBeTruthy();
  });

    describe('getItem', () => {
      it('should return value by key', () => {
        let value : TestModel = {
          id: 1,
          name: 'name'
        };

        localStorage.setItem('test', JSON.stringify(value));

        let result = localStorageService.getItem('test');
        expect(result).toBe(JSON.stringify(value));
      });

      it('when item with passed key does not exists should return null', () => {

        let result = localStorageService.getItem('test');
        expect(result).toBe(null);
      });
    });

    describe('getItemAsObject', ()=>{
      it('should return object by key', ()=>{
        let value : TestModel = {
          id: 1,
          name: 'name'
        };

        localStorage.setItem('test', JSON.stringify(value));

        let result = localStorageService.getItemAsObject<TestModel>('test');

        expect(result?.id).toBe(value.id);
        expect(result?.name).toBe(value.name);
      });

      it('when item with passed key does not exists should return null', () => {

        let result = localStorageService.getItemAsObject<TestModel>('test');
        expect(result).toBe(null);
      });
    });

    describe('setItem', ()=>{
      it('should set item by key', ()=>{
        let value : TestModel = {
          id: 1,
          name: 'name'
        };

        localStorageService.setItem('test', value);

        var result = localStorage.getItem('test');

        expect(result).toBe(JSON.stringify(value));
      });
    });

    describe('removeItem', ()=>{
      it('should removed item with key', ()=>{
        let value : TestModel = {
          id: 1,
          name: 'name'
        };

        localStorageService.setItem('test', value);

        localStorageService.removeItem('test');

        var result = localStorageService.getItem('test');

        expect(result).toBe(null);
      })
    })

});


interface TestModel {
  id: number,
  name: string
}
