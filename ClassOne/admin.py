from django.contrib import admin
from .models import State, City, Person, Teacher, SchoolAdministrator

@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_state', 'code')
    search_fields = ('name_state', 'code')

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name_city', 'state')
    search_fields = ('name_city',)
    list_filter = ('state',)

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('dni', 'name1', 'last_name1', 'email', 'city')
    search_fields = ('dni', 'name1', 'last_name1', 'email')
    list_filter = ('city',)

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'person')
    search_fields = ('person__name1', 'person__last_name1', 'person__dni')

@admin.register(SchoolAdministrator)
class SchoolAdministratorAdmin(admin.ModelAdmin):
    list_display = ('id', 'person', 'role')
    list_filter = ('role',)
    search_fields = ('person__name1', 'person__last_name1', 'role')