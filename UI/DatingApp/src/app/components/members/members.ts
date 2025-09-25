import { AccountsService } from './../../services/accounts/accounts-service';
import { ChangeDetectorRef, Component, DestroyRef, inject, ViewChild, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MembersService } from '../../services/members/members-service';
import { MemberModel } from '../../models/member-model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LocalStorageService } from '../../services/localStorage/local-storage-service';


@Component({
  selector: 'da-members',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule, MatIconModule
  ],
  templateUrl: './members.html',
  styleUrl: './members.css'
})
export class Members {
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
  private localStorege = inject(LocalStorageService)

  constructor() {
    const ps = this.localStorege.getItem('page-size')
    ps !== null ? this.pageSize = +ps : 5

    this.membersService.getMembers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        //nie wyświetlaj na liście użytkownika który aktualnie jest zalogowany
        map(res => res.filter(i => i.id !==  this.accountsService.currentUser()?.id))
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
    console.log(filterValue);
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onPageSizeChanged(event: PageEvent){
    console.log(event.pageSize)
    this.localStorege.setItem('page-size', event.pageSize)
  }

  test(){
    console.log("zmiana")
  }
}
