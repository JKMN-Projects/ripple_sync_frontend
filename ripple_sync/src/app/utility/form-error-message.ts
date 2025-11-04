import { AbstractControl } from "@angular/forms";

export function formErrorMessage(control: AbstractControl | null | undefined): string {
  if (control == undefined || control == null) {
    return "";
  }

  switch (true) {
    case control.hasError('minlength'):
      return "Minimum of " + control.errors?.['minlength'].requiredLength + "characters";
    case control.hasError('maxlength'):
      return "Maximum of " + control.errors?.['maxlength'].requiredLength + "characters";
    case control.hasError('email'):
      return "Must be a valid email address";
    case control.hasError('passwordMismatch'):
      return "Passwords do not match";
    case control.hasError('required'):
      return "Must have a value";
    default:
      return "";
  }
}
