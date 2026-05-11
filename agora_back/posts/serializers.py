
from rest_framework import serializers
from .models import Category, Publication, Reaction, Signalement, Tag

class PublicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publication
        fields = '__all__' 

class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = '__all__'

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class SignalementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Signalement
        fields = '__all__'