import { Component, OnInit } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task : IUserTask 
  subscription: Subscription
  constructor(private userTaskService : UserTaskService) { 
    this.subscription = userTaskService.taskSelected$.subscribe(t => {
      this.task = t;
      console.log(this.task);
    })
  }

  ngOnInit() {
    this.task = {name : '', deadline : new Date(), 
    groupId : '00000000-0000-0000-0000-000000000000', status: '0', 
    usersId : '00000000-0000-0000-0000-000000000000',
    id: '00000000-0000-0000-0000-000000000000'}
  }

}
