import { MembersService } from './../../../../../services/members/members-service';
import { ActivatedRoute } from '@angular/router';
import { Component, HostListener, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MemberModel } from '../../../../../models/member-model';
import { DatePipe } from '@angular/common';
import { EditableMember } from '../../../../../models/editable-member.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UpdateMember } from '../../../../../models/update-member.model';

@Component({
  selector: 'da-member-profile',
  imports: [
    DatePipe,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {

  //nasłuchiwanie na zdarzenia przeglądarki
  //w routingu component ma dodany guard typu can deactivate sprawdzający czy użytkownik nie zaczął wprowadzac zmian w formularzu edycji
  //ma to na celu chronić przed utratą niezapisanych zmian przed przejściem do innego komponentu
  //ale zabezpieczenie guardem działa tylko w obrębie aplikacji angularowej
  //aby zapobiec zamknięciu przeglądarki lub przejściu pod inny adres poza aplikacją bez zapisanych zmian dodany został host listener
  //dzięki temu zanim to nastąpi pojawi się komunikat o niezpisanych zmianach
  @HostListener('window:beforeunload', ['$event']) notify($event:BeforeUnloadEvent){
    if(this.form.dirty && this.membersService.editMode()){
      $event.preventDefault()
    }
  }

  protected member = signal<MemberModel | undefined>(undefined);
  protected editableMember?: EditableMember;
  protected membersService = inject(MembersService);

  private route = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    displayName: ['', [
      Validators.required
    ]],
    description: '',
    city: [this.member()?.city, [
      Validators.required
    ]],
    country: ['', [
      Validators.required
    ]],
  })

  ngOnInit(): void {
    // użycie resolvera - używamy parent bo resolver w routingu jest zainmplementowany na poziomie komponentu nadrzędenego
    this.route.parent?.data.subscribe(res => {
      //resolver w routingu jest zarejestrowany pod propertą member - resolve: {member: membersResolver},
      this.member.set(res['member']);
      this.form.setValue({
        displayName: res['member'].displayName,
        description: res['member'].description,
        city: res['member'].city,
        country: res['member'].country
      });
    });
  };

  updateProfile() {
    if (!this.member()) {
      return;
    };

    let updateMember: UpdateMember = {
      displayName: this.form.controls['displayName'].value,
      description: this.form.controls['description'].value,
      city: this.form.controls['city'].value,
      country: this.form.controls['country'].value
    }

    this.membersService.updateMember(updateMember).subscribe(
    )

    this.membersService.editMode.set(false);

    console.log(this.membersService.editMode())
  };

  ngOnDestroy(): void {
    if (this.membersService.editMode()) {
      this.membersService.editMode.set(false);
    }
  };
}
