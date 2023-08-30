import {Injectable, EventEmitter, Output} from '@angular/core';

export class ThemeChangedEventArgs {
  public name: ThemeNameOptions;

   constructor(n?: ThemeNameOptions) {
    switch(n) {
      case ThemeNameOptions.DarkTheme: {
        this.name = ThemeNameOptions.DarkTheme;
        
        break;
      }
      case ThemeNameOptions.DarkTheme: {
        this.name = ThemeNameOptions.LightTheme;

        break;
      }
      default:
      {
        this.name = DEFAULT_THEME;
        
        break;
      }
    }
  }
}

// These theme names need to correspond to the CSS classes found in styles.scss which are used to apply the theme at runtime.
export enum ThemeNameOptions {
  DarkTheme = "dark-theme",
  LightTheme = "light-theme"
}

const DEFAULT_THEME: ThemeNameOptions = ThemeNameOptions.DarkTheme;

/**
 * Theme service to managed the activation of a theme as the current theme.
 *
 * @export
 * @class ThemeService
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  @Output() onThemeChanged: EventEmitter<ThemeChangedEventArgs> = new EventEmitter<ThemeChangedEventArgs>(true);
  themeChangedEventArgs = new ThemeChangedEventArgs();

  /**
   * Initialized the startup theme to the default theme.
   *
   * @memberof ThemeService
   */
  initialize(): void {
    this.setTheme(DEFAULT_THEME);
  }

  /**
   * Method to set the current theme.
   *
   * @param {ThemeNameOptions} themeName Name of the new theme.
   * @memberof ThemeService
   */
  setTheme(themeName: ThemeNameOptions): void {
    // TODO: store theme as part of user profile in DB so when sign in UI is set to that theme for user.
    this.themeChangedEventArgs.name = themeName;

    this.onThemeChanged.emit(this.themeChangedEventArgs);
  }
}
