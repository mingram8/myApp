import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "../../../environments/environment";
import { DataService } from './data.service';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { HomeComponent } from '../components/home/home.component';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserSubject: BehaviorSubject<any>;
  private isLoggedInCheckSubject: BehaviorSubject<any>;
  private triggerLoginSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  public isLoggedIn: Observable<any>;
  public triggerLogin: Observable<any>;

  constructor(
    private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser')));
    this.isLoggedInCheckSubject = new BehaviorSubject<any>(false);
    this.triggerLoginSubject = new BehaviorSubject<any>(false);
    this.currentUser = this.currentUserSubject.asObservable();
    this.isLoggedIn = this.isLoggedInCheckSubject.asObservable();
    this.triggerLogin = this.triggerLoginSubject.asObservable();
  }


  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  public get isLoggedInCheck() {
    return this.isLoggedInCheckSubject.value;
  }

  public get triggerLoginCheck() {
    return this.triggerLoginSubject.value;
  }

  public set setValueOfCurrentUserSubject(value: string) {
    this.currentUserSubject.next(value);
  }

  public set setValueOfIsLoggedInCheckSubject(value : boolean) {
    this.isLoggedInCheckSubject.next(value);
  }


  public set setValueOftriggerLoginSubject(value : boolean) {
    this.triggerLoginSubject.next(value);
  }


  public get getUserToken(){
    return this.currentUserSubject.value != null ? this.currentUserSubject.value.token : "" ;
  }


  login(username, password) {
    const headers = { 'Content-Type': 'application/json' }
    const body = {"email": username, "password": password};
    type bodyType = 'body';

  // upload file to the pre-signed url
  const httpOptions = {
    headers: new HttpHeaders({
    }),
    observe: <bodyType>'response'
  };



    return this.http.post<any>(`${environment.server}/login`, body, httpOptions)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        user = user.body;


        if (user.token != '') {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.isLoggedInCheckSubject.next(true);
          this.currentUserSubject.next(user);
      }

      return user;
      }));


  }
  getAllStockComments() {
    throw new Error('Method not implemented.');
  }


  sociallogin(response , type) {
    const headers = { 'Content-Type': 'application/json' }
    let body = {};

    if(type == 'google'){
      body = { "email": response.email, "id_token": response.id, "firstName": response.firstName, "lastName": response.lastName,
        "name": response.name, "photoUrl": response.photoUrl, "provider" : "Google"};
    }

    return this.http.post<any>(`${environment.server}/socialLogin`, body, {headers})
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }


  socialregister(response, type) {
    const headers = { 'Content-Type': 'application/json' }
    let body = {};
    if (type == 'google') {
      body = {
        "email": response.email, "id_token": response.id, "firstName": response.firstName, "lastName": response.lastName,
        "name": response.name, "photoUrl": response.photoUrl, "provider": "Google"
      };
    }
    return this.http.post<any>(`${environment.server}/socialLogin`, body, { headers })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }





  logout() {
    // remove user from local storage and set current user to null
    // this.authService.signOut();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  facebookLogin() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/loginFacebook`, header)
      .pipe(map(res => {
        return res;
      }));
  }
  googleLogin() {
    let header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }

    return this.http.get<any>(`${environment.server}/loginGoogle`, header)
      .pipe(map(res => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if(res.status)
        {
          localStorage.setItem('currentUser', JSON.stringify(res));
          this.currentUserSubject.next(res);
        }
        return res;
      }));
  }

  register(payload)
  {
    const headers = { 'Content-Type': 'application/json' }
    const body = payload;
    return this.http.post<any>(`${environment.server}/registerUser`, body, {headers})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }

}
