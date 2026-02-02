import { Component, computed, input, model, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'da-paginator',
  imports: [MatPaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
  pageNumber = model(1);
  pageSize = model(10);
  totalCount = input(0);
  totalPages = input(0);
  pageSizeOptions = input([5, 10, 20, 50]);

  pageChanged = output<{pageNumber: number, pageSize: number}>();

  lastItemIndex = computed(() => {
    return Math.min(this.pageNumber() * this.pageSize(), this.totalCount())
  })

  // onPageChange(newPage?: number, pageSize?: EventTarget | null){
  //   if(newPage) this.pageNumber.set(newPage);
  //   if(pageSize) {
  //     const size = Number((pageSize as HTMLSelectElement).value)
  //     this.pageSize.set(size);
  //   }

  //   this.pageChanged.emit({
  //     pageNumber: this.pageNumber(),
  //     pageSize: this.pageSize()
  //   })
  // }

  onPageChange ($event: PageEvent){
    this.pageNumber.set($event.pageIndex + 1);
    this.pageSize.set($event.pageSize);

    this.pageChanged.emit({
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    })
  }
}
