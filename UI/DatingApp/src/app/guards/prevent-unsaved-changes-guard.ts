import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../components/members/members-tails/member-details/member-profile/member-profile';
import { MembersService } from '../services/members/members-service';
import { inject } from '@angular/core';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  let membersService = inject(MembersService);

  if(component.form.dirty && membersService.editMode()){
    return confirm('Are you sure you wand to continue? All unsaved changes will be lost')
  }

  return true;
};
