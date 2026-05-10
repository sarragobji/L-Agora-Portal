from django.contrib import admin
from django.urls import include, path
from posts.views import CategoryViewSet, PublicationViewSet, ReactionViewSet, SignalementViewSet, TagViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'publications', PublicationViewSet)
router.register(r'reactions', ReactionViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'tags', TagViewSet)
router.register(r'signalements', SignalementViewSet)        
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
