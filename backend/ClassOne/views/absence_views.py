from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from ..models import Absence
from ..serializers import AbsenceSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class AbsenceViewSet(viewsets.ModelViewSet):
    queryset = Absence.objects.filter(is_active=True)
    serializer_class = AbsenceSerializer
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
            return Response({"message": "Error listing absences", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Absence.DoesNotExist:
            return Response({"message": "Absence not found", "error": "La ausencia solicitada no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Error retrieving absence", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response({"message": "Absence created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Error creating absence", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        try:
            instance = self.get_object()
        except Absence.DoesNotExist:
            return Response({"message": "Absence not found", "error": "La ausencia a actualizar no existe."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response({"message": "Absence updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Error updating absence", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.is_active = False
            instance.save()
            return Response({"message": "Absence deleted (logical)", "data": {}}, status=status.HTTP_200_OK)
        except Absence.DoesNotExist:
            return Response({"message": "Absence not found", "error": "La ausencia a eliminar no existe."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": "Delete absence error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)