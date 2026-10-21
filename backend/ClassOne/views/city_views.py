from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import City
from ..serializers import CitySerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 30
    page_size_query_param = 'page_size'
    max_page_size = 100

class CityViewSet(viewsets.ModelViewSet):
    """
    Controlador independiente para la tabla City con Paginación,
    Index, Show, Create, Update y Delete lógico.
    """
    queryset = City.objects.filter(is_active=True)
    serializer_class = CitySerializer
    pagination_class = StandardResultsSetPagination  # <-- Paginación aplicada

    # 1. INDEX (Listar todas las ciudades activas de forma paginada) - HTTP 200
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
            return Response({"message": "Error listing cities", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 2. SHOW (Buscar ciudad por ID) - HTTP 200 o HTTP 404 (si no existe)
    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except City.DoesNotExist:
            return Response({"message": "City not found", "error": "La ciudad solicitada no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Error retrieving city", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 3. STORE / CREATE (Crear ciudad) - HTTP 201, 400 (Validación) o 500
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response({"message": "City created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Error creating city", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # 4. UPDATE (Actualizar ciudad) - HTTP 200, 400 o 500
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        try:
            instance = self.get_object()
        except City.DoesNotExist:
            return Response({"message": "City not found", "error": "La ciudad a actualizar no existe."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        
        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response({"message": "City updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Error updating city", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    # 5. DELETE (Borrado Lógico) - Cambia is_active a False (HTTP 200 o HTTP 404 / 500)
    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return Response({"message": "City deleted (logical)", "data": {}}, status=status.HTTP_200_OK)
        except City.DoesNotExist:
            return Response({"message": "City not found", "error": "La ciudad a eliminar no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Delete city error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)