import { Directive, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AccountsService } from '../services/accounts/accounts-service';

@Directive({
  selector: '[daHasRole]'
})
export class HasRole implements OnInit {

  appHasRole = input<string[]>([]);

  private accountsService = inject(AccountsService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef);

  ngOnInit(): void {
    if(this.accountsService.currentUser()?.roles.some(r => this.appHasRole().includes(r))){
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
    else{
      this.viewContainerRef.clear()
    }
  }

}
