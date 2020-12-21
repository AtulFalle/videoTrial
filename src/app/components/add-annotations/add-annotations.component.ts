import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  VideoTrialStoreActions,
  VideoTrialStoreState,
} from 'src/app/root-store/video-trial-store';

@Component({
  selector: 'app-add-annotations',
  templateUrl: './add-annotations.component.html',
  styleUrls: ['./add-annotations.component.scss'],
})
export class AddAnnotationsComponent implements OnInit {
  @Input()
  videoId!: string;

  @Output()
  annotaionAdded: EventEmitter<true> = new EventEmitter(true);
  annotationForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store$: Store<VideoTrialStoreState.State>
  ) {}

  ngOnInit(): void {
    this.annotationForm = this.fb.group({
      annotation: this.fb.array([this.createForm()]),
    });
  }

  createForm(): FormGroup {
    return new FormGroup({
      time: new FormControl(''),
      comments: new FormControl(''),
    });
  }

  getControls(): AbstractControl[] {
    return (this.annotationForm.get('annotation') as FormArray).controls || [];
  }

  removeOrClearEmail(i: number): void {
    const annotation = this.annotationForm.get('annotation') as FormArray;
    if (annotation.length > 1) {
      annotation.removeAt(i);
    } else {
      annotation.reset();
    }
  }

  addAnnotationToGroup(): void {
    const emails = this.annotationForm.get('annotation') as FormArray;
    emails.push(this.createForm());
  }

  saveAnnotations(): void {
    console.log(this.annotationForm.value);

    this.store$.dispatch(
      VideoTrialStoreActions.addAnnotations({
        annotationsList: this.annotationForm.value,
        videoId: this.videoId,
      })
    );
    this.annotaionAdded.emit(true);
  }
}
