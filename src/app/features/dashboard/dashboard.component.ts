import { } from '@angular/material'
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// Import components
import { ConfirmationDialogArgs } from '../../core/components/confirmation-dialog/confirmation-dialog.component';

// Import Services
import { ConfirmationDialogService } from '../../core/services/confirmation-dialog.service';
import { NotificationService } from '../../core/services/notification.service';
import { ThemeService, ThemeType, ThemeChangedEventArgs } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDarkThemeActive: boolean = false;

  constructor(private _confirmationDialogService: ConfirmationDialogService, private _notificationService: NotificationService, private _themeService: ThemeService) {
  }

  /**
   * Componenet initialization after data bound properties are checked.
   *
   * @memberof DashboardComponent
   */
  ngOnInit(): void {
    this._themeService.onThemeChanged.subscribe(x => this.onThemeChanged(x));    
    this._themeService.initialize();
  }

  /**
   * Toggles the dark theme on/off based on the supplied checkbox checked state.
   *
   * @param {boolean} checked If true, darak theme is selected, if false, light theme is selected.
   * @memberof DashboardComponent
   */
  toggleTheme(checked: boolean) {
    this._themeService.setTheme(checked ? ThemeType.DarkTheme : ThemeType.LightTheme);
  }

  /**
   * Event handler for the theme changed event. 
   *
   * @param {ThemeChangedEventArgs} args The values of the new, current theme.
   * @memberof DashboardComponent
   */
  onThemeChanged(args: ThemeChangedEventArgs) {
    this.isDarkThemeActive = args.theme === ThemeType.DarkTheme;

    // This article provided the final, missing elements (using CSS class to wrap the themes in styles.scss)
    // https://blog.knoldus.com/understanding-dynamic-theming-in-angular-material/
    // TODO: optimize.
    if (this.isDarkThemeActive) {
      document.body.classList.add(ThemeType.DarkTheme);
      document.body.classList.remove(ThemeType.LightTheme);
    } else {
      document.body.classList.add(ThemeType.LightTheme);
      document.body.classList.remove(ThemeType.DarkTheme);
    }
  }

  testConfirmationDialog() {
    let args: ConfirmationDialogArgs = new ConfirmationDialogArgs("Test Confirmation", "Does this test confirmation dialog work?");

    this._notificationService.close();
    
    this._confirmationDialogService.showDialog(args).subscribe(isConfirmed => {
      if (isConfirmed) {
        this._notificationService.success("Confirmed!!");
      } else {
        this._notificationService.warn("NOT Confirmed!!");
      }
    });
  }

  showSuccessSnackbar(): void {
    this._notificationService.success("This is a success snackbar!");
  }
  showInformationSnackbar(): void {
    this._notificationService.information("This is a information snackbar!");
  }
  showWarningSnackbar(): void {
    this._notificationService.warn("This is a warning snackbar!");
  }
  showErrorSnackbar(): void {
    this._notificationService.error("This is a error snackbar!");
  }
  showHelpSnackbar(): void {
    this._notificationService.help("This is a help snackbar!");
  }
}
