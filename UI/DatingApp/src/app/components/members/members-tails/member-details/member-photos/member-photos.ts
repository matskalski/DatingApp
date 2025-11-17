import { AccountsService } from './../../../../../services/accounts/accounts-service';
import { DestroyRef, OnInit, signal } from '@angular/core';
import { Component, inject } from '@angular/core';
import { MembersService } from '../../../../../services/members/members-service';
import { ActivatedRoute } from '@angular/router';
import { PhotoModel } from '../../../../../models/photo-model';
import { ImageUpload } from '../../../../../shared/image-upload/image-upload';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserModel } from '../../../../../models/user-model';
import { MemberModel } from '../../../../../models/member-model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'da-member-photos',
  imports: [
    ImageUpload,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './member-photos.html',
  styleUrl: './member-photos.css'
})
export class MemberPhotos implements OnInit {
  protected photos = signal<PhotoModel[]>([]);
  protected membersService = inject(MembersService);
  protected loading = signal(false);
  protected accountsService = inject(AccountsService);

  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const memberId = this.route.parent?.snapshot.paramMap.get('id');

    if(memberId){
      this.membersService.getMemberPhotos(memberId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => this.photos.set(res));
    }
  };

  // get photoMocks(){
  //   return Array.from({length: 20}, (_, i) => ({
  //     url: 'user.png'
  //   }));
  // }

  onUploadImage(file: File){
    this.loading.set(true);
    this.membersService.uploadPhoto(file)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res =>{
        this.membersService.editMode.set(false);
        this.loading.set(false)
        this.photos.update(photos => [...photos, res])
    });
  }

  setMainPhoto(photo: PhotoModel){
    this.membersService.setMainPhoto(photo.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => {
        const currentUser = this.accountsService.currentUser();

        if(currentUser){
          currentUser.imageUrl = photo.url;
          this.accountsService.setCurrentUser(currentUser as UserModel);
          this.membersService.member.update(mem => ({
            ...mem,
            imageUrl: photo.url
          }) as MemberModel)
        }
      })
  }

  deletePhoto(photoId: number){
    this.membersService.deletePhoto(photoId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(res => this.photos.update(photos => photos.filter(p => p.id !== photoId)))
  }
}
