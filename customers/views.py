#from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Student
from .serializers import StudentSerializer

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def students_api(request):
    """
    Single endpoint: /api/students/
    - GET    -> list all OR ?id=<id> to get single
    - POST   -> create
    - PUT    -> update (use ?id= or include "id" in JSON)
    - DELETE -> delete (use ?id= or include "id" in JSON)
    """
    # prefer query param, fallback to body
    id_param = request.query_params.get('id') or request.data.get('id')

    # ---------- GET ----------
    if request.method == 'GET':
        if id_param:
            try:
                student = Student.objects.get(pk=int(id_param))
            except Student.DoesNotExist:
                return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = StudentSerializer(student)
            return Response(serializer.data)
        students = Student.objects.all().order_by('-id')
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)

    # ---------- POST ----------
    if request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- PUT ----------
    if request.method == 'PUT':
        if not id_param:
            return Response({'detail': 'id is required for update'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = Student.objects.get(pk=int(id_param))
        except Student.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = StudentSerializer(student, data=request.data, partial=True)  # partial allows partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # ---------- DELETE ----------
    if request.method == 'DELETE':
        if not id_param:
            return Response({'detail': 'id is required for delete'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            student = Student.objects.get(pk=int(id_param))
        except Student.DoesNotExist:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        student.delete()
        return Response({'detail': 'deleted'}, status=status.HTTP_200_OK)
