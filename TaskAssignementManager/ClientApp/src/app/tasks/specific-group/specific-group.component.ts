import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { IUserTask } from '../userTasks/IUserTask';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';
import { UserTaskService } from '../services/user-task.service';
import { UtilsService } from '../services/utils-service';
import { Subscription } from 'rxjs';

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
  userTasks: IUserTask[];
  tiles: Tile[];
  counter: number = 0; // pokazuje, który raz uruchomiona została metoda ngOnInit
  userTasksSubscription : Subscription;
  matcher = new MyErrorStateMatcher();

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private taskGroupService: TaskGroupService,
    private userTaskService: UserTaskService,
    private utilsService: UtilsService) {

    this.userTasks = new Array<IUserTask>(0);
    this.tiles = [

    ]

    userTaskService.taskSelected$.subscribe(task => {
      this.userTasks.push(task);
    });
    this.userTasksSubscription = userTaskService.taskArr$.subscribe(arr => {
      this.userTasks = arr;
      this.refresh();
    })
  }

  submit(g){
    g.userTasks = this.userTasks;
    g.name = this.name;
    this.taskGroupService.getTaskGroup(g.id).subscribe(found => {
      console.log(found);
      this.taskGroupService.patchTaskGroup(g).subscribe(result =>{
        console.log('patched an existing TaskGroup');
        console.log(result);
        }, err => console.error(err),
        () => this.back()
      );
    }, err => {
      console.error(err); 
      this.taskGroupService.postTaskGroup(g).subscribe(result => {
        console.log('created a new TaskGroup');
        }, err => console.error(err),
        () => this.back()
      );
    },
    () => console.log('Lookup function done.'));
  }

  delete(tile) {
    let initialLength = this.userTasks.length;
    console.log(this.userTasks);
    console.log(this.tiles);
    for(let i = 0 ; i < this.userTasks.length; i ++){
      if(this.userTasks[i].id === tile.taskId){
        this.userTasks.splice(i, 1);
        console.log('deleted from userTasks array');
        // line 59, causes problem?
      }
    }
    // refresh() loop depends on userTasks length changed above, so
    if(initialLength < 2){
      this.tiles = new Array<Tile>(0);
    }
    this.refresh();
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
    if(!this.id){
      this.taskGroup = {id : this.utilsService.newGuid(), name: '', userTasks: this.userTasks}
      this.id = this.taskGroup.id;
    }
    this.taskGroupService.getTaskGroup(this.id).subscribe(group => {
      this.taskGroup = group;
      this.name = this.taskGroup.name;
      this.userTasks = this.taskGroup.userTasks;
     this.populateTiles();
    }, err => {
      console.error(err);
      this.taskGroup = {id: this.utilsService.newGuid(), name : '', userTasks: this.userTasks};
      this.name = this.taskGroup.name;
      this.populateTiles();
    })
  }

  refresh(){
    for (let i = 0; i < this.userTasks.length; i++){
      this.tiles = new Array<Tile>(0);
      this.userTasks.forEach(el => {
        this.tiles.push(new Tile(el.name, 1, 1, 'lightgray', el.id));
      });
      console.log('tiles length');
      console.log(this.tiles.length);
    }
  }

  back() {
    this.router.navigate(['/']);
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  populateTiles(){
    for (let i = 0; i < this.taskGroup.userTasks.length; i++){
      this.tiles = new Array<Tile>(0);
      this.userTasks.forEach(el => {
        this.tiles.push(new Tile(el.name, 1, 1, 'lightgray', el.id));
      });
    }
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
