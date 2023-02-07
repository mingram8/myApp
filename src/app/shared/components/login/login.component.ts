import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService, DataService } from "../../../core/services";
import { first, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthService } from "@abacritt/angularx-social-login";
import { SocialloginService } from "../../../core/services/sociallogin.service";
import { Socialusers } from '../../../socialusers';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const TAG = "LOGIN : ";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css', './indigo-pink.css']
})
export class LoginComponent implements OnInit {
  userdetail: any;
  constructor(private http: HttpClient,private router: Router,private formBuilder: UntypedFormBuilder,private authenticationService: AuthenticationService ,private SocialloginService: SocialloginService, public OAuth: SocialAuthService,
    private dataService:DataService) {
  }
  loginForm: UntypedFormGroup;
  loading: boolean = false;
  dataTemp: any;
  message: any;
  socialusers=new Socialusers();
  response;
  ngOnInit(): void {
    this.initializeForm();
  }

  public socialSignIn(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(socialPlatformProvider).then(socialusers => {
      this.Savesresponse(socialusers , socialProvider);

    });
  }




  Savesresponse(socialusers: Socialusers , socialProvider) {

    this.SocialloginService.Savesresponse(socialusers , socialProvider);

    this.loading = true;
    this.authenticationService.sociallogin(socialusers, socialProvider)
      .pipe(first())
      .subscribe(

        data => {
          this.loading = false;

          if (typeof data === 'object' && data.hasOwnProperty('token') && data.token) {
            data.text = 'Successfully logged in.';
            data.cssClass = 'alert alert-success';
            this.message = data;
            setTimeout(() => {
              window.location.reload();
              // this.router.navigate(['/home']);
            }, 2000);

          } else {
            this.dataTemp = data;
            data = [];
            data.text = this.dataTemp;
            data.cssClass = 'alert alert-warning';

            this.message = data;
          }
        },
        error => {
          this.loading = false;
          this.loading = false;
          this.dataTemp = [];
          this.dataTemp.text = 'User is not registered with ' + socialProvider;
          this.dataTemp.cssClass = 'alert alert-warning';

          this.message = this.dataTemp;
        }
      );
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required]
    });
  }
  get f() { return this.loginForm.controls; }

  onClickLogin() {
    // stop here if form is invalid

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          if(data.token){
            let obj = {
              text: '',
              cssClass: ''
            };
            obj.text = 'Successfully logged in.';
            obj.cssClass = 'alert alert-success';

            this.message = obj;

            console.log(data)
            setTimeout(() => {

              localStorage.setItem('currentUser', JSON.stringify(data));
              this.authenticationService.setValueOfIsLoggedInCheckSubject = true;
              this.dataService.getCurrentUserDetails().subscribe();
              window.location.reload();

            }, 100);


            // this.router.navigate(['/blog']);
            // this.router.navigate(['/home']);

        }else{
          data.text = 'Access denied.';
          data.cssClass = 'alert alert-danger';

            this.message = data;
        }
        },
        error => {

          if((error.status != 200) && error.error != "") {

              error.text = error.error;
              error.cssClass = 'alert alert-danger';
          }

          this.message = error;
          this.loading = false;

        });
  }

  /**
   * facebook login
   */
  loginWithfacebook()
  {
    //this.loading = true;
    this.authenticationService.facebookLogin()
      .subscribe(res => {
      });
  }
  /**
   * google login
   */
  loginWithGoogle(){
    this.authenticationService.googleLogin()
    .subscribe(res => {
    });
  }


}
