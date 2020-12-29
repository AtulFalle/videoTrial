import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ProcedureService } from 'src/app/core/services/procedure-service/procedure.service';

@Component({
  selector: 'app-add-procedure',
  templateUrl: './add-procedure.component.html',
  styleUrls: ['./add-procedure.component.scss'],
})
export class AddProcedureComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  files: any[] = [];

  procedureForm = this.fb.group({
    patientId: [''],
    procedureDate: [''],
    patientDob: [''],
    study: this.fb.group({
      bloodPressure: [false],
      bodyTemperature: [false],
      weight: [false],
    }),
    site: [''],
    procedureType: [''],
    conductingSurgeon: [''],
    surgicalDeviceLiaison: [''],
  });

  constructor(
    private fb: FormBuilder,
    private procedureService: ProcedureService
  ) {}

  studyTasks = [
    { formKey: 'bloodPressure', name: 'Blood Pressure', completed: false },
    { formKey: 'bodyTemperature', name: 'Body Temperature', completed: false },
    { formKey: 'weight', name: 'Weight', completed: false },
  ];
  processing = false;

  ngOnInit(): void {}

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(event: any) {
    this.prepareFilesList(event.target.files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
  }

  /**
   * Simulate the upload process
   */
  // uploadFilesSimulator(index: number) {
  //   setTimeout(() => {
  //     if (index === this.files.length) {
  //       return;
  //     } else {
  //       const progressInterval = setInterval(() => {
  //         if (this.files[index].progress === 100) {
  //           clearInterval(progressInterval);
  //           this.uploadFilesSimulator(index + 1);
  //         } else {
  //           this.files[index].progress += 5;
  //         }
  //       }, 200);
  //     }
  //   }, 1000);
  // }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number) {
    if (this.files[index].progress < 100) {
      console.log('Upload in progress.');
      return;
    }
    this.files.splice(index, 1);
  }

  onSubmit() {
    const formData = this.toFormData(this.procedureForm.value, this.files);
    this.procedureService
      .createProcedure(formData)
      .subscribe((procedure) => console.log(procedure));
  }

  toFormData(formValue: any, videos: any[]) {
    const formData = new FormData();
    const formValueCopy = { ...formValue };
    formValueCopy.procedureDate = formValueCopy.procedureDate.toISOString();
    formValueCopy.patientDob = formValueCopy.patientDob.toISOString();
    formValueCopy.study = 'study';

    for (const key of Object.keys(formValueCopy)) {
      const value = formValueCopy[key];
      formData.append(key, value);
    }
    videos.forEach((video) => {
      formData.append('videos', video, video.name);
    });
    return formData;
  }
}
