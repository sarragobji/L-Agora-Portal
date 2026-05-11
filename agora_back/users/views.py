from django.shortcuts import render
from rest_framework import viewsets
from .models import Utilisateur, Notification   
from .serializers import UtilisateurSerializer, NotificationSerializer

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer

