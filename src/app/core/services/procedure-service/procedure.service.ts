import { Procedure } from './../../models/procedure.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProcedureService {
  constructor(private http: HttpClient) {}

  getProcedure(): Observable<Procedure> {
    const url = 'assets/json/procedure.json';
    return this.http.get<Procedure>(url);
  }
}
