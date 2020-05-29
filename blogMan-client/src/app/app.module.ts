import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule} from '@angular/http';
import { AlertModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

import { ProfileService } from './services/profile.service';
import { DataService } from './data.service'; 
import { UserDataService }from './shared/user-data.service';
import { SearchService } from './services/search.service';
import { TokenInterceptor } from './interceptors/token-interceptor';
import { AdminService } from './services/admin.service';
import { SpaceService } from './services/space.service';

import { AppComponent } from './app.component';
import { BlogsComponent } from './blogs/blogs.component';
import { UsersListComponent } from './users-list/users-list.component';
import { PostsComponent } from './posts/posts.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NewPostComponent } from './new-post/new-post.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { InitProfileComponent } from './init-profile/init-profile.component';
import { GalaxyComponent } from './galaxy/galaxy.component';
import { UserSpacesComponent } from './user-spaces/user-spaces.component';
import { SpaceListComponent } from './space-list/space-list.component';
import { SpaceComponent } from './space/space.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
// Admin Operations
import { AdminComponent } from './admin/admin.component';
import { PostOpsComponent } from './admin/post-ops/post-ops.component';
import { ReviewOpsComponent } from './admin/review-ops/review-ops.component';
import { UserOpsComponent } from './admin/user-ops/user-ops.component';
import { AnimeOpsComponent } from './admin/anime-ops/anime-ops.component';
import { ReportOpsComponent } from './admin/report-ops/report-ops.component';

const routes:Routes = [
  {
  path: '',
  redirectTo: '/galaxy',
  pathMatch: 'full'
},
  {path: 'galaxy', component: GalaxyComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify-account/:token', component: VerifyAccountComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password/:token', component: ResetPasswordComponent},
  {path: 'login', component: LoginComponent},
  {path: 'user/:id/initProfile', component: InitProfileComponent},
  {path: 'user/:id/profile', component: ProfileComponent /*,runGuardsAndResolvers:'always' */},
  {path: 'user-spaces', component: UserSpacesComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'admin/posts', component: PostOpsComponent},
  {path: 'admin/reviews', component: ReviewOpsComponent},
  {path: 'admin/reports', component: ReportOpsComponent},
  {path: 'admin/anime', component: AnimeOpsComponent},
  {path: 'admin/users', component: UserOpsComponent}



]
@NgModule({
  declarations: [
    AppComponent,
    BlogsComponent,
    UsersListComponent,
    PostsComponent,
    NavbarComponent,
    NewPostComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    InitProfileComponent,
    GalaxyComponent,
    UserSpacesComponent,
    SpaceListComponent,
    SpaceComponent,
    VerifyAccountComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AdminComponent,
    PostOpsComponent,
    ReviewOpsComponent,
    UserOpsComponent,
    AnimeOpsComponent,
    ReportOpsComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'}),
    HttpClientModule,
    HttpModule,
    FormsModule,
    AngularFontAwesomeModule,
    ReactiveFormsModule,
    AlertModule.forRoot()
  ],
  providers: [DataService, UserDataService, ProfileService, SearchService, AdminService, SpaceService,
     {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi:true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
