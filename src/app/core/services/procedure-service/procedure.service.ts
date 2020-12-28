import { Procedure } from './../../models/procedure.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Annotation, DeleteAnnotation } from '../../models/annotations.model';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  /**
   *
   * @param procedureId : procedure id
   */
  getProcedure(procedureId: string): Observable<Procedure> {
    const url = `/procedure/${procedureId}`;
    return this.http.get<Procedure>(url);
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
}
