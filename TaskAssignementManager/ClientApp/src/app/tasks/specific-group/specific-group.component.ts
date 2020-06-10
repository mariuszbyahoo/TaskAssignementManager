import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskGroup } from '../groups/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';
import { IUserTask } from '../userTasks/IUserTask';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-specific-group',
  templateUrl: './specific-group.component.html',
  styleUrls: ['./specific-group.component.css']
})
export class SpecificGroupComponent implements OnInit {
  id: string 
  name: string
  taskGroup: ITaskGroup
  userTasks: IUserTask[]
  matcher = new MyErrorStateMatcher();
  constructor(private route: ActivatedRoute, private taskGroupService: TaskGroupService) {}
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
    console.log(this.taskGroup);
    //this.taskGroupService.
  }
  
  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.taskGroupService.getTaskGroup(this.id).subscribe(group => {
      this.taskGroup = group;
      this.name = this.taskGroup.name;
      this.userTasks = new Array<IUserTask>(0);
      for (let i = 0; i < this.taskGroup.userTasks.length; i++){
        let task = this.taskGroup.userTasks[i];
        this.userTasks.push(task);
        this.tiles.push(new Tile(task.name, 2, 1, 'lightgray'));
      }
    })
    //this.taskGroupService.getTaskGroup(id) use specific method for retreiving one taskGroup
    this.tiles = [
      {text: 'taskGroup', cols: 2, rows: 1, color: 'lightpink'},
      {text: 'task', cols: 2, rows: 1, color: '#DDBDF1'},
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
