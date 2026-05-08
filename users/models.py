from django.db import models
from django.contrib.auth.models import AbstractUser

class Role(models.Model):
    role_name = models.CharField(max_length=100)

    def __str__(self):
        return self.role_name

class Utilisateur(AbstractUser):
    # AbstractUser already has username, email, password, etc.
    pseudonyme = models.CharField(max_length=100, unique=True)
    point_solidaire = models.IntegerField(default=0)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)

class Profile(models.Model):
    user = models.OneToOneField(Utilisateur, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='profiles/', null=True, blank=True)

class Notification(models.Model):
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)