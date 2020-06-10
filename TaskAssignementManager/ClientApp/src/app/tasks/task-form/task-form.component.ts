import { Component, OnInit } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task : IUserTask
  constructor() { }

  ngOnInit() {
  }

}
