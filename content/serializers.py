from rest_framework import serializers
from .models import Article, Category, Tag, Resource


class CategorySerializer(serializers.ModelSerializer):
    articles_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "articles_count", "created_at"]

    def get_articles_count(self, obj):
        return obj.articles.filter(status='published').count()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name", "slug"]


class ArticleListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.email", read_only=True)
    featured_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "excerpt", "category", "tags",
            "author_name", "featured_image", "is_verified",
            "views_count", "published_at", "created_at"
        ]


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    author_name = serializers.CharField(source="author.email", read_only=True)
    reviewed_by_name = serializers.CharField(source="reviewed_by.email", read_only=True)
    featured_image = serializers.ImageField(read_only=True)

    class Meta:
        model = Article
        fields = [
            "id", "title", "slug", "content", "excerpt", "category", "tags",
            "author_name", "is_verified", "reviewed_by_name", "featured_image",
            "source_url", "views_count", "published_at", "created_at", "updated_at"
        ]


class ResourceSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Resource
        fields = [
            "id", "title", "description", "resource_type", "file_url",
            "category", "tags", "downloads_count", "created_at"
        ]
