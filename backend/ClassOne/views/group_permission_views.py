from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth.models import Group
from ..serializers import GroupPermissionsSerializer

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

class GroupPermissionsViewSet(viewsets.ModelViewSet):
    queryset = Group.permissions.through.objects.all()
    serializer_class = GroupPermissionsSerializer
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
            return Response({"message": "Error listing group permissions", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception:
            return Response({"message": "No content", "error": ""}, status=status.HTTP_204_NO_CONTENT)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                self.perform_create(serializer)
                return Response({"message": "Group permission created successfully", "data": serializer.data}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"message": "Error creating group permission", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            try:
                self.perform_update(serializer)
                return Response({"message": "Group permission updated successfully", "data": serializer.data}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"message": "Error updating group permission", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "Validation error", "errors": serializer.errors}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            instance.delete()
            return Response({"message": "Group permission deleted successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Delete group permission error", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)