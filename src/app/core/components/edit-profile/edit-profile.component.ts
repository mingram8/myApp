import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthenticationService, DataService } from '../../services';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  environment = environment;
  userdetail: any;
  message1: any;
  isRemoveImage: boolean;
  constructor(private router: Router,private formBuilder: UntypedFormBuilder,
    private dataService: DataService, private authenticationService: AuthenticationService) {
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
    this.isRemoveImage = true;
  }


  initializeForm() {



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
      }






  }
  get f() {
    return this.updateUserForm.controls;
  }

  get f1() {
    return this.changePasswordForm.controls;
  }



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

    console.log(this.imageInput)

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

                  this.dataService.getCurrentUserDetails().subscribe();
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
      if (this.isRemoveImage) {
        payload.picture = '';
      }
      console.log(payload)
      this.dataService.updateUser(payload)
        .subscribe(
          data => {
            data.text = 'Information Updated.';
            data.cssClass = 'alert alert-success';
            this.message = data;

            this.dataService.getCurrentUserDetails().subscribe();
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
