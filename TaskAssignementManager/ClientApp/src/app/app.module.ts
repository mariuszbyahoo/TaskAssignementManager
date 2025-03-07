import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { TasksModule } from './tasks/tasks.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsComponent } from './tasks/groups/groups.component';
import { SpecificGroupComponent } from './tasks/specific-group/specific-group.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    TasksModule,
    MatToolbarModule,
    RouterModule.forRoot([
      { path: '', component: GroupsComponent, pathMatch: 'full' },
      { path: 'groups/new', component: SpecificGroupComponent, pathMatch: 'full' },
      { path: 'groups/edit', component: SpecificGroupComponent, pathMatch: 'full' }
    ]),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
