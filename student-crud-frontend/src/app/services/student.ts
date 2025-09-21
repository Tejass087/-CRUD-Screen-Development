import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define Student model (same fields as Django serializer)
export interface Student {
  id?: number;            // optional (auto-generated)
  student_name: string;
  city: string;
  address: string;
  birth_date: string;     // ISO date string: "2000-01-01"
  is_active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = 'http://127.0.0.1:8000/api/students/';

  constructor(private http: HttpClient) {}

  // GET all students
  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(this.apiUrl);
  }

  // GET student by id
  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}?id=${id}`);
  }

  // POST create new student
  createStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.apiUrl, student);
  }

  // PUT update student
  updateStudent(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}?id=${student.id}`, student);
  }

  // DELETE student
  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}?id=${id}`);
  }
}
