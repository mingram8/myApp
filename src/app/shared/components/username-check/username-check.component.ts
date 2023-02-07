import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService, DataService } from 'src/app/core/services';

@Component({
  selector: 'app-username-check',
  templateUrl: './username-check.component.html',
  styleUrls: ['./username-check.component.css']
})
export class UsernameCheckComponent implements OnInit {

  constructor(private formBuilder: UntypedFormBuilder, private dataService: DataService,
    private authenticationService : AuthenticationService) { }
  storageData = this.authenticationService.currentUserValue;
  userdetail = this.storageData;
  usernameForm : UntypedFormGroup;
  loading: boolean = false;
  message: any;

  ngOnInit(): void {
    this.initializeForm();
    let element: HTMLElement = document.getElementById('openUsernameModalButton') as HTMLElement;
    element.click();
  }

  initializeForm() {
    this.usernameForm = this.formBuilder.group({
      // username: ['', [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$')]]
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z]{1,10}$')]]
    });
  }

  get f() { return this.usernameForm.controls; }

  onClickLogin() {
    // stop here if form is invalid

    if (this.usernameForm.invalid) {
      return;
    }

    this.loading = true;
    let payload = {
      'username' : this.f.username.value
    };

    this.dataService.updateUser(payload)
      .pipe()
      .subscribe(
        data => {
          this.loading = false;
          if (data.token) {

            data.text = 'Username updated successfully.';
            data.cssClass = 'alert alert-success';

            this.message = data;

            setTimeout(() => {
              window.location.reload();
            }, 2000);


            // this.router.navigate(['/blog']);
            // this.router.navigate(['/home']);

          } else {
            data.text = 'Something went wrong.';
            data.cssClass = 'alert alert-danger';

            this.message = data;
          }
        },
        error => {

          if ((error.status != 200) && error.error != "") {

            error.text = error.error.error;
            error.cssClass = 'alert alert-danger';
          }

          this.message = error;
          this.loading = false;

        });
  }

}
