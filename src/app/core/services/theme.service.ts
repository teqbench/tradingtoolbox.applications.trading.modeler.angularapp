import {Injectable, EventEmitter, Output} from '@angular/core';

export class ThemeChangedEventArgs {
  public theme: ThemeType;

   constructor(n?: ThemeType) {
    switch(n) {
      case ThemeType.DarkTheme: {
        this.theme = ThemeType.DarkTheme;
        
        break;
      }
      case ThemeType.DarkTheme: {
        this.theme = ThemeType.LightTheme;

        break;
      }
      default:
      {
        this.theme = DEFAULT_THEME;
        
        break;
      }
    }
  }
}

// These theme names need to correspond to the CSS classes found in styles.scss which are used to apply the theme at runtime.
export enum ThemeType {
  DarkTheme = "dark-theme",
  LightTheme = "light-theme"
}

const DEFAULT_THEME: ThemeType = ThemeType.LightTheme;

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
  private _activeTheme: ThemeType = DEFAULT_THEME;

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
   * @param {ThemeType} theme Name of the new theme.
   * @memberof ThemeService
   */
  setTheme(theme: ThemeType): void {
    this._activeTheme = theme;

    // TODO: store theme as part of user profile in DB so when sign in UI is set to that theme for user.
    this.themeChangedEventArgs.theme = theme;

    this.onThemeChanged.emit(this.themeChangedEventArgs);
  }

   /**
   * Method to get the active theme.
   */
  getActiveTheme(): ThemeType {
    return this._activeTheme;
  }
}
