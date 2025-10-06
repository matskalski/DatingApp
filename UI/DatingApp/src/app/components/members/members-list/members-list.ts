import { ChangeDetectorRef, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MemberModel } from '../../../models/member-model';
import { MembersService } from '../../../services/members/members-service';
import { AccountsService } from '../../../services/accounts/accounts-service';
import { LocalStorageService } from '../../../services/localStorage/local-storage-service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MemberDetails } from '../members-tails/member-details/member-details';
import * as XLSX from "xlsx";
import { MemberDialog } from './member-dialog/member-dialog';

@Component({
  selector: 'da-members-list',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './members-list.html',
  styleUrl: './members-list.css'
})
export class MembersList {
  protected dataSource: MatTableDataSource<MemberModel> = new MatTableDataSource<MemberModel>([]);
  @ViewChild(MatPaginator)
  protected paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort)
  protected sort: MatSort = new MatSort();

  protected displayedColumns: string[] = ['image', 'displayName', 'dateOfBirth', 'gender', 'city', 'country'];
  protected pageSize!: number;

  private membersService = inject(MembersService);
  private destroyRef = inject(DestroyRef);
  private accountsService = inject(AccountsService);
  private localStorage = inject(LocalStorageService)
  private readonly dialog = inject(MatDialog);

  constructor() {
    const ps = this.localStorage.getItem('page-size')
    ps !== null ? this.pageSize = +ps : 5

    this.membersService.getMembers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        //nie wyświetlaj na liście użytkownika który aktualnie jest zalogowany
        map(res => res.filter(i => i.id !== this.accountsService.currentUser()?.id))
      )
      .subscribe(res => {
        this.dataSource = new MatTableDataSource(res);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        //ustawienie by przeszukiwał tylko kolumny które są wyświetlane, zamiast wszystkich w modelu
        //i pominął kolumnę ze zdjęciem
        this.dataSource.filterPredicate = function (data: MemberModel, filter: string): boolean {
          //lista kolumn do przeszukania
          const columnsToFilter: string[] = ['displayName', 'dateOfBirth', 'gender', 'city', 'country']

          //ustawia wartośc początkową
          let result = false;

          //pętla for ponieważ foreach nie ma możliwości użycia continue
          //doatkowo przy if(result) foreach zwraca błąd że nie wszystkie
          //ścieżki w kodzie zwracają wynik
          for (let col of columnsToFilter) {
            //pobranie wartości z kolumny
            //as kayof potrzebne by usunąć błąd kompilacji
            let colValue = data[col as keyof MemberModel]

            //jeżeli nie ma kolumny z zadanym kluczem
            //lub warość jest undefined wówczas kontunuujemy iteracje
            if (!colValue) {
              continue;
            }

            //aktualizacja rezultatu o infromację czy wartość
            //w sprawdzanej kolumnue zawiera szukaną frazę
            result = result || colValue.toLowerCase().includes(filter);

            //jeżeli wartość result zmieniła się na true
            //czyli jeżeli jakakolwiek kolumna zawiera szukaną frazę
            //można zakończyć przeszukiwanie i zwrócić true
            if (result) {
              return true
            }
          }

          //jeżeli żadna kolumna nie zawiera przeszukiwanej frazy
          //należy zwrócić false
          return false;
        }
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageSizeChanged(event: PageEvent) {
    this.localStorage.setItem('page-size', event.pageSize)
  }

  exportTableToExcel() {
    const sheetName = 'testsheet';
    const fileName = 'testfile'

    let targetTableElm = document.getElementById('data-table');
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
      sheet: sheetName
    });
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  showDetails(id: string) {
    console.log('click')

    const member = this.dataSource.data.find(m => m.id === id)!
    console.log(member)

    const dialogRef = this.dialog.open(MemberDialog, {
      data: member
    });
  }
}
