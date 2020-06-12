import { Component, OnInit, Directive, Input, Output, EventEmitter } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../services/utils-service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() group: ITaskGroup;
  userTasks: IUserTask[];
  @Output() reloadList = new EventEmitter();
  // dodaj może tablicę tasków i tu przechowuj je, celem weryfikacji?
  task: IUserTask;
  taskSubscription: Subscription;
  tasksArrSubscription: Subscription;
  todayDate: Date = new Date();
  name = '';
  emptyGuid = '00000000-0000-0000-0000-000000000000';
  freshTask= {
    name: '', deadline: this.todayDate,
    groupId: this.emptyGuid, status: 0,
    inMemoryStatus: '0', usersId: this.emptyGuid,
    id: this.emptyGuid
  }

  constructor(private userTaskService: UserTaskService, 
    private route : ActivatedRoute, private utilsService: UtilsService) {
    this.taskSubscription = userTaskService.taskSelected$.subscribe(t => {
      this.task = t;
      this.task.inMemoryStatus = t.status.toString();
    });
    this.tasksArrSubscription = userTaskService.taskArr$.subscribe(arr =>{
      this.userTasks = arr;
    })
    
  }

  refresh(){
    this.task = {
      name: '', deadline: this.todayDate,
      groupId: this.group.id, status: 0,
      inMemoryStatus: '0', usersId: this.emptyGuid,
      id: this.utilsService.newGuid()
    };
  }

  convertString(value) {
    return parseInt(value);
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  taskNameFormControl = new FormControl('', [
    Validators.required
  ]);

  submit(form : NgForm) {
    if(form.valid){
      let lookup = this.isTaskExisting();
      /* Tutaj dodawaj te taski do tablicy, */
      if (lookup){
        this.task.status = this.convertString(this.task.inMemoryStatus);
        let taskIndex = this.userTasks.findIndex(t => t.id === this.task.id);
        this.userTasks.forEach(t => {
          if(t.id === this.task.id){
            console.log('task found in array:');
            console.log(t);
            console.log('task from form:');
            console.log(this.task);
            t.name = this.task.name;
            t.deadline = this.task.deadline;
            t.inMemoryStatus = this.task.inMemoryStatus;
            t.status = this.task.status;
            t.usersId = this.task.usersId;
          }
        });
        // console.log('Patched: ');
        // console.log(this.task);
        // this.userTaskService.patchUserTask(this.task).subscribe(res => {
        // }, err => {
        //   console.error(err)
        // },
        //   () => {
        //     this.reloadList.next(true)
        //   });
      }
      else {
        this.add();
      }
      console.log('tablica po operacji:');
      this.userTasks.forEach(t => console.log(t));
      console.log('Koniec iteracji');
      this.refresh();
      this.userTaskService.sendTasksArr(this.userTasks);
    }
  }

  add(){
    this.task.status = this.convertString(this.task.inMemoryStatus);
    this.userTasks.push(this.task);
    // this.userTaskService.postUserTask(this.task).subscribe(res => {
    //   this.userTasks.push(res);
    //   console.log('tempTasksArray length:');
    //   console.log(this.userTasks.length);
    // }, err => console.error(err),
    //   () => {
    //     this.reloadList.next(true)
    //   });
  }

  /* ta funkcja jest do sprawdzenia, czy w istniejących taskach już jest taki task */
  isTaskExisting(): boolean {
    for(let i = 0 ; i < this.userTasks.length; i ++){
      if(this.task.id === this.userTasks[i].id){
        return true;
      }
    }
    return false;
  }

  ngOnInit() {
    if (!this.group) {
      let paramId = this.route.snapshot.queryParams['id'];
      this.group = { id: paramId, name: '', userTasks: null }
    }
    this.freshTask = {
      name: '', deadline: this.todayDate,
      groupId: this.group.id, status: 0,
      inMemoryStatus: '0', usersId: this.emptyGuid,
      id: this.emptyGuid
    }
    if(this.group.id){
      this.userTaskService.getTasksFromGroup(this.group.id).subscribe(arr => {
        this.userTasks = arr;
      }, err => {
        console.log('An error occured while acquiring tasks in taskform component');
        console.error(err);
      },
      () => { // Jak to się zachowa w przypadku nowej grupy?
        console.log('tempTasksArray:');
        console.log(this.userTasks);
      });
      this.refresh();
    }
    else{
      console.log('looks like youre attempting to create a new task!');
      this.task = { id: this.utilsService.newGuid(), name: '', deadline: new Date(), status: 0, 
      inMemoryStatus: '0', usersId: this.emptyGuid, groupId: this.group.id }
      console.log('task Id assigned');
      console.log(this.task.id);
    }

  }
}

