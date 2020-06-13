import { Component, OnInit, ViewChild } from '@angular/core';
import {TaskGroupService } from '../services/task-group.service';
import { ITaskGroup } from '../userTasks/ITaskGroup';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  constructor(private taskGroupService: TaskGroupService) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  displayedColumns: string[] = ['name', 'tasks amount', 'delete'];
  dataSource : MatTableDataSource<ITaskGroup>;

  ngOnInit() {
    this.fetchData();
  }

  fetchData(): void {
    this.taskGroupService.getTaskGroups().subscribe(g => {
      this.dataSource = new MatTableDataSource<ITaskGroup>(g);
      this.dataSource.paginator = this.paginator;
    }),
      err => console.log(`An error occured: ${err}`);
  }

  deleteTaskGroup(id): void {
    this.taskGroupService.deleteTaskGroup(id).subscribe(g => {
      this.fetchData();
    }),
    err => console.log(`An error occured: ${err}`);
  }
}
