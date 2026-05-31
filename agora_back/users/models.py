from django.db import models
import uuid

class Role(models.Model):
    role_name = models.CharField(max_length=100)

    def __str__(self):
        return self.role_name
    class Meta:
        db_table = 'roles'

class Utilisateur(models.Model):
    pseudonyme = models.CharField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=128)
    email = models.EmailField(null=False, unique=True)
    point_solidaire = models.IntegerField(default=0)
    role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=True)
    create_date = models.DateTimeField(auto_now_add=True)
    update_date = models.DateTimeField(auto_now=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='profiles/', null=True, blank=True)
    class Meta:
        db_table = 'utilisateurs'
    

class Notification(models.Model):   
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    message = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    class Meta:
        db_table = 'notifications'