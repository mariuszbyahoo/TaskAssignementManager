import { Component, OnInit, Directive, Input } from '@angular/core';
import { IUserTask } from '../userTasks/IUserTask';
import { UserTaskService } from '../services/user-task.service';
import { Subscription } from 'rxjs';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { ActivatedRoute } from '@angular/router';
import { SpecificGroupComponent } from '../specific-group/specific-group.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() group: ITaskGroup;
  task: IUserTask;
  taskSubscription: Subscription;
  todayDate: Date = new Date();
  name = '';

  constructor(private userTaskService: UserTaskService, 
    private route : ActivatedRoute) {
    this.taskSubscription = userTaskService.taskSelected$.subscribe(t => {
      this.task = t;
      // TODO Zobacz czy zaakceptuje 
      this.task.inMemoryStatus = t.status.toString();
    });
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
    this.userTaskService.postUserTask(this.task).subscribe(res => {
    }, err => console.error(err),
      () => console.log('find a way to call parents function here, reload the component'));
  }

  ngOnInit() {
    
    if (!this.group) {
      let paramId = this.route.snapshot.queryParams['id'];
      console.log(paramId);
      this.group = { id: paramId, name: '', userTasks: null }
    }
    this.task = {
      name: '', deadline: new Date(),
      groupId: this.group.id, status: 0,
      inMemoryStatus: '0', usersId: '00000000-0000-0000-0000-000000000000',
      id: '00000000-0000-0000-0000-000000000000'
    }
  }
}

