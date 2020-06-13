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
import { ITile } from '../userTasks/ITile';

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
    else {
    }
  }

  delete(tile) {
    let initialLength = this.userTasks.length;
    console.log(this.userTasks);
    console.log(this.tiles);
    for(let i = 0 ; i < this.userTasks.length; i ++){
      if(this.userTasks[i].id === tile.taskId){
        this.userTasks.splice(i, 1);
        console.log('deleted from userTasks array');
      }
    }
    // refresh() loop depends on userTasks length changed above, so
    if(initialLength < 2){
      this.tiles = new Array<ITile>(0);
    }
    this.refresh();
  }

  taskGroupNameFormControl = new FormControl('', [
    Validators.required
  ]);

  printInnerData() {
    console.log('this.userTasks:');
    console.log(this.userTasks);
    console.log('this.tiles:');
    console.log(this.tiles)
  }

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
      this.tiles = new Array<ITile>(0);
      let tile: ITile;
      this.userTasks.forEach(el => {
        tile = {text: el.name, cols: 1, rows: 1, color: 'lightGray', taskId: el.id};
        this.tiles.push(tile);
      });
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
    let tile: ITile;
    if(this.taskGroup.userTasks){
      for (let i = 0; i < this.taskGroup.userTasks.length; i++){
        this.tiles = new Array<ITile>(0);
        this.userTasks.forEach(el => {
          tile = {text: el.name, cols: 1, rows: 1, color: 'lightGray', taskId: el.id}
          this.tiles.push(tile);
        });
      }
    }
  }
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

