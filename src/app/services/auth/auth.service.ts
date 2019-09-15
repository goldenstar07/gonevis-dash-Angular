import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthResponse } from '@app/interfaces/auth-response';
import { AuthToken } from '@app/interfaces/auth-token';
import { UserAuth } from '@app/interfaces/user-auth';
import { ApiService } from '@app/services/api/api.service';
import { BlogService } from '@app/services/blog/blog.service';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /**
   * Sign out redirect
   */
  private static readonly signOutRedirect: string[] = ['user', 'sign-in'];

  /**
   * Authenticated user (subject)
   */
  private static userSubject: BehaviorSubject<UserAuth> = new BehaviorSubject<UserAuth>(null);

  /**
   * Authenticated user (observable)
   */
  static user: Observable<UserAuth> = AuthService.userSubject.asObservable();

  constructor(private http: HttpClient,
              private router: Router,
              private cookieService: CookieService,
              private apiService: ApiService) {
    /**
     * Update user (subject) and blogs (subject) if user is authenticated
     * @see isAuth
     */
    if (this.isAuth) {
      const user: UserAuth = JSON.parse(localStorage.getItem('user'));
      AuthService.userSubject.next(user);
      BlogService.set(user.sites.reverse());
    }
  }

  /**
   * Parse JWT token
   *
   * @param token JWT.
   *
   * @return Parsed JWT token.
   */
  private static parseJwt(token: string): AuthToken | null {
    const base64Url = token.split('.')[1];
    if (typeof base64Url === 'undefined') {
      return null;
    }
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(atob(base64));
  }

  /**
   * Set/update authenticated user data
   *
   * @param userData UserSettings data
   */
  static setAuthenticatedUser(userData: UserAuth): void {
    localStorage.setItem('user', JSON.stringify(userData));
    AuthService.userSubject.next(userData);
  }

  /**
   * @return Is user authenticated or not
   */
  get isAuth(): boolean {
    return this.cookieService.check('token');
  }

  /**
   * Save/update token to localStorage
   *
   * @param token Authentication token
   */
  setToken(token: string): void {
    const parsedJwt: AuthToken = AuthService.parseJwt(token);
    if (parsedJwt) {
      this.cookieService.set('token', token, new Date(parsedJwt.exp * 1000), '/');
    }
  }

  /**
   * @returns Stored token from localStorage
   */
  get getToken(): string | null {
    return this.cookieService.get('token');
  }

  /**
   * Un-authenticate user by cleaning localStorage and cookies
   */
  signOut(): void {
    this.cookieService.deleteAll('/');
    localStorage.clear();
    AuthService.userSubject.next(null);
    this.router.navigate(AuthService.signOutRedirect);
  }

  /**
   * Sign user in
   *
   * @param username User username
   * @param password User password
   *
   * @return String observable which can be subscribed to.
   */
  signIn(username: string, password: string): Observable<string> {
    return this.http.post<AuthResponse>(
      `${this.apiService.base.v1}account/login/`, { username, password },
    ).pipe(
      map((data: AuthResponse): string => {
        // Store token into cookies
        this.setToken(data.token);
        // Store user into local storage
        localStorage.setItem('user', JSON.stringify(data.user));
        // Update user subject data
        AuthService.userSubject.next(data.user);
        // Return raw user data
        return data.user.username;
      }),
    );
  }

  /**
   * Sign user up
   *
   * @param email User email
   * @param username User username
   * @param password user password
   */
  signUp(email: string, username: string, password: string): Observable<void> {
    return this.http.post(this.apiService.base.v1 + 'account/register-account-only/', {
      email, username, password,
    }).pipe(
      map((): void => {
        this.signIn(username, password).subscribe();
      }),
    );
  }
}
