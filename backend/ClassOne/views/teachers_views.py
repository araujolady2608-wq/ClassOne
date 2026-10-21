from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import Teacher
from ..serializers import TeacherSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class TeachersViewSet(viewsets.ModelViewSet):
    """
    Controlador independiente para la tabla Teachers con Paginación,
    Index, Show, Create, Update y Delete lógico.
    """
    queryset = Teacher.objects.filter(is_active=True)
    serializer_class = TeacherSerializer
    pagination_class = StandardResultsSetPagination

    # 1. INDEX (Listar todos los profesores activos) - HTTP 200
    def list(self, request, *args, **kwargs):
        try:
            queryset = self.get_queryset()
            page = self.paginate_queryset(queryset)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Error listing teachers", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 2. SHOW (Buscar profesor por ID) - HTTP 200 o HTTP 404 (si no existe)
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Teacher.DoesNotExist:
            return Response({"message": "Teacher not found", "error": "El profesor solicitado no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Error retrieving teacher", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 3. STORE / CREATE (Crear profesor) - HTTP 201, 400 (Validación) o 500
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response({"message": "Teacher created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Error creating teacher", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # 4. UPDATE (Actualizar profesor) - HTTP 200, 400 o 500
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        try:
            instance = self.get_object()
        except Teacher.DoesNotExist:
            return Response({"message": "Teacher not found", "error": "El profesor a actualizar no existe."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response({"message": "Teacher updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Error updating teacher", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # 5. DELETE (Borrado Lógico) - Cambia is_active a False - HTTP 200 o 404 / 500
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return Response({"message": "Teacher deleted (logical)", "data": {}}, status=status.HTTP_200_OK)
        except Teacher.DoesNotExist:
            return Response({"message": "Teacher not found", "error": "El profesor a eliminar no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Delete teacher error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)