from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404
from ..models import SchoolAdministrator
from ..serializers import SchoolAdministratorSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class SchoolAdministratorViewSet(viewsets.ModelViewSet):
    queryset = SchoolAdministrator.objects.filter(is_active=True)
    serializer_class = SchoolAdministratorSerializer
    pagination_class = StandardResultsSetPagination

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
            return Response({"message": "Error listing school administrators", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        # Usamos get_object_or_404 para que devuelva automáticamente un 404 si el registro no existe
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except SchoolAdministrator.DoesNotExist:
            return Response({"message": "School administrator not found", "error": "El recurso solicitado no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Error retrieving school administrator", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response({"message": "School administrator created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Error creating school administrator", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Código 400 Bad Request es el estándar en DRF para errores de validación de datos
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        try:
            instance = self.get_object()
        except SchoolAdministrator.DoesNotExist:
            return Response({"message": "School administrator not found", "error": "El registro a actualizar no existe."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response({"message": "School administrator updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Error updating school administrator", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return Response({"message": "School administrator deleted (logical)", "data": {}}, status=status.HTTP_200_OK)
        except SchoolAdministrator.DoesNotExist:
            return Response({"message": "School administrator not found", "error": "El registro a eliminar no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Delete school administrator error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)