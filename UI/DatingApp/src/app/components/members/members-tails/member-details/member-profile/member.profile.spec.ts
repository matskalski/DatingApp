import { MembersService } from './../../../../../services/members/members-service';
import { provideZonelessChangeDetection } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MemberProfile } from "./member-profile";
import { provideRouter } from "@angular/router";
import { By } from "@angular/platform-browser";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe('member profile component', () => {
  let component: MemberProfile;
  let fixture: ComponentFixture<MemberProfile>
  let membersService: MembersService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([

        ]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideZonelessChangeDetection()
      ]
    }).compileComponents()
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberProfile);
    component = fixture.componentInstance;
    membersService = TestBed.inject(MembersService);
    fixture.detectChanges();
  })

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  it('when member is defined then member data should be rendered', async () => {
    const member = {
      id: '1',
      displayName: 'member',
      dateOfBirth: '1998-06-11',
      imageUrl: undefined,
      created: '2023-11-24',
      lastActive: '2025-10-12',
      gender: 'male',
      description: 'desc',
      city: 'city',
      country: 'country'
    }

    component['member'].set(member)
    await fixture.whenStable();

    const memberData = fixture.debugElement.query(
      By.css('[test-id="member-data"]')
    )

    expect(memberData).toBeTruthy();
  });

  it('when member is not defined then member data should not be rendered', async () => {
    const member = undefined

    component['member'].set(member)
    await fixture.whenStable();

    const memberData = fixture.debugElement.query(
      By.css('[test-id="member-data"]')
    )

    expect(memberData).toBeFalsy();
  });

  it('when member is defined and edit mode is off then display name and description sections are rendered but edit form not', async () => {
    const member = {
      id: '1',
      displayName: 'member',
      dateOfBirth: '1998-06-11',
      imageUrl: undefined,
      created: '2023-11-24',
      lastActive: '2025-10-12',
      gender: 'male',
      description: 'desc',
      city: 'city',
      country: 'country'
    }

    component['member'].set(member)

    membersService.editMode.set(false);
    await fixture.whenStable()

    const displayName = fixture.debugElement.query(
      By.css('[test-id="display-name"]')
    );

    const description = fixture.debugElement.query(
      By.css('[test-id="description"]')
    );

    const editForm = fixture.debugElement.query(
      By.css('[test-id="edit-form"]')
    );

    expect(displayName).toBeTruthy();
    expect(description).toBeTruthy();
    expect(editForm).toBeFalsy()
  });

  it('when member is defined and edit mode is on then edit form is rendered but displayName and description not', async () => {
    const member = {
      id: '1',
      displayName: 'member',
      dateOfBirth: '1998-06-11',
      imageUrl: undefined,
      created: '2023-11-24',
      lastActive: '2025-10-12',
      gender: 'male',
      description: 'desc',
      city: 'city',
      country: 'country'
    }

    component['member'].set(member)

    membersService.editMode.set(true);
    await fixture.whenStable()

    const displayName = fixture.debugElement.query(
      By.css('[test-id="display-name"]')
    );

    const description = fixture.debugElement.query(
      By.css('[test-id="description"]')
    );

    const editForm = fixture.debugElement.query(
      By.css('[test-id="edit-form"]')
    );

    expect(displayName).toBeFalsy();
    expect(description).toBeFalsy();
    expect(editForm).toBeTruthy()
  });
});
