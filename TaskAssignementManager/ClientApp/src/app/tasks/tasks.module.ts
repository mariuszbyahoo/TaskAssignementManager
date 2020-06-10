import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupsComponent } from './groups/groups.component';
import {  MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { SpecificGroupComponent } from './specific-group/specific-group.component';



@NgModule({
  declarations: [GroupsComponent, SpecificGroupComponent],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  exports: [GroupsComponent]
})
export class TasksModule { }
