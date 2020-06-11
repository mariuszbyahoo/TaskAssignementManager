import { Component, OnInit, Directive } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  group: ITaskGroup;
  task : IUserTask ;
  taskSubscription: Subscription;
  groupSubscription: Subscription;
  todayDate: Date = new Date();

  constructor(private userTaskService : UserTaskService, private taskGroupService: TaskGroupService) { 
    this.taskSubscription = userTaskService.taskSelected$.subscribe(t => {
      this.task = t;
      // TODO Zobacz czy zaakceptuje 
      this.task.inMemoryStatus = t.status.toString();
    })
    this.groupSubscription = taskGroupService.groupSelected$.subscribe(g => {
      this.group = g;
      console.log('group received in task-form.component.ts, check it out below!');
      console.log(this.group);
    })
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

  submit() {
    console.log(this.task);
  }

  ngOnInit() {
    this.task = {name : '', deadline : new Date(), 
    groupId : '00000000-0000-0000-0000-000000000000', status: 0, 
    inMemoryStatus: '0', usersId : '00000000-0000-0000-0000-000000000000',
    id: '00000000-0000-0000-0000-000000000000'}
  }
}


