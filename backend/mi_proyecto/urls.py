from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Importaciones SWAGGER 
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Importar todo desde ClassOne.views
from ClassOne.views import (
    StateViewSet, CityViewSet, SubjectViewSet, TypeAbsenceViewSet,
    ClassTimeViewSet, CourseViewSet, PersonViewSet, TeachersViewSet,
    SchoolAdministratorViewSet, PhoneViewSet, AddressViewSet,
    TeacherHasSubjectViewSet, AbsenceViewSet, AvailabilityViewSet,
    ScheduleViewSet, ReplacementViewSet, UserViewSet, GroupViewSet, PermissionViewSet,
    UserGroupsViewSet, GroupPermissionsViewSet, UserUserPermissionsViewSet,
    CustomPasswordResetView
)

# Importar Dashboard
from ClassOne.views.dashboard_views import dashboard_stats

# Configuración SWAGGER 
schema_view = get_schema_view(
   openapi.Info(
      title="ClassOne API",
      default_version='v1',
      description="Documentación oficial de la API del proyecto ClassOne",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@classone.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'states', StateViewSet)
router.register(r'cities', CityViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'type-absences', TypeAbsenceViewSet)
router.register(r'class-times', ClassTimeViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'persons', PersonViewSet)
router.register(r'teachers', TeachersViewSet)
router.register(r'school-administrators', SchoolAdministratorViewSet)
router.register(r'phones', PhoneViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'teacher-subjects', TeacherHasSubjectViewSet)
router.register(r'absences', AbsenceViewSet)
router.register(r'availabilities', AvailabilityViewSet)
router.register(r'schedules', ScheduleViewSet)
router.register(r'replacements', ReplacementViewSet)

# Endpoints de Auth y RBAC (Las 6 tablas)
router.register(r'auth-users', UserViewSet, basename='auth-users')
router.register(r'auth-groups', GroupViewSet, basename='auth-groups')
router.register(r'auth-permissions', PermissionViewSet, basename='auth-permissions')
router.register(r'auth-user-groups', UserGroupsViewSet, basename='auth-user-groups')
router.register(r'auth-group-permissions', GroupPermissionsViewSet, basename='auth-group-permissions')
router.register(r'auth-user-user-permissions', UserUserPermissionsViewSet, basename='auth-user-user-permissions')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Rutas de los tokens JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Ruta de recuperación de contraseña
    path('api/password_reset/', CustomPasswordResetView.as_view(), name='password_reset'),

    # Ruta Dashboard
    path('api/dashboard-stats/', dashboard_stats, name='dashboard-stats'),
    
    # Rutas secundarias de confirmación estándar de Django
    path('api/password_reset/done/', auth_views.PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('api/reset/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('api/reset/done/', auth_views.PasswordResetCompleteView.as_view(), name='password_reset_complete'),

    # Rutas para visualizar Swagger y ReDoc
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]