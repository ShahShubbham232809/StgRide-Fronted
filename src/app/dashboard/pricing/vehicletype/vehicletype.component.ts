import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from 'express';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { UserdataService } from 'src/Services/userdata.service';
import {  CityserviceService } from 'src/Services/cityservice.service';
import { VehicletypeService } from 'src/Services/vehicletype.service';


@Component({
  selector: 'app-vehicletype',
  templateUrl: './vehicletype.component.html',
  styleUrls: ['./vehicletype.component.scss']
})
export class VehicletypeComponent implements OnInit{
  value:any = false
  carsList : any
  editcar : any
  edit:any = false
  add:any = false
  updateid:any
  currentpage:any
  limit = 5
  pages:Number= 0
  length:any
  totalPages = 0; // Assuming there are 5 pages in total
  pageNumbers: number[] = [];
  // err:object | undefined
  createVehicle!: FormGroup;
  data: any;
  err:any;
  update:boolean = true
  profileurl: any;
  profileboolean !: boolean;
  // duplicate: boolean = false;
  button(){
    this.edit = false
    this.add = false
    this.value = !this.value
    this.add = !this.add
    this.createVehicle.reset()
  }
  constructor (
    private fb: FormBuilder,
    private newCar:VehicletypeService,
    private toastr: ToastrService
  ) {
    this.pageNumbers = Array(this.totalPages).fill(0).map((_, i) => i + 1);
   }

  getCar(){
    this.newCar.getCarList().subscribe((result)=>{
      this.carsList = result
      this.length = Object.keys(this.carsList).length;
    })
  }

  ngOnInit() {
    this.createForm();
    this.getCar()
    this.currentpage = 1
    this.pages = Number(this.length/this.limit)
  }

  cancel(){
    this.value = false
    this.createVehicle.reset()
    this.profileboolean = false
    this.profileurl = ''
  }
  profile:any
  inputProfile(event:any){
    this.profile = event.target.files[0];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    const allowedTypes = ['image/jpeg', 'image/png','image/jpg'];
    if (this.profile.size > maxSizeInBytes) {
      // alert('File size exceeds the limit of 5MB.');
      // Reset the file input if needed
      this.toastr.info('Image Size is Very Large..')
      event.target.value = null;
      this.profile = null
      this.profileboolean = false
    }else if (!allowedTypes.includes(this.profile.type)) {
      this.toastr.info('Invalid Format..')
      // Reset the file input if needed
      event.target.value = null;
      this.profile = null
      this.profileboolean = false
    }else{
      this.profileboolean = true
      const reader = new FileReader();
      reader.onload = () => {
        // Create the Base64 data URL for the selected file
        this.profileurl = reader.result as string;
      };
      reader.readAsDataURL(this.profile);
    }
  }

  createForm() {
    this.createVehicle = this.fb.group({
      profile:['',Validators.required],
      cartype:['',Validators.required],
    });
  }

  AddCar(val:any){
    this.add = true
    // this.createVehicle.controls['cartype'].clearValidators()
    if(this.createVehicle.valid){
    const fd = new FormData()
    fd.append('profile', this.profile)
    fd.append('cartype', val.cartype)
      this.newCar.AddCarType(fd).subscribe((result)=>{

          this.data = result;
          if(this.data?.keyPattern?.cartype  == 1){
            this.createVehicle.controls['cartype'].setErrors({'incorrect': true})
          }else{
            // if(this.createVehicle.valid)
            this.getCar()
            this.value = false
            this.toastr.success('Added Successfully!!!','')
            this.createVehicle.controls['cartype'].setErrors({'incorrect': false})
          }
      });
    }else{
      this.validateAllFormFields(this.createVehicle);
    }
  }

  EditCar(val:any): void{
    this.update = true
    this.newCar.EditCar(val.id).subscribe((result)=>{
      this.updateid = val.id
      this.editcar = result

      this.add = false
      this.value = true
      this.edit = true;
      this.createVehicle.patchValue({
        cartype:this.editcar.cartype.toUpperCase(),
        // name:this.editcar.name
      })
    })
  }

  UpdateCar(val:any){
    this.add = false
    const fd = new FormData()
    fd.append('profile', this.profile)
    fd.append('cartype', val.cartype)
      this.newCar.Updatecar(fd,this.updateid).subscribe(result => {
        this.data = result;
          if(this.data?.keyPattern?.cartype  == 1){
            this.edit = true
            this.add = false
            this.createVehicle.controls['cartype'].setErrors({'incorrect': true})
          }else{
            this.getCar()
            this.value = false
            this.edit = false
            this.add = true
            this.createVehicle.reset()
            this.toastr.success('Updated Successfully!!!','')
          }
      });
  }

  deleteCar(val:any){
      this.newCar.deleteCar(val.id).subscribe((result)=>{
        this.toastr.info('Deleted Successfully!!!','')
        this.createVehicle.reset()
        this.getCar()
      })
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else {
        control?.markAsTouched({ onlySelf: true });
      }
    });
  }




}
