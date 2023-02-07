import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthenticationService, DataService } from "../../../core/services";
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from '@abacritt/angularx-social-login';
import { Socialusers } from 'src/app/socialusers';
import { SocialloginService } from "../../../core/services/sociallogin.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  productForm: any;

  constructor(private dataService: DataService, private router: Router, private formBuilder: UntypedFormBuilder, private SocialloginService: SocialloginService, private authenticationService: AuthenticationService, public OAuth: SocialAuthService) { }
  registerForm: UntypedFormGroup;
  loading: boolean = false;
  message: any;
  dataTemp: any;

  ngOnInit(): void {
    this.initializeForm();
  }

  public socialSignUp(socialProvider: string) {
    let socialPlatformProvider;
    if (socialProvider === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialProvider === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.OAuth.signIn(socialPlatformProvider).then(socialusers => {
      this.Savesresponse(socialusers, socialProvider);

    });
  }

  Savesresponse(socialusers: Socialusers, socialProvider) {

    // this.url =  'http://localhost:64726/Api/Login/Savesresponse';
    // return this.http.post(this.url,responce);


    this.loading = true;
    this.authenticationService.socialregister(socialusers, socialProvider)
      .pipe(first())
      .subscribe(

        data => {
          this.loading = false;

          if (typeof data === 'object' && data.hasOwnProperty('token') && data.token) {
            // this.router.navigate(['/home']);
            data.text = 'Successfully Registered.';
            data.cssClass = 'alert alert-success';
            this.message = data;

            this.dataService.getCurrentUserDetails().subscribe();

            window.location.reload();

          } else {
            this.dataTemp = data;
            data = [];
            data.text = this.dataTemp;
            data.cssClass = 'alert alert-warning';

            this.message = data;
          }
        },
        error => {
          console.error(JSON.stringify(error));
          this.loading = false;
        }

        );
  }


  initializeForm() {
    this.registerForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      username: ['', Validators.required]
    });
  }
  get f() { return this.registerForm.controls; }

  //rgister the user
  onClickRegister(){
    // stop here if form is invalid
    if (this.registerForm.invalid) {

      Object.keys(this.registerForm.controls).forEach(key => {
        const controlErrors: ValidationErrors = this.registerForm.get(key).errors;
        if (controlErrors != null) {
          // Object.keys(controlErrors).forEach(keyError => {
          //   //console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
          // });
        }
      });


      return;
    }
    this.loading = true;
    let payload = {
      "fname": this.f.first_name.value,
      "lname": this.f.last_name.value,
      "email" : this.f.email.value,
      "password": this.f.password.value,
      "city": this.f.city.value,
      "country": this.f.country.value,
      "username": this.f.username.value,
    }
    this.authenticationService.register(payload)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;

          if (typeof data === 'object' && data.hasOwnProperty('token') && data.token) {
            // this.router.navigate(['/home']);
            data.text = 'Successfully Registered.';
            data.cssClass = 'alert alert-success';
            this.message = data;
            window.location.reload();
            localStorage.setItem('currentUser', JSON.stringify(data));

          } else {
            this.dataTemp = data;
            data = [];
            data.text = this.dataTemp;
            data.cssClass = 'alert alert-warning';

            this.message = data;
          }
        },
        error => {

          const data = {
            text: '',
            cssClass: ''
          };

          data.text = error.error;
          data.cssClass = 'alert alert-warning';

          this.message = data;

          this.loading = false;
        });
  }
}
