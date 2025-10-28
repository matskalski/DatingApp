import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../components/members/members-tails/member-details/member-profile/member-profile';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberProfile> = (component) => {
  if(component.form.dirty){
    return confirm('Are you sure you wand to continue? All unsaved changes will be lost')
  }

  return true;
};
