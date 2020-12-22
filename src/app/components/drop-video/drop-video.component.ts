import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-drop-video',
  templateUrl: './drop-video.component.html',
  styleUrls: ['./drop-video.component.scss'],
})
export class DropVideoComponent implements OnInit {
  constructor() {}

  studyTasks = [
    { name: 'Blood Pressure', completed: false },
    { name: 'Body Temperature', completed: false },
    { name: 'Weight', completed: false },
  ];

  ngOnInit(): void {}
}
