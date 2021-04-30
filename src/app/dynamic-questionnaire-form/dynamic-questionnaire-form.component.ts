import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { VideoTrialStoreActions, VideoTrialStoreSelectors, VideoTrialStoreState } from '../root-store/video-trial-store';
import { QuestionnaireService } from './dynamic-questionnaire.service';

@Component({
  selector: 'app-dynamic-questionnaire-form',
  templateUrl: './dynamic-questionnaire-form.component.html',
  styleUrls: ['./dynamic-questionnaire-form.component.scss'],
  providers: [QuestionnaireService]
})
export class DynamicQuestionnaireFormComponent implements OnInit {

  questions: any[] = [];
  form: FormGroup;
  payLoad = '';
  length = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageEvent: PageEvent;
  userRole: string = '';
  constructor(private service: QuestionnaireService,
    private store$: Store<VideoTrialStoreState.State>,) { }

  ngOnInit() {
    this.store$.dispatch(VideoTrialStoreActions.getAllQuestions());
    this.store$.select(VideoTrialStoreSelectors.getAllQuestions).subscribe((res) => {
      console.log(res);
      this.questions = res;
      this.form = this.toFormGroup(this.questions);
    });
    try {
      const token: any = jwt_decode(sessionStorage.getItem('token'));
      const roleData = JSON.parse(token.extension_selectedrole);
      const userRoles = [];
      for (const iterator of Object.keys(roleData)) {
        for (const iter of roleData[iterator]) {
          userRoles.push(iter.role);
        }
      }
      if (userRoles.find((e) => e === 'Admin')) {
        this.userRole = 'admin';
      } else if (userRoles.find((e) => e === 'Uploader')) {
        this.userRole = 'uploader';
      } else {
      }
    } catch (e) {
      this.userRole = '';
    }
    this.service.getQuestions().subscribe(resp=>{
      this.questions = resp;
    })
    this.length = this.questions.length;
    console.log(this.questions);
    this.form = this.toFormGroup(this.questions);
    console.log(this.form);
  }

  onSubmit() {
    this.payLoad = JSON.stringify(this.form.getRawValue());
    console.log(this.payLoad);
  }

  toFormGroup(questions: any[]) {
    const group: any = {};

    questions.forEach(question => {
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required)
        : new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }

  getQuestions =() => {
    console.log(    this.questions
      );

    if(this.pageEvent){
      return  this.questions.filter(item=> item.order > this.pageEvent.pageIndex * this.pageEvent.pageSize && item.order <= (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize)
    } else {
      return this.questions.filter(item=> item.order <= this.pageSize);
    }
  }
  resetForm = () =>{
    this.form.reset();
  }

}
function jwt_decode(arg0: string): any {
  throw new Error('Function not implemented.');
}

