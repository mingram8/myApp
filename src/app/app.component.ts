import { Component, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { AuthenticationService } from './core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges  {
  title = 'stock-tinder';
  storageData = JSON.parse(localStorage.getItem('currentUser'));
  userdetail = this.storageData;
  constructor(private authenticationService : AuthenticationService) {

    if (this.userdetail) {
      // this.userdetail.username = '';
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("HI");
  }

}
