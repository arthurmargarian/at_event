import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-navigator',
  templateUrl: './event-navigator.component.html',
  styleUrls: ['./event-navigator.component.scss']
})
export class EventNavigatorComponent implements OnInit {
  filters: {
    name: string,
    region: number[],
    type: number[],
    status: number[]
  };

  constructor() {
  }

  ngOnInit() {
  }

}
