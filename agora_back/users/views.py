from rest_framework.decorators import action
from rest_framework import viewsets
from .models import Utilisateur, Notification   
from .serializers import UtilisateurSerializer, NotificationSerializer
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def check_login(self, request):
        email = request.data.get('email')
        pwd = request.data.get('password')
        try:
            
            user_exists = Utilisateur.objects.filter(
                email=email, 
                password=pwd
            ).exists()

            if user_exists:
                return Response({"ok": True})
            else:
                return Response({"ok": False})
                
        except Exception:
            return Response({"ok": False, "error": "Server error"}, status=500)
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def update_user (self, request):
        email = request.data.get('email')
        new_email = request.data.get('new_email')
        new_password = request.data.get('new_password')
        new_first_name = request.data.get('new_first_name')
        new_last_name = request.data.get('new_last_name')
        new_pseudonyme = request.data.get('new_pseudonyme')

        try:
            user = Utilisateur.objects.filter(email=email).first()
            if user:
                if new_email:
                    user.email = new_email
                if new_password:
                    user.password = new_password
                if new_first_name:
                    user.first_name = new_first_name
                if new_last_name:
                    user.last_name = new_last_name
                if new_pseudonyme:
                    user.pseudonyme = new_pseudonyme
                user.save()
                return Response({"ok": True})
            else:
                return Response({"ok": False, "error": "User not found"}, status=404)
        except Exception:
            return Response({"ok": False, "error": "Server error"}, status=500)
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

