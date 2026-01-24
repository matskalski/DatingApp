import { FormControl, FormGroupDirective, NgForm } from "@angular/forms"
import { ErrorStateMatcher } from "@angular/material/core"

/*
konieczne jest zastosowanie ErrorStateMatcher'a ponieważ standardowo mat-error jest wyświetlany
jeżeli kontrolka ma stan invalid. Chcemy w tym przypadku wyświetlić mat error przypisany do kontrolki
confirmPassword, ale nie w przypadku walidacji tylko tej kontrolki ale przy błędzie walidacji formularza
(weryfikowany przez passwordConfirmValidator)
matcher przejmuje sterowanie logiką walidacji, więc musi uwzgledniać wszystkie przypadki kiedy uznajemy
że kontrolka jest w stanie unvalid
*/
export class ConfirmPasswordErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {


        //czy formularz ma błąd validacji mówiący że hasła się różnią
        const hasFormpPsswordsAreNotTheSameValidationError = form && form?.form.hasError('passwordsAreNotTheSame') ? true : false

        //czy kontrolka była "dotknięta"
        const isControlDirtyOrTouched = control && (control.dirty || control.touched) ? true : false

        //czy formularz był submitowany
        const isSubmitted = form && form.submitted ? true : false;

        //weryfikacja czy kontrolka posiada błąd związany z wymagalnością wartości
        if(control?.hasError('required') && (isControlDirtyOrTouched || isSubmitted)){
            return true;
        }

        //weryfikacja czy formularz posiada błąd zwiazany z niezgodnością haseł
        /*
        formularz ma niewłaściwy stan jeżeli:
        - formularz posiada błąd walidacji o niezgodności haseł i kontolka była "dotknięta"
        - formularz posiada błąd walidacji o niezgodności haseł, kontrolka nie była dotknięta, ale użytkownik próbuje zasubmitować formularz
        */
        return hasFormpPsswordsAreNotTheSameValidationError && (isControlDirtyOrTouched || isSubmitted)
    }
}
