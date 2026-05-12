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

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

