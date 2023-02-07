import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, DataService } from '../../services';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  user: any;
  blogs: any;

  constructor(private el: ElementRef, private authenticationService: AuthenticationService, private router: Router, private dataService: DataService) {
    this.user = localStorage.getItem('currentUser');
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.authenticationService.setValueOfIsLoggedInCheckSubject = true;
    }
    this.getStock();
  }
  getStock() {
    this.dataService.getBlogs()
      .subscribe(res => {
        res = res.data;
        this.blogs = res;
        this.blogs.forEach(element => {
          var ele_text = element.text;
          element.text = element.text.substring(0,150);
          element.text = (element.text.length < ele_text) ? element.text + "..." : element.text;
        });
      });
  }


}
