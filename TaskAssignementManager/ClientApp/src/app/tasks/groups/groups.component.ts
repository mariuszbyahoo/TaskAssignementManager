import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {TaskGroupService } from '../services/task-group.service';
import { ITaskGroup } from '../models/ITaskGroup';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSortHeader } from '@angular/material/sort';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit, AfterViewInit {

  constructor(private taskGroupService: TaskGroupService) { }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  displayedColumns: string[] = ['name', 'tasks amount', 'delete'];
  dataSource = new MatTableDataSource<ITaskGroup>();

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit (){
    this.dataSource.sort = this.sort;
  }

  fetchData(): void {
    this.taskGroupService.getTaskGroups().subscribe(g => {
      this.dataSource = new MatTableDataSource<ITaskGroup>(g);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
