import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IUserTask } from '../models/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ITaskGroup } from '../models/ITaskGroup';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from '../services/utils-service';
import { IUser } from '../models/IUser';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() group: ITaskGroup;
  @Output() reloadList = new EventEmitter();
  taskSubscription: Subscription;
  tasksArrSubscription: Subscription;

  userTasks: IUserTask[];
  users: IUser[];
  task: IUserTask;
  todayDate: Date = new Date();
  formName = null;
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

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  taskNameFormControl = new FormControl('', [
    Validators.required
  ]);

  submit(form : NgForm) {
    if(form.valid){
      let lookup = this.isTaskExisting(this.userTasks);
      if (lookup){
        this.task.status = parseInt(this.task.inMemoryStatus);
        for(let i = 0 ; i < this.userTasks.length ; i ++){
          if(this.userTasks[i].id === this.task.id){
            this.userTasks[i].name = this.task.name;
            this.userTasks[i].deadline = this.task.deadline;
            this.userTasks[i].inMemoryStatus = this.task.inMemoryStatus;
            this.userTasks[i].status = this.task.status;
            this.userTasks[i].usersId = this.task.usersId;
          }
        }
      }
      else {
        this.add();
      }
      this.refresh();
      this.userTaskService.sendTasksArr(this.userTasks);
    }
  }

  add(){
    this.task.status = parseInt(this.task.inMemoryStatus);
    this.userTasks.push(this.task);
  }

  isTaskExisting(userTasks): boolean {
    for(let i = 0 ; i < userTasks.length; i ++){
      if(this.task.id === userTasks[i].id){
        return true;
      }
    }
    this.formName = 'New Task:';
    return false;
  }

  ngOnInit() {
    this.utilsService.getUsers().subscribe(u => {
      this.users = u;
    })
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
        console.error(err);
      },
      () => { 
        this.isTaskExisting(this.userTasks);
      });
      this.refresh();
    }
    else{
      this.task = { id: this.utilsService.newGuid(), name: '', deadline: new Date(), status: 0, 
      inMemoryStatus: '0', usersId: this.emptyGuid, groupId: this.group.id }
      this.isTaskExisting(new Array<IUserTask>(0));
    }
  }
}

