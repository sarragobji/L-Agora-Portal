from django.db import models
from django.conf import settings # To refer to your custom User

class Category(models.Model):
    category_name = models.CharField(max_length=100)

class Tag(models.Model):
    tag_name = models.CharField(max_length=50)

class Publication(models.Model):
    description = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
    is_anonyme = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    tags = models.ManyToManyField(Tag)

class Reaction(models.Model):
    react_type = models.CharField(max_length=50) # e.g., Like, Love, etc.
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)

class Signalement(models.Model):
    reason = models.TextField()
    date_sig = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)