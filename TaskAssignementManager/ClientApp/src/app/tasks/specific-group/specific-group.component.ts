import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { IUserTask } from '../userTasks/IUserTask';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';
import { UserTaskService } from '../services/user-task.service';
import { UtilsService } from '../services/utils-service';

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
  tiles: Tile[] 
  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private taskGroupService: TaskGroupService,
    private userTaskService: UserTaskService,
    private utilsService: UtilsService) {
    userTaskService.taskSelected$.subscribe(task => {
      this.userTasks.push(task);
    });
  }

  delete(id) {
    this.userTaskService.delete(id).subscribe(res => {
    }, err => console.error(err),
    () => this.ngOnInit());
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

  sendTask(tile) {
    this.userTaskService.getUserTask(tile.taskId).subscribe(t => {
      this.userTaskService.sendTask(t);
    })
  }
  
  public ngOnInit() {
    this.id = this.route.snapshot.queryParams['id'];
    if(this.id){
      this.taskGroupService.getTaskGroup(this.id).subscribe(group => {
        this.taskGroup = group;
        this.name = this.taskGroup.name;
        this.userTasks = new Array<IUserTask>(0);
        for (let i = 0; i < this.taskGroup.userTasks.length; i++){
          let task = this.taskGroup.userTasks[i];
          this.userTasks.push(task);
          this.tiles.push(new Tile(task.name, 1, 1, 'lightgray', task.id));
        }
        console.log('existing group selected');
      }, err => {
        console.log('an error occured while acquiring the taskGroup');
        console.error(err)
      })
    }
    else{
      this.taskGroup = { id: this.utilsService.newGuid(), name: '', userTasks: new Array<IUserTask>(0) }
      console.log('new group created');
      console.log(this.taskGroup.id);
    }
    this.tiles = [
    ]
  }

  back() {
    this.router.navigate(['/']);
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
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
  taskId: string;

  constructor(text, cols, rows, color, taskId){
    this.text = text;
    this.cols = cols;
    this.rows = rows;
    this.color = color;
    this.taskId = taskId;
  }
}
