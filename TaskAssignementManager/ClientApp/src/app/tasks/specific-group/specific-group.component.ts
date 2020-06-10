import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITaskGroup } from '../groups/ITaskGroup';
import { TaskGroupService } from '../services/task-group.service';

@Component({
  selector: 'app-specific-group',
  templateUrl: './specific-group.component.html',
  styleUrls: ['./specific-group.component.css']
})
export class SpecificGroupComponent implements OnInit {
  id: string 
  name: string
  taskGroup: ITaskGroup
  constructor(private route: ActivatedRoute, private taskGroupService: TaskGroupService) {}
  tiles: Tile[] 

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.taskGroupService.getTaskGroup(this.id).subscribe(group => {
      console.log(group);
      this.taskGroup = group;
      this.name = this.taskGroup.name;
      this.tiles.unshift(new Tile(this.name, 4, 1, 'lightblue'));
    })
    //this.taskGroupService.getTaskGroup(id) use specific method for retreiving one taskGroup
    this.tiles = [
      {text: 'taskGroup', cols: 2, rows: 1, color: 'lightpink'},
      {text: 'task', cols: 2, rows: 1, color: '#DDBDF1'},
    ]
  }

  ngOnDestroy() {
  }
}

class Tile {
  text: string;
  cols: number;
  rows: number;
  color: string;

  constructor(text, cols, rows, color){
    this.text = text;
    this.cols = cols;
    this.rows = rows;
    this.color = color;
  }
}
