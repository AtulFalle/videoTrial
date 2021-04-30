import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
const baseUrl = 'https://biogenbackendapi.azurewebsites.net/';
@Injectable()
export class QuestionnaireService {
    constructor(private http: HttpClient) {}
    getAllQuestions(): Observable<any[]> {
        const url = `${baseUrl}questionnaire`;
        return this.http.get<any[]>(url);
      }

    getQuestions() {

        const questions: any[] = [

            {
                controlType: 'dropdown',
                key: 'gender',
                label: 'What is you Gender?',
                options: [
                    { key: 'male',checked: true, value: 'Male' },
                    { key: 'femail', value: 'Female' },
                    { key: 'other', value: 'Other' },
                ],
                order: 3,
                authorizedUser:'admin'
            },
            {
                controlType: 'textbox',
                key: 'firstName',
                label: 'What is your First name?',
                value: '',
                required: true,
                order: 1,
                authorizedUser:'admin'
            },
            {
                controlType: 'textbox',
                key: 'emailAddress',
                label: 'What is your Email id ?',
                value:'',
                type: 'email',
                order: 2,
                authorizedUser:'admin'
            },
            {
                controlType: 'textarea',
                key: 'otherDetails',
                label: 'Other Details',
                order: 4,
                value:'',
                authorizedUser:'admin'
            },
            {
                controlType: 'checkbox',
                key: 'CheckboxInput',
                label: 'Choose your options',
                options: [
                    { key: 'option1', checked: true, value: 'Option1' },
                    { key: 'option2',checked: false, value: 'Option2' },
                    { key: 'option3', checked: true, value: 'Option3' },
                ],
                order: 5,
                authorizedUser:'uploader'
            },
            {
                controlType: 'dropdown',
                key: 'country',
                label: 'Country?',
                options: [
                    { key: 'India',checked: true, value: 'India' },
                    { key: 'USA', value: 'USA' },
                    { key: 'UK', value: 'UK' },
                    { key: 'Other', value: 'Other' },
                ],
                order: 6,
                authorizedUser:'admin'
            },
            {
                controlType: 'textbox',
                key: 'age',
                label: 'What is your Age?',
                value: '',
                required: true,
                order: 7
            },
            {
                controlType: 'textarea',
                key: 'history',
                label: 'Do you have any medical history ?',
                value:'',
                type: 'textarea',
                order: 8,
                authorizedUser:'uploader'
            },
            {
                controlType: 'textarea',
                type: 'textarea',
                key: 'medicationHistory',
                label: 'Medication History',
                order: 9,
                value:'',
                authorizedUser:'uploader'
            },
            {
                controlType: 'radio',
                type:'radio',
                key: 'alcoholic',
                label: 'Are you alcoholic?',
                options: [
                    { key: 'no', name:'alcoholic', checked: true, value: 'No' },
                    { key: 'yes', name:'alcoholic', checked: false, value: 'Yes' },
                    { key: 'occasional',name:'alcoholic', checked: true, value: 'Occasional' },
                ],
                order: 10,
                authorizedUser:'admin'
            },
            {
                controlType: 'textarea',
                key: 'medicacommentstionHistory',
                label: 'Comments',
                order: 11,
                value:'',
                authorizedUser:'admin'
            },
        ];

        return of(questions.sort((a, b) => a.order - b.order));
    }
}


