from django.db import models

class Student(models.Model):
    student_name = models.CharField(max_length=100)  # varchar(100)
    city = models.CharField(max_length=100)          # varchar(100)
    address = models.TextField()                     # Text area
    birth_date = models.DateField()                  # Date field
    is_active = models.BooleanField(default=True)   # Boolean field

    def __str__(self):
        return self.student_name
