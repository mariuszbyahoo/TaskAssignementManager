import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

import { IUserTask } from '../models/IUserTask';
import { ITaskGroup } from '../models/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';
import { UserTaskService } from '../services/user-task.service';
import { UtilsService } from '../services/utils-service';
import { Subscription } from 'rxjs';
import { ITile } from '../models/ITile';

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
  tiles: ITile[];
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

  submit(g) {
    if (this.name !== '') {
      g.userTasks = this.userTasks;
      g.name = this.name;
      this.taskGroupService.getTaskGroup(g.id).subscribe(found => {
        this.taskGroupService.patchTaskGroup(g).subscribe(result => {
        }, err => console.error(err),
          () => this.back()
        );
      }, err => {
        console.error(err);
        this.taskGroupService.postTaskGroup(g).subscribe(result => {
        }, err => console.error(err),
          () => this.back()
        );
      });
    }
    else {
    }
  }

  delete(tile) {
    let initialLength = this.userTasks.length;
    for(let i = 0 ; i < this.userTasks.length; i ++){
      if(this.userTasks[i].id === tile.taskId){
        this.userTasks.splice(i, 1);
      }
    }
    // refresh() loop depends on userTasks length changed above, so
    if(initialLength < 2){
      this.tiles = new Array<ITile>(0);
      this.userTasks = new Array<IUserTask>(0);
    }
    this.userTaskService.sendTasksArr(this.userTasks);
    this.refresh();
  }

  taskGroupNameFormControl = new FormControl('', [
    Validators.required
  ]);

  sendTask(tile) {
    this.userTasks.forEach(t => {
      if(t.id === tile.taskId){
        this.userTaskService.sendTask(t);
      }
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
     this.refresh();
    }, err => {
      console.error(err);
      this.taskGroup = {id: this.utilsService.newGuid(), name : '', userTasks: this.userTasks};
      this.name = this.taskGroup.name;
      this.refresh();
    })
  }

  refresh(){
    this.deleteDuplicates();
      this.tiles = new Array<ITile>(0);
      let tile: ITile;
      this.userTasks.forEach(el => {
        tile = {text: el.name, cols: 1, rows: 1, color: 'lightGray', taskId: el.id};
        this.tiles.push(tile);
      });
  }

  back() {
    this.router.navigate(['/']);
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  deleteDuplicates() {
    let set = new Set(this.userTasks);
    this.userTasks = new Array<IUserTask>(0);
    set.forEach(t => {
      this.userTasks.push(t);
    })
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

