import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {  MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatInputModule } from '@angular/material/input';

import { SpecificGroupComponent } from './specific-group/specific-group.component';
import { GroupsComponent } from './groups/groups.component';

@NgModule({
  declarations: [GroupsComponent, SpecificGroupComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatInputModule
  ],
  exports: [GroupsComponent]
})
export class TasksModule { }
