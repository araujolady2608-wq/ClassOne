from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

# Importa aquí los modelos que necesites consultar.
# (Ajusta los nombres según cómo los tengas en models.py)
from ..models import Teacher, Subject, Schedule

@api_view(['GET'])
def dashboard_stats(request):
    try:
        # 1. Contamos los datos reales en tu base de datos
        # Usamos filter(is_active=True) respetando tu lógica de borrado lógico
        total_profesores = Teacher.objects.filter(is_active=True).count()
        materias_activas = Subject.objects.filter(is_active=True).count()
        total_bloques = Schedule.objects.filter(is_active=True).count()
        
        # 2. Armamos el diccionario de datos exactamente como lo espera Angular
        dashboard_data = {
            "estadisticas": {
                "profesores": total_profesores,
                "materiasActivas": materias_activas,
                "bloquesAsistencia": total_bloques,
                "cursos": 15  # Lo dejamos fijo por ahora si no tienes modelo de Curso
            },
            "grafica": {
                # Aquí enviaremos las alturas fijas por ahora para que la gráfica no se dañe
                "lun": 100, "mar": 150, "mie": 120, "jue": 180, "vie": 80
            },
            "actividades": [
                { "modulo": "Sistema", "detalle": "Conexión a Django exitosa", "tiempo": "Ahora" }
            ]
        }
        
        # 3. Retornamos la respuesta siguiendo tu estándar de proyecto
        return Response({
            "message": "Dashboard stats retrieved successfully", 
            "data": dashboard_data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            "message": "Error retrieving dashboard stats", 
            "error": str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)