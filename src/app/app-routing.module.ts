import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BlogsComponent } from "./core/components/blogs/blogs.component";
import { BlogDetailComponent } from "./core/components/blog-detail/blog-detail.component";
import { AboutusComponent } from "./core/components/aboutus/aboutus.component";
import { TrendingComponent } from "./core/components/trending/trending.component";
import { WatchlistComponent } from "./core/components/watchlist/watchlist.component";
import { UserProfileComponent } from "./core/components/user-profile/user-profile.component";
import { StockProfileComponent } from "./core/components/stock-profile/stock-profile.component";
import { UserSettingComponent } from "./core/components/user-setting/user-setting.component";
import { HomeComponent } from "./core/components/home/home.component";
import { MessagesComponent } from './core/components/messages/messages.component';
import { ChatComponent } from './core/components/messages/chat/chat.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { EditProfileComponent } from './core/components/edit-profile/edit-profile.component';


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'blogs', component: BlogsComponent},
  { path: 'about-us', component: AboutusComponent},
  { path: 'watch-list', component: WatchlistComponent},
  { path: 'trending/:type', component: TrendingComponent},
  { path: 'user-profile/:username', component: UserProfileComponent},
  { path: 'stock-profile/:stock', component: StockProfileComponent},
  { path: 'blog-detail/:id', component: BlogDetailComponent},
  { path: 'edit-profile', component: EditProfileComponent},
  { path: 'user-setting', component: UserSettingComponent},
  { path: 'messages',
    // component: MessagesComponent,
    children: [
      {
        path: '',
        component: MessagesComponent
      },
      {
        path: ':chat_id/:receiver_id/:sender_id',
        component: ChatComponent
      },

    ]
  },
  { path: '**', component: PageNotFoundComponent }
  ,

  //{ path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
