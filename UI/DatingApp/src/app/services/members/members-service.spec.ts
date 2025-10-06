import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MembersService } from './members-service';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { MemberModel } from '../../models/member-model';
import { environment } from '../../../environments/environment.development';

describe('members service', () => {
  let membersService: MembersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MembersService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    membersService = TestBed.inject(MembersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('creates service', () => {
    expect(membersService).toBeTruthy()
  });

  it('getMembers should return list of members', () => {
    let members: MemberModel[] | undefined

    membersService.getMembers().subscribe(resp => {
      members = resp
    });

    const req = httpTestingController
      .expectOne(`${environment.apiUrl}members`);
    req.flush([
      {
        id: '1',
        displayName: 'member1',
        dateOfBirth: '2000-01-01',
        imageUrl: null,
        created: '2024-11-04',
        lastActive: '2025-10-12',
        gender: 'male',
        description: 'desc1',
        city: 'city1',
        country: 'country1'
      },
      {
        id: '2',
        displayName: 'member2',
        dateOfBirth: '2006-03-12',
        imageUrl: null,
        created: '2025-06-19',
        lastActive: '2025-10-12',
        gender: 'female',
        description: 'desc2',
        city: 'city2',
        country: 'country2'
      },
    ]);

    expect(members).toEqual([
      {
        id: '1',
        displayName: 'member1',
        dateOfBirth: '2000-01-01',
        imageUrl: null,
        created: '2024-11-04',
        lastActive: '2025-10-12',
        gender: 'male',
        description: 'desc1',
        city: 'city1',
        country: 'country1'
      },
      {
        id: '2',
        displayName: 'member2',
        dateOfBirth: '2006-03-12',
        imageUrl: null,
        created: '2025-06-19',
        lastActive: '2025-10-12',
        gender: 'female',
        description: 'desc2',
        city: 'city2',
        country: 'country2'
      },
    ]);
  });

  it('getMember should return a particular member', () => {
    let members: MemberModel | undefined

    membersService.getMember('1').subscribe(resp => {
      members = resp
    });

    const req = httpTestingController
      .expectOne(`${environment.apiUrl}members/1`);
    req.flush([
      {
        id: '1',
        displayName: 'member1',
        dateOfBirth: '2000-01-01',
        imageUrl: null,
        created: '2024-11-04',
        lastActive: '2025-10-12',
        gender: 'male',
        description: 'desc1',
        city: 'city1',
        country: 'country1'
      }
    ]);

    expect(members).toEqual([
      {
        id: '1',
        displayName: 'member1',
        dateOfBirth: '2000-01-01',
        imageUrl: null,
        created: '2024-11-04',
        lastActive: '2025-10-12',
        gender: 'male',
        description: 'desc1',
        city: 'city1',
        country: 'country1'
      }
    ]);
  });
});