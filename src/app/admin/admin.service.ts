import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  constructor(private http: HttpClient) {}

  updateUserStatus(objectId: string, selectedRole: any): Observable<any[]> {
    const url = `https://biogenbackendapi.azurewebsites.net/updateAccountStatusById?objectId=${objectId}`;
    return this.http.patch<any[]>(url, selectedRole);
  }
  getAllUsers(): Observable<any[]> {
    const url = `https://biogenbackendapi.azurewebsites.net/filterUsersByAccountStatus?reqStatus=false`;
    const headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
    return this.http.get<any[]>(url, { headers: headers });
  }
}
