import { Component, OnInit } from '@angular/core';
import { StudentService, Student } from '../services/student';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  students: Student[] = [];

  newStudent: Student = {
    student_name: '',
    city: '',
    address: '',
    birth_date: '',
    is_active: true
  };

  selectedStudentId: number | null = null;
  formErrors: string = '';

  cities: string[] = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Chennai'];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (data) => this.students = data,
      error: (err) => console.error(err)
    });
  }

  addStudent(form?: NgForm) {
    this.formErrors = '';

    if (!this.newStudent.student_name.trim() ||
        !this.newStudent.city.trim() ||
        !this.newStudent.address.trim() ||
        !this.newStudent.birth_date) {
      this.formErrors = 'All fields except Active are required.';
      return;
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(this.newStudent.birth_date)) {
      this.formErrors = 'Birth Date must be in YYYY-MM-DD format.';
      return;
    }

    if (this.selectedStudentId) {
      this.studentService.updateStudent({ ...this.newStudent, id: this.selectedStudentId })
        .subscribe({
          next: () => {
            this.resetFields(form);
            this.loadStudents();
          },
          error: () => this.formErrors = 'Failed to update student. Try again.'
        });
    } else {
      this.studentService.createStudent(this.newStudent)
        .subscribe({
          next: () => {
            this.resetFields(form);
            this.loadStudents();
          },
          error: () => this.formErrors = 'Failed to create student. Try again.'
        });
    }
  }

  editStudent(student: Student) {
    this.selectedStudentId = student.id || null;
    this.newStudent = { ...student };
  }

  deleteStudent(id: number) {
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        next: () => this.loadStudents(),
        error: () => this.formErrors = 'Failed to delete student. Try again.'
      });
    }
  }

  // Reset: clears form fields only
  resetFields(form?: NgForm) {
    this.newStudent = {
      student_name: '',
      city: '',
      address: '',
      birth_date: '',
      is_active: true
    };
    this.formErrors = '';
    form?.resetForm(this.newStudent);
  }

  // Cancel: exit form / reset selection
  cancelForm(form?: NgForm) {
    this.resetFields(form);
    this.selectedStudentId = null;
    // Optionally hide the form if you want
  }
}
