import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast/toast-service';

@Component({
  selector: 'da-members',
  imports: [],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class Members {
  private toastService = inject(ToastService);
  
  show(){
    this.toastService.openSnackBar("test", "action")
  }
}
