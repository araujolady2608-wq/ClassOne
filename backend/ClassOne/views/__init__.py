from .city_views import CityViewSet
from .person_views import PersonViewSet
from .state_views import StateViewSet
from .teachers_views import TeachersViewSet
from .school_administrator_views import SchoolAdministratorViewSet
from .phone_views import PhoneViewSet
from .address_views import AddressViewSet
from .subject_views import SubjectViewSet
from .course_views import CourseViewSet
from .schedule_views import ScheduleViewSet
from .class_time_views import ClassTimeViewSet
from .teacher_has_subject_views import TeacherHasSubjectViewSet
from .absence_views import AbsenceViewSet
from .availability_views import AvailabilityViewSet
from .replacement_views import ReplacementViewSet
from .type_absence_views import TypeAbsenceViewSet

# La vista personalizada de autenticación/recuperación de contraseña
from .auth_views import CustomPasswordResetView

# Nuevos controladores de Auth y RBAC (cada uno en su propio archivo)
from .User_Views import UserViewSet 
from .group_views import GroupViewSet
from .permission_views import PermissionViewSet  
from .user_group_views import UserGroupsViewSet
from .group_permission_views import GroupPermissionsViewSet
from .user_permission_views import UserUserPermissionsViewSet

