import { AbstractControl, ValidatorFn, Validators } from "@angular/forms";

export function passwordConfirmValidator() : ValidatorFn {
    return(form: AbstractControl): Validators | null => {
        const password = form.get("password")?.value;
        const confirmPassword = form.get("confirmPassword")?.value;

        if(!password && !confirmPassword){
            return null;
        }

        return password !== confirmPassword ? { passwordsAreNotTheSame: true } : null
    }
}
