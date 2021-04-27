import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  formTemplate = new FormGroup({
    caption: new FormControl(''),  //empty string
    category: new FormControl(''),
    imageUrl: new FormControl(''),
  })
  
  constructor() { }

  ngOnInit(): void {
  }

}
