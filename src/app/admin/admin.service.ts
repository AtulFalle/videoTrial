
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const baseUrl = 'https://biogenbackendapi.azurewebsites.net/';
@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}



  updateUserStatus(objectId: string, selectedRole: any): Observable<any[]> {
    const url = `${baseUrl}updateAccountStatusById?objectId=${objectId}`;
    return this.http.patch<any[]>(url,selectedRole);
  }
  getAllUsers(): Observable<any[]> {
    const url = `${baseUrl}filterUsersByAccountStatus?reqStatus=false`;
    return this.http.get<any[]>(url);
  }
  getAllRoles(): Observable<any[]> {
    const url = `${baseUrl}roles`;
    return this.http.post<any[]>(url,{});
  }

}
