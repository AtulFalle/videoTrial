import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-dynamic-question',
  templateUrl: './dynamic-question.component.html',
  styleUrls: ['./dynamic-question.component.scss']
})
export class DynamicQuestionComponent {

  @Input() question: any;
  @Input() form: FormGroup;
  @Input() userRole: string;
  get isValid() { return this.form.controls[this.question.key].valid; }

}
