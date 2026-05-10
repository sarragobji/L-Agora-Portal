from django.contrib import admin
from django.urls import include, path
from posts.views import PublicationViewSet
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'publications', PublicationViewSet)
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
