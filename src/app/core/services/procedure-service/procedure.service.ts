import { Procedure } from './../../models/procedure.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Annotation, DeleteAnnotation } from '../../models/annotations.model';
import jwt_decode from 'jwt-decode';
import { User } from '../../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param procedureId : procedure id
   */
  getProcedure(procedureId: string, user: User): Observable<Procedure> {
    const url = `/procedure/${procedureId}`;
    return this.http.get<Procedure>(url);
  }

  /**
   * @returns procedures: array of all procedure
   */
  getAllProcedures(user: User): Observable<Procedure[]> {
    const url = `/procedure`;

    const studyList = Object.keys(JSON.parse(user.selectedRole));

    return this.http.put<Procedure[]>(url, studyList);
  }

  /**
   * @param procedureId : procedure id
   * @param videoId : video id
   * @param annotationId : annotation to e deleted
   */
  deleteAnnotation(
    procedureId: string,
    videoId: string,
    annotationId: string
  ): Observable<DeleteAnnotation> {
    const url = `/procedure/deleteAnnotation/${procedureId}/${videoId}/${annotationId}`;
    return this.http.delete<DeleteAnnotation>(url);
  }

  /**
   * @param annotationList : updated annotation list
   * @param procedureId : procedure id
   */
  updateAnnotationList(
    procedureId: string,
    videoId: string,
    annotationList: Annotation[]
  ): Observable<Procedure> {
    const url = `/procedure/updateAnnotation/${videoId}/${procedureId}`;
    return this.http.patch<Procedure>(url, annotationList);
  }

  createProcedure(formData: any): Observable<any> {
    const url = `/procedure/add-procedure`;
    let headers = new HttpHeaders();
    //this is the important step. You need to set content type as null
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    return this.http.post(url, formData);
  }
}
