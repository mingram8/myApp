import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AngularFireModule } from '@angular/fire';
import { FirestoreModule, } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/components/home/home.component';
import { TrendingComponent } from './core/components/trending/trending.component';
import { WatchlistComponent } from './core/components/watchlist/watchlist.component';
import { AboutusComponent } from './core/components/aboutus/aboutus.component';
import { BlogsComponent } from './core/components/blogs/blogs.component';
import { BlogSidebarComponent } from './shared/components/blog-sidebar/blog-sidebar.component';
import { SidebarMarketNewsComponent } from './shared/components/sidebar-market-news/sidebar-market-news.component';
import { SidebarTrendingStocksComponent } from './shared/components/sidebar-trending-stocks/sidebar-trending-stocks.component';
import { LoginComponent } from './shared/components/login/login.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { MarketStockComponent } from './shared/components/market-stock/market-stock.component';
import { UserProfileComponent } from './core/components/user-profile/user-profile.component';
import { EditProfileComponent } from './core/components/edit-profile/edit-profile.component';
import { StockProfileComponent } from './core/components/stock-profile/stock-profile.component';
import { UserSettingComponent } from './core/components/user-setting/user-setting.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login'
import { GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';
// import { NgApexchartsModule } from 'ng-apexcharts';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { CommentsComponent } from './shared/components/comments/comments.component';
import { BlogDetailComponent } from './core/components/blog-detail/blog-detail.component';
import { AppHttpInterceptor } from "./app-http.interceptor";
import { StringLengthExceedPipePipe } from './string-length-exceed-pipe.pipe';
import { SafeHtmlPipe } from './safe-html.pipe';
import { MessagesComponent } from './core/components/messages/messages.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
import { ChatComponent } from './core/components/messages/chat/chat.component';
import { UsernameCheckComponent } from './shared/components/username-check/username-check.component';

@NgModule({
  // exports: [HeaderComponent,MarketStockComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
    AppComponent,
    HomeComponent,
    TrendingComponent,
    WatchlistComponent,
    AboutusComponent,
    BlogsComponent,
    BlogSidebarComponent,
    SidebarMarketNewsComponent,
    SidebarTrendingStocksComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    MarketStockComponent,
    UserProfileComponent,
    StockProfileComponent,
    UserSettingComponent,
    CommentsComponent,
    BlogDetailComponent,
    StringLengthExceedPipePipe,
    SafeHtmlPipe,
    MessagesComponent,
    PageNotFoundComponent,
    ChatComponent,
    UsernameCheckComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    //Network
    HttpClientModule,
    // Form
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    SocialLoginModule,
    // NgApexchartsModule,
    AutocompleteLibModule,
    // AngularFireModule.initializeApp(environment.firebase),
    FirestoreModule, // for firestore
  ],
  providers: [
    DatePipe,
    { provide: ErrorHandler, useClass: ErrorHandler },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AppHttpInterceptor,
        multi: true
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '460359060280-ctetlcrv9nb10thfct5i38ves5ru5crl.apps.googleusercontent.com',
              // '282097674874-n93av19aqertqvf9td2hq8511k2kufqv.apps.googleusercontent.com',
              // '278913690466-dd1g2c5j891skopk8iq58c5mlbet5nl2.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('830330024331208')
            // provider: new FacebookLoginProvider('256113913077710')
            // provider: new FacebookLoginProvider('3765424200184912')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
