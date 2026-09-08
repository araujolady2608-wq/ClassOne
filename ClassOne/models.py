from django.db import models

# Enum

class RoleStaff(models.TextChoices):
    COORDINADOR = 'Coordinador', 'Coordinador'
    RECTOR = 'Rector', 'Rector'

class AreaChoices(models.TextChoices):
    CIENCIAS_NATURALES = 'Ciencias Naturales', 'Ciencias Naturales'
    CIENCIAS_SOCIALES = 'Ciencias Sociales', 'Ciencias Sociales'
    MATEMATICAS = 'Matemáticas', 'Matemáticas'
    ARTISTICA = 'Artística', 'Artística'
    ESPANOL = 'Español', 'Español'
    INGLES = 'Ingles', 'Ingles'
    TECNOLOGIA = 'Tecnología e Informática', 'Tecnología e Informática'
    CIENCIAS_POLITICAS = 'Ciencias Políticas', 'Ciencias Políticas'
    FILOSOFIA = 'Filosofía', 'Filosofía'
    RELIGION = 'Religión', 'Religión'
    ETICA = 'Ética', 'Ética'
    EDUCACION_FISICA = 'Educación Física', 'Educación Física'

class GradeChoices(models.TextChoices):
    SEXTO = 'Sexto', 'Sexto'
    SEPTIMO = 'Séptimo', 'Séptimo'
    OCTAVO = 'Octavo', 'Octavo'
    NOVENO = 'Noveno', 'Noveno'
    DECIMO = 'Décimo', 'Décimo'
    ONCE = 'Once', 'Once'

class SectionChoices(models.TextChoices):
    ONE = '1', '1'
    TWO = '2', '2'
    THREE = '3', '3'
    FOUR = '4', '4'
    FIVE = '5', '5'

class TypePhoneChoices(models.TextChoices):
    CELULAR = 'Celular', 'Celular'
    TRABAJO = 'Trabajo', 'Trabajo'

class ApplicationStatusChoices(models.TextChoices):
    PENDIENTE = 'Pendiente', 'Pendiente'
    APROBADA = 'Aprobada', 'Aprobada'
    RECHAZADA = 'Rechazada', 'Rechazada'

class DayWeekChoices(models.TextChoices):
    LUNES = 'Lunes', 'Lunes'
    MARTES = 'Martes', 'Martes'
    MIERCOLES = 'Miércoles', 'Miércoles'
    JUEVES = 'Jueves', 'Jueves'
    VIERNES = 'Viernes', 'Viernes'
    SABADO = 'Sábado', 'Sábado'
    DOMINGO = 'Domingo', 'Domingo'

class StateSiNoChoices(models.TextChoices):
    SI = 'Si', 'Si'
    NO = 'No', 'No'

class StateReplacementsChoices(models.TextChoices):
    EN_PROCESO = 'En Proceso', 'En Proceso'
    COMPLETADO = 'Completado', 'Completado'


# Tablas

class State(models.Model):
    name_state = models.CharField(max_length=100)
    code = models.CharField(max_length=10)

    class Meta:
        db_table = 'state'

    def __str__(self):
        return self.name_state


class City(models.Model):
    name_city = models.CharField(max_length=80)
    state = models.ForeignKey(State, on_delete=models.CASCADE, db_column='state_id')

    class Meta:
        db_table = 'cities'

    def __str__(self):
        return self.name_city


class Subject(models.Model):
    name_subject = models.CharField(max_length=100)

    class Meta:
        db_table = 'subject'

    def __str__(self):
        return self.name_subject


class TypeAbsence(models.Model):
    type = models.CharField(max_length=50)

    class Meta:
        db_table = 'type_absences'

    def __str__(self):
        return self.type


class ClassTime(models.Model):
    start_time = models.TimeField()
    final_time = models.TimeField()
    period_number = models.IntegerField()

    class Meta:
        db_table = 'class_time'


class Course(models.Model):
    grade = models.CharField(max_length=20, choices=GradeChoices.choices)
    section = models.CharField(max_length=5, choices=SectionChoices.choices)
    classroom = models.CharField(max_length=5)

    class Meta:
        db_table = 'courses'


class Person(models.Model):
    dni = models.CharField(max_length=10, unique=True)
    name1 = models.CharField(max_length=20)
    name2 = models.CharField(max_length=20, blank=True, null=True)
    last_name1 = models.CharField(max_length=20)
    last_name2 = models.CharField(max_length=20, blank=True, null=True)
    email = models.CharField(max_length=70, unique=True, blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, db_column='city_id', blank=True, null=True)

    class Meta:
        db_table = 'person'

    def __str__(self):
        return f"{self.name1} {self.last_name1} ({self.dni})"


class Teacher(models.Model):
    person = models.OneToOneField(Person, on_delete=models.CASCADE, db_column='person_id', unique=True)

    class Meta:
        db_table = 'teachers'

    def __str__(self):
        return f"Prof. {self.person.name1} {self.person.last_name1}"


class SchoolAdministrator(models.Model):
    role = models.CharField(max_length=50, choices=RoleStaff.choices)
    person = models.OneToOneField(Person, on_delete=models.CASCADE, db_column='person_id', unique=True)

    class Meta:
        db_table = 'school_administrators'

    def __str__(self):
        return f"{self.role}: {self.person.name1} {self.person.last_name1}"


class Phone(models.Model):
    number = models.CharField(max_length=15)
    type_phone = models.CharField(max_length=20, choices=TypePhoneChoices.choices)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, db_column='person_id')

    class Meta:
        db_table = 'phones'


class Address(models.Model):
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    street = models.CharField(max_length=20)
    number = models.CharField(max_length=6)
    person = models.ForeignKey(Person, on_delete=models.CASCADE, db_column='person_id')

    class Meta:
        db_table = 'addresses'


class TeacherHasSubject(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, db_column='teacher_id')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, db_column='subject_id')
    area = models.CharField(max_length=50, choices=AreaChoices.choices)

    class Meta:
        db_table = 'teachers_has_subject'


class Absence(models.Model):
    start_date = models.DateField()
    final_date = models.DateField()
    application_status = models.CharField(max_length=20, choices=ApplicationStatusChoices.choices)
    document = models.CharField(max_length=255, blank=True, null=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, db_column='teacher_id')
    type_absences = models.ForeignKey(TypeAbsence, on_delete=models.CASCADE, db_column='type_absences_id')

    class Meta:
        db_table = 'absences'


class Availability(models.Model):
    day_week = models.CharField(max_length=20, choices=DayWeekChoices.choices)
    state = models.CharField(max_length=5, choices=StateSiNoChoices.choices)
    absences = models.ForeignKey(Absence, on_delete=models.CASCADE, db_column='absences_id')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, db_column='teacher_id')

    class Meta:
        db_table  = 'availability'


class Schedule(models.Model):
    day_week = models.CharField(max_length=20, choices=DayWeekChoices.choices)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, db_column='course_id')
    classtime = models.ForeignKey(ClassTime, on_delete=models.CASCADE, db_column='classtime_id')
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, db_column='teacher_id')

    class Meta:
        db_table = 'schedules'


class Replacement(models.Model):
    assignment_date = models.DateField()
    state = models.CharField(max_length=20, choices=StateReplacementsChoices.choices)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, db_column='schedule_id')
    availability = models.ForeignKey(Availability, on_delete=models.CASCADE, db_column='availability_id')
    absences = models.ForeignKey(Absence, on_delete=models.CASCADE, db_column='absences_id')

    class Meta:
        db_table = 'replacements'