import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocialloginService {
url;
loading: boolean = false;
constructor(private http: HttpClient , private authenticationService: AuthenticationService) { }
Savesresponse(response , socialProvider)
  {
    // this.url =  'http://localhost:64726/Api/Login/Savesresponse';
    // return this.http.post(this.url,responce);

    this.loading = true;
    this.authenticationService.sociallogin(response , socialProvider)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data.token) {
            // this.router.navigate(['/blog']);
            // this.router.navigate(['/home']);
            window.location.reload();
          }
        },
        error => {
          console.error(JSON.stringify(error));
          this.loading = false;
        });
  }



  Savesresponseregister(response, socialProvider) {
    // this.url =  'http://localhost:64726/Api/Login/Savesresponse';
    // return this.http.post(this.url,responce);

    this.loading = true;
    this.authenticationService.socialregister(response, socialProvider)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if (data.token) {
            // this.router.navigate(['/blog']);
            // this.router.navigate(['/home']);
            window.location.reload();
          }
        },
        error => {
          console.error(JSON.stringify(error));
          this.loading = false;
        });
  }
}
