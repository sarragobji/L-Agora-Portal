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
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)

        if user is not None:
            return Response({"ok": True})
        return Response({"ok": False})

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

