
from django.contrib import admin
from django.urls import include, path
from users.views import NotificationViewSet, UtilisateurViewSet
from posts.views import CategoryViewSet, PublicationViewSet, ReactionViewSet, SignalementViewSet, TagViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'publications', PublicationViewSet)
router.register(r'reactions', ReactionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'signalements', SignalementViewSet)  
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'notifications', NotificationViewSet)   
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
]
