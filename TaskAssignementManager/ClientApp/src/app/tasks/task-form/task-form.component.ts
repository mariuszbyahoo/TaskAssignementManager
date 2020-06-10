import { Component, OnInit, Input } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() task : IUserTask
  constructor(private userTaskService : UserTaskService) { }

  ngOnInit() {}

}
