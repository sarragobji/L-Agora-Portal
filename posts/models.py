from django.db import models

from users.models import Utilisateur


class Category(models.Model):
    category_name = models.CharField(max_length=100)
    class Meta:
        db_table = 'categories'

class Tag(models.Model):
    tag_name = models.CharField(max_length=50)
    class Meta:
        db_table = 'tags'

class Publication(models.Model):
    description = models.TextField()
    pub_date = models.DateTimeField(auto_now_add=True)
    is_anonyme = models.BooleanField(default=False)
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE , related_name='created_publications')
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    tags = models.ManyToManyField(Tag)
    utilisateur = models.ManyToManyField(Utilisateur, through='Reaction', related_name='reactions')
    class Meta:
        db_table = 'publications'
    

class Reaction(models.Model):
    react_type = models.CharField(max_length=50) # e.g., Like, Love, etc.
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    class Meta:
        db_table = 'reactions'
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'publication'], 
                name='composite_reaction_pk'
            )
        ]

class Signalement(models.Model):
    reason = models.TextField()
    date_sig = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, default='Pending')
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    publication = models.ForeignKey(Publication, on_delete=models.CASCADE)
    class Meta:
        db_table = 'signalements'