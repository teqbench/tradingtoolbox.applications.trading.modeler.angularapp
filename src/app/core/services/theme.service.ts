import {Injectable, EventEmitter, Output} from '@angular/core';

export class ThemeChangedEventArgs {
  public name: ThemeName;

   constructor(n?: ThemeName) {
    switch(n) {
      case ThemeName.DarkTheme: {
        this.name = ThemeName.DarkTheme;
        
        break;
      }
      case ThemeName.DarkTheme: {
        this.name = ThemeName.LightTheme;

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
export enum ThemeName {
  DarkTheme = "dark-theme",
  LightTheme = "light-theme"
}

const DEFAULT_THEME: ThemeName = ThemeName.DarkTheme;

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
   * @param {ThemeName} themeName Name of the new theme.
   * @memberof ThemeService
   */
  setTheme(themeName: ThemeName): void {
    // TODO: store theme as part of user profile in DB so when sign in UI is set to that theme for user.
    this.themeChangedEventArgs.name = themeName;

    this.onThemeChanged.emit(this.themeChangedEventArgs);
  }
}
