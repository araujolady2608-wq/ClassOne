from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator
from django.utils.translation import gettext as _

class CustomPasswordResetView(APIView):
    """
    Vista personalizada basada en APIView para manejar la recuperación de contraseña
    de forma limpia y lista para probarse mediante clientes API (como Thunder Client o Postman).[cite: 27]
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request, *args, **kwargs):
        try:
            # Usamos el formulario interno de Django para validar el correo electrónico[cite: 27]
            form = PasswordResetForm(request.data)
            
            if form.is_valid():
                # Opciones para el envío del correo de recuperación[cite: 27]
                opts = {
                    'use_https': request.is_secure(),
                    'token_generator': default_token_generator,
                    'from_email': None,
                    'email_template_name': 'registration/password_reset_email.html',
                    'subject_template_name': 'registration/password_reset_subject.txt',
                    'request': request,
                    'html_email_template_name': None,
                }
                form.save(**opts)
                
                return Response(
                    {"message": _("Password reset e-mail has been sent.")}, 
                    status=status.HTTP_200_OK
                )
            
            # Si el correo no es válido o hay errores en los campos
            return Response(
                {"message": "Validation error", "errors": form.errors}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        except Exception as e:
            return Response(
                {"message": "Internal server error", "error": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )