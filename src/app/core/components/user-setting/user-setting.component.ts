import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService, DataService } from '../../services';

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {
  environment = environment;
  userdetail: any;
  message1: any;
  constructor(private authenticationService:AuthenticationService, private router: Router,private formBuilder: UntypedFormBuilder,private dataService: DataService) {
    this.authenticationService.currentUser.subscribe(
      res => {
        this.userdetail = res;
      }
    );
  }
  updateUserForm: UntypedFormGroup;
  changePasswordForm: UntypedFormGroup;
  loading: boolean = false;
  message: any;
  dataTemp: any;
  data: any;
  new_password:string = '';
  confirm_password:string = '';
  imageInput: File = null;
  @ViewChild('picture') picture: ElementRef;
  @ViewChild('image') image: ElementRef;
  ngOnInit(): void {
    this.initializeForm();
  }

  openImageInput() {
    this.picture.nativeElement.click();
  }


  imageSelected(input) {
    if (input.target.files && input.target.files[0]) {

    var reader = new FileReader();
    let image : any;

    reader.onload = function (e) {
      image =  e.target.result;
      document.getElementById('image').setAttribute("src",image);
    }

    this.imageInput = input.target.files[0];
    reader.readAsDataURL(input.target.files[0]); // convert to base64 string

  }
}

  removeImage() {
    document.getElementById('image').setAttribute("src", 'assets/images/avtar.jpg');
  }


  initializeForm() {


      this.userdetail = this.authenticationService.currentUserValue;
      if(this.userdetail != undefined) {
        this.updateUserForm = this.formBuilder.group({
          first_name: [this.userdetail.first_name],
          last_name: [this.userdetail.last_name],
          city: [this.userdetail.city],
          email: [this.userdetail.email],
          username: [this.userdetail.username],
          country: [this.userdetail.country],
          gender: [this.userdetail.gender],
          picture: [this.userdetail.picture]
        });

        this.changePasswordForm = this.formBuilder.group({
          confirm_password: [''],
          new_password: ['']
        });
      }

  }
  get f() {
    return this.updateUserForm.controls; }

    get f1() {
      return this.changePasswordForm.controls; }



  onClickChangePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.loading = true;
    let payload = {
      "confirm_password": this.f1.confirm_password.value,
      "new_password": this.f1.new_password.value,
    }

    this.dataService.changePassword(payload)
    .subscribe(
      data => {
      data.text = 'Password Changed.';
      data.cssClass = 'alert alert-success';
      this.message1 = data;
      },
      error => {
        if((error.status == 400 || error.status == 401) && error.error != "") {

          error.text = error.error;
          error.cssClass = 'alert alert-danger';
          this.message1 = error;
        }

      }

    );
  }

  onClickUpdateUser(){
    // stop here if form is invalid
    if (this.updateUserForm.invalid) {
      return;
    }
    this.loading = true;
    let payload = {
      "first_name": this.f.first_name.value,
      "last_name": this.f.last_name.value,
      "city": this.f.city.value,
      "gender": this.f.gender.value,
      "country": this.f.country.value,
      "picture": this.f.picture.value
    }



    if (this.imageInput != null) {
      this.dataService.uploadImage(this.imageInput)
        .subscribe(

          data => {

            payload.picture = data["response"];

            this.dataService.updateUser(payload)
              .subscribe(
                data => {
                  data.text = 'Information Updated.';
                  data.cssClass = 'alert alert-success';
                  this.message = data;
                },
                error => {
                  if ((error.status == 400 || error.status == 401) && error.error != "") {

                    error.text = 'Something went wrong.';
                    error.cssClass = 'alert alert-danger';
                    this.message = error;
                  }
                }
              )
          },

          error => {

          }
        );
    } else {

      this.dataService.updateUser(payload)
        .subscribe(
          data => {
            data.text = 'Information Updated.';
            data.cssClass = 'alert alert-success';
            this.message = data;
          },
          error => {
            if ((error.status == 400 || error.status == 401) && error.error != "") {

              error.text = 'Something went wrong.';
              error.cssClass = 'alert alert-danger';
              this.message = error;
            }
          }
        );


    }



  }

}
