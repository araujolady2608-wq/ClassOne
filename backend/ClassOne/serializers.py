from rest_framework import serializers
from django.contrib.auth.models import User, Group, Permission
from .models import (
    State, City, Subject, TypeAbsence, ClassTime, Course,
    Person, Teacher, SchoolAdministrator, Phone, Address,
    TeacherHasSubject, Absence, Availability, Schedule, Replacement
)


#Tablas ClassOne

class StateSerializer(serializers.ModelSerializer):
    class Meta:
        model = State
        fields = '__all__'

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = '__all__'

class TypeAbsenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeAbsence
        fields = '__all__'

class ClassTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClassTime
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = '__all__'

class SchoolAdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolAdministrator
        fields = '__all__'

class PhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Phone
        fields = '__all__'

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class TeacherHasSubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeacherHasSubject
        fields = '__all__'

class AbsenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Absence
        fields = '__all__'

class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availability
        fields = '__all__'

class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Schedule
        fields = '__all__'

class ReplacementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Replacement
        fields = '__all__'


#RBAC

# Modelos Principales
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'is_staff', 'is_superuser']

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__'

# Tablas Intermedias (n:m)
class UserGroupsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User.groups.through
        fields = '__all__'

class GroupPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group.permissions.through
        fields = '__all__'

class UserUserPermissionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User.user_permissions.through
        fields = '__all__'

