import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { StudentsComponent } from './app/students/students.component';

bootstrapApplication(StudentsComponent, {
  providers: [provideHttpClient()]
}).catch(err => console.error(err));
