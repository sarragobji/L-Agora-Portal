from rest_framework import status, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404

from .models import Publication, Reaction, Category, Tag, Signalement, ReactType
from .serializers import (
    PublicationSerializer, ReactionSerializer,
    CategorySerializer, TagSerializer, SignalementSerializer
)


class PublicationViewSet(viewsets.ModelViewSet):
    """
    CRUD + react + report + unreact actions for publications.
    GET    /publications/          → list all
    POST   /publications/          → create
    GET    /publications/{id}/     → retrieve
    PUT    /publications/{id}/     → full update
    PATCH  /publications/{id}/     → partial update
    DELETE /publications/{id}/     → delete
    POST   /publications/{id}/react/    → add/update reaction
    DELETE /publications/{id}/unreact/  → remove reaction
    POST   /publications/{id}/report/   → report publication
    GET    /publications/{id}/reactions/→ list reactions on a post
    """
    queryset = Publication.objects.all().order_by('-pub_date')
    serializer_class = PublicationSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['description', 'category__category_name', 'tags__tag_name']
    ordering_fields = ['pub_date']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'reactions']:
            return []  # public read
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = Publication.objects.all().order_by('-pub_date')

        # Filter by category
        category_id = self.request.query_params.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)

        # Filter by tag
        tag_id = self.request.query_params.get('tag')
        if tag_id:
            qs = qs.filter(tags__id=tag_id)

        # Filter by user
        user_id = self.request.query_params.get('user')
        if user_id:
            qs = qs.filter(user_id=user_id)

        return qs.distinct()

    # ------------------------------------------------------------------ #
    #  CREATE  POST /publications/                                         #
    # ------------------------------------------------------------------ #
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Attach the authenticated user automatically
        publication = serializer.save(user=request.user)

        return Response(
            PublicationSerializer(publication).data,
            status=status.HTTP_201_CREATED
        )

    # ------------------------------------------------------------------ #
    #  UPDATE  PUT/PATCH /publications/{id}/                              #
    # ------------------------------------------------------------------ #
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        publication = self.get_object()

        # Only the author can edit
        if publication.user != request.user:
            return Response(
                {'detail': 'You do not have permission to edit this post.'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(publication, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    # ------------------------------------------------------------------ #
    #  DELETE  DELETE /publications/{id}/                                 #
    # ------------------------------------------------------------------ #
    def destroy(self, request, *args, **kwargs):
        publication = self.get_object()

        # Only the author (or admin) can delete
        if publication.user != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'You do not have permission to delete this post.'},
                status=status.HTTP_403_FORBIDDEN
            )

        publication.delete()
        return Response(
            {'detail': 'Publication deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )

    # ------------------------------------------------------------------ #
    #  REACT   POST /publications/{id}/react/                             #
    # ------------------------------------------------------------------ #
    @action(detail=True, methods=['post'], url_path='react')
    def react(self, request, pk=None):
        publication = self.get_object()
        react_type = request.data.get('react_type')

        if not react_type:
            return Response(
                {'detail': 'react_type is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if react_type not in ReactType.values:
            return Response(
                {'detail': f'Invalid react_type. Choices: {ReactType.values}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reaction, created = Reaction.objects.update_or_create(
            user=request.user,
            publication=publication,
            defaults={'react_type': react_type}
        )
        serializer = ReactionSerializer(reaction)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )

    # ------------------------------------------------------------------ #
    #  UNREACT  DELETE /publications/{id}/unreact/                        #
    # ------------------------------------------------------------------ #
    @action(detail=True, methods=['delete'], url_path='unreact')
    def unreact(self, request, pk=None):
        publication = self.get_object()

        deleted, _ = Reaction.objects.filter(
            user=request.user,
            publication=publication
        ).delete()

        if not deleted:
            return Response(
                {'detail': 'No reaction found to remove.'},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {'detail': 'Reaction removed.'},
            status=status.HTTP_204_NO_CONTENT
        )

    # ------------------------------------------------------------------ #
    #  REPORT  POST /publications/{id}/report/                            #
    # ------------------------------------------------------------------ #
    @action(detail=True, methods=['post'], url_path='report')
    def report(self, request, pk=None):
        publication = self.get_object()
        reason = request.data.get('reason')

        if not reason:
            return Response(
                {'detail': 'reason is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Prevent duplicate reports from the same user
        already_reported = Signalement.objects.filter(
            user=request.user,
            publication=publication
        ).exists()

        if already_reported:
            return Response(
                {'detail': 'You have already reported this publication.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        signalement = Signalement.objects.create(
            user=request.user,
            publication=publication,
            reason=reason
        )
        serializer = SignalementSerializer(signalement)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ------------------------------------------------------------------ #
    #  LIST REACTIONS  GET /publications/{id}/reactions/                  #
    # ------------------------------------------------------------------ #
    @action(detail=True, methods=['get'], url_path='reactions')
    def reactions(self, request, pk=None):
        publication = self.get_object()
        reactions = Reaction.objects.filter(publication=publication)
        serializer = ReactionSerializer(reactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# ------------------------------------------------------------------ #
#  Other ViewSets                                                      #
# ------------------------------------------------------------------ #

class ReactionViewSet(viewsets.ModelViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['category_name']


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['tag_name']


class SignalementViewSet(viewsets.ModelViewSet):
    queryset = Signalement.objects.all()
    serializer_class = SignalementSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        # Admins see all; regular users only see their own reports
        if not self.request.user.is_staff:
            qs = qs.filter(user=self.request.user)
        return qs