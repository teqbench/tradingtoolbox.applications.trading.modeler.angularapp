import { } from '@angular/material'
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ThemeService, ThemeNameOptions, ThemeChangedEventArgs } from '../../core/services/theme.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isDarkThemeActive: boolean = false;

  constructor(private _themeService: ThemeService) {
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
    this._themeService.setTheme(checked ? ThemeNameOptions.DarkTheme : ThemeNameOptions.LightTheme);
  }

  /**
   * Event handler for the theme changed event. 
   *
   * @param {ThemeChangedEventArgs} args The values of the new, current theme.
   * @memberof DashboardComponent
   */
  onThemeChanged(args: ThemeChangedEventArgs) {
    this.isDarkThemeActive = args.name === ThemeNameOptions.DarkTheme;

    // This article provided the final, missing elements (using CSS class to wrap the themes in styles.scss)
    // https://blog.knoldus.com/understanding-dynamic-theming-in-angular-material/
    // TODO: optimize.
    if (this.isDarkThemeActive) {
      document.body.classList.add(ThemeNameOptions.DarkTheme);
      document.body.classList.remove(ThemeNameOptions.LightTheme);
    } else {
      document.body.classList.add(ThemeNameOptions.LightTheme);
      document.body.classList.remove(ThemeNameOptions.DarkTheme);
    }
  }
}