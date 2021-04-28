import { Component, OnInit } from '@angular/core';
import { AngularFireStorage} from '@angular/fire/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {finalize} from "rxjs/operators";
import { ImageService } from 'src/app/shared/image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  imgSrc: string ="";
  selectedImage: any = "";
  isSubmitted: boolean = false;
  
  formTemplate = new FormGroup({
    imageUrl: new FormControl('',  Validators.required),
    caption: new FormControl('', Validators.required),
    category: new FormControl(''),
  })
  
  constructor(private storage: AngularFireStorage,
    private service:ImageService) { }

  //when the componet is shown, resetForm() will be called
  ngOnInit(): void {
    this.resetForm();
  }

  showPreview(event:any){
      if(event.target.files && event.target.files[0]){
        const reader = new FileReader();
        reader.onload = (e:any) => this.imgSrc =e.target.result;
        reader.readAsDataURL(event.target.files[0]);
        this.selectedImage= event.target.files[0];
      }
      else{
        this.imgSrc = '/src/assets/img/placeholder.jpg';
        this.selectedImage =null;
      }
  }

  onSubmit(formValue: { [x: string]: any; category: any; }){
    this.isSubmitted = true;
    console.log("clicked submit");
    if(this.formTemplate.valid){
      console.log("ok, form is valid");
      //uploade to firebase cloud storage
      var filePath = `${formValue.category}/${this.selectedImage.name.split('.').slice(0,-1).join('.')}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath, this.selectedImage).snapshotChanges().pipe(
        finalize(()=>{
          fileRef.getDownloadURL().subscribe((url)=>{
            formValue['imageUrl']= url;
            console.log("imageUrl is now set it as image url");

            this.service.insertImageDetails(formValue);
            console.log("pushed to firebase");

            this.resetForm();
          })
        })
      ).subscribe();
    }
  }

 // need to add "get" in order to call it from html
  get formControls(){
    return this.formTemplate['controls'];
  }

  resetForm(){
    this.formTemplate.reset();
    this.formTemplate.setValue({
      caption:'',
      imageUrl:'',
      category:'People'
    })
    this.imgSrc = '/src/assets/img/placeholder.jpg';
    this.selectedImage = null;
    this.isSubmitted=false;
    console.log("reset form");
  }
}
