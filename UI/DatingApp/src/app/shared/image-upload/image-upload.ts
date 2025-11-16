import { Component, input, output, signal } from '@angular/core';
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'da-image-upload',
  imports: [
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
  uploadFile = output<File>();
  loading = input<boolean>(false);

  protected imageSrc = signal<string | ArrayBuffer | null | undefined> (null);
  protected isDragging = false;

  private fileToUpload: File | null = null

  onDragOver(event: DragEvent ){
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
  }

  onDragLeave(event: DragEvent ){
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = false;
  }

  onDrop(event: DragEvent ){
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = false;

    if(event.dataTransfer?.files.length){
      const file = event.dataTransfer.files[0];
      this.previewImage(file);;
      this.fileToUpload = file;
    }
  };

  onUploadFile(){
    if(this.fileToUpload){
      this.uploadFile.emit(this.fileToUpload);
    }
  }

  onCancel(){
    this.fileToUpload = null;
    this.imageSrc.set(null);
  }

  private previewImage(file: File){
    const reader = new FileReader();
    reader.onload = (e) => this.imageSrc.set(e.target?.result);
    reader.readAsDataURL(file);
  }

}
