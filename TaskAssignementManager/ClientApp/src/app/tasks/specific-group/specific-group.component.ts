import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { IUserTask } from '../userTasks/IUserTask';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';
import { UserTaskService } from '../services/user-task.service';

@Component({
  selector: 'app-specific-group',
  templateUrl: './specific-group.component.html',
  styleUrls: ['./specific-group.component.css'],
  providers: [UserTaskService]
})
export class SpecificGroupComponent implements OnInit {
  id: string 
  name: string
  taskGroup: ITaskGroup
  userTasks: IUserTask[]
  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute, 
    private taskGroupService: TaskGroupService,
    private userTaskService: UserTaskService) {
    userTaskService.taskSelected$.subscribe(task => {
      this.userTasks.push(task);
    });
  }

  tiles: Tile[] 

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  taskGroupNameFormControl = new FormControl('', [
    Validators.required
  ]);

  changeTaskGroupsName(name) {
    this.taskGroup.name = name;
    this.taskGroupService.patchTaskGroup(this.taskGroup).subscribe(g => {
      this.taskGroup = g;
    })
  }

  sendTask(tile){
    console.log(tile);
  }
  
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if(this.id){
      this.taskGroupService.getTaskGroup(this.id).subscribe(group => {
        this.taskGroup = group;
        this.name = this.taskGroup.name;
        this.userTasks = new Array<IUserTask>(0);
        for (let i = 0; i < this.taskGroup.userTasks.length; i++){
          let task = this.taskGroup.userTasks[i];
          this.userTasks.push(task);
          this.tiles.push(new Tile(task.name, 1, 1, 'lightgray'));
        }
      })
    }
    //this.taskGroupService.getTaskGroup(id) use specific method for retreiving one taskGroup
    this.tiles = [
    ]
  }

  ngOnDestroy() {
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
class Tile {
  text: string;
  cols: number;
  rows: number;
  color: string;

  constructor(text, cols, rows, color){
    this.text = text;
    this.cols = cols;
    this.rows = rows;
    this.color = color;
  }
}
