import { Component, OnInit, Directive, Input, Output, EventEmitter } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() group: ITaskGroup;
  @Output() reloadList = new EventEmitter();
  task: IUserTask;
  taskSubscription: Subscription;
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
    private route : ActivatedRoute) {
    this.taskSubscription = userTaskService.taskSelected$.subscribe(t => {
      this.task = t;
      // TODO Zobacz czy zaakceptuje 
      this.task.inMemoryStatus = t.status.toString();
    });
  }

  refresh(){
    this.task = this.freshTask;
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
      if (this.task.id === this.emptyGuid) {
        this.post();
      }
      else {
        this.task.status = this.convertString(this.task.inMemoryStatus);
        console.log('Patched: ');
        console.log(this.task);
        this.userTaskService.patchUserTask(this.task).subscribe(res => {
        }, err => {
          console.error(err)
        },
          () => this.reloadList.next(true));
      }
    }
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
    this.task = this.freshTask;
  }

  post(){
    this.task.status = this.convertString(this.task.inMemoryStatus);
        console.log('Posted: ');
        console.log(this.task);
        this.userTaskService.postUserTask(this.task).subscribe(res => {
        }, err => console.error(err),
          () => this.reloadList.next(true));
  }
}

