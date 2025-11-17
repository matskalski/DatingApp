import { MembersService } from './../../../../../services/members/members-service';
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MemberPhotos } from "./member-photos"
import { provideZonelessChangeDetection, signal } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { provideRouter } from "@angular/router";
import { AccountsService } from "../../../../../services/accounts/accounts-service";
import { PhotoModel } from '../../../../../models/photo-model';
import { of } from 'rxjs';

describe('MembersPhotosTests', () => {
  let component: MemberPhotos;
  let fixture: ComponentFixture<MemberPhotos>;
  const membersServiceMock = {
    editMode: signal(false),

    uploadPhoto: jest.fn()
      .mockImplementation(() => {
        const res: PhotoModel = {
          id: 1,
          url: 'test',
          publicId: undefined,
          memberId: '1'
        };

        return of(res);
      })
  };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([

        ]),
        AccountsService,
        { provide: MembersService, useValue: membersServiceMock },
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPhotos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('onUploadImage should upload photo file', () => {
    const file: File = {
      lastModified: 2,
      name: 'name',
      webkitRelativePath: '',
      size: 23,
      type: '',
      arrayBuffer: jest.fn(),
      bytes: jest.fn(),
      slice: jest.fn(),
      stream: jest.fn(),
      text: jest.fn()
    }

    component.onUploadImage(file);

    expect(membersServiceMock.editMode()).toBe(false);
    expect(component['loading']()).toBe(false);
    expect(component['photos']()[0].id).toBe(1);
    expect(component['photos']()[0].url).toBe('test');
    expect(component['photos']()[0].publicId).toBe(undefined);
    expect(component['photos']()[0].memberId).toBe('1');

  });
})
