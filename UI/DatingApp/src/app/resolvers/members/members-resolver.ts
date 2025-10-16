import { inject } from '@angular/core';
import { MembersService } from './../../services/members/members-service';
import { ResolveFn, Router } from '@angular/router';
import { MemberModel } from '../../models/member-model';
import { EMPTY } from 'rxjs';

export const membersResolver: ResolveFn<MemberModel> = (route, state) => {
  const nembersService = inject(MembersService);
  const router = inject(Router)
  const memberId = route.paramMap.get('id');

  if(!memberId) {
    router.navigateByUrl('/not-found')
    return EMPTY;
  }

  return nembersService.getMember(memberId);
};
