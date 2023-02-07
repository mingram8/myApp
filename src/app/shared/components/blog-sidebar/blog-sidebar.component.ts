import { Component, OnInit } from '@angular/core';
import { AuthenticationService, DataService } from '../../../core/services'

@Component({
  selector: 'app-blog-sidebar',
  templateUrl: './blog-sidebar.component.html',
  styleUrls: ['./blog-sidebar.component.css']
})
export class BlogSidebarComponent implements OnInit {
  latestBlog : any = [];
  constructor(private dataService: DataService, private authenticationService:AuthenticationService) { }

  ngOnInit(): void {
    this.getLatestBlogs();
  }
  getLatestBlogs()
  {
    this.dataService.getLatestBlogs(this.authenticationService.currentUserValue.id).subscribe(res => {
      this.latestBlog = res;
    });
  }

}
