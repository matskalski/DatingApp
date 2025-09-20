import { SnackbarIcons } from "../enums/snackbar-icons-enum";

export interface SnackbarData {
    message: string,
    icon: SnackbarIcons
    duration: number
}