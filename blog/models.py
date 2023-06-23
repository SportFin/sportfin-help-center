import datetime
from django import forms
from django.db import models
from django.db.models import Q
from modelcluster.fields import ParentalKey, ParentalManyToManyField
from modelcluster.tags import ClusterTaggableManager
from taggit.models import TaggedItemBase, Tag as TaggitTag
from wagtail.admin.panels import FieldPanel
from wagtail.contrib.routable_page.models import RoutablePageMixin, route
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.snippets.models import register_snippet
from .utils import MarkdownField, MarkdownPanel


class BlogPage(RoutablePageMixin, Page):
    description = models.CharField(
        max_length=255,
        blank=True,
    )
    content_panels = Page.content_panels + [FieldPanel("description", classname="full")]

    def get_context(self, request, *args, **kwargs):
        context = super(BlogPage, self).get_context(request, *args, **kwargs)
        context["posts"] = self.posts
        context["blog_page"] = self
        context["search_type"] = getattr(self, "search_type", "")
        context["search_term"] = getattr(self, "search_term", "")
        return context

    def get_posts(self):
        return PostPage.objects.descendant_of(self).live().order_by("-date")

    @route(r"^$")
    def post_list(self, request, *args, **kwargs):
        self.posts = self.get_posts()
        return Page.serve(self, request, *args, **kwargs)

    # make clicking on a category show all posts in that category
    @route(r"^category/(?P<category>[\w-]+)/$")
    def post_category(self, request, category, *args, **kwargs):
        self.posts = self.get_posts().filter(categories__slug=category)
        self.search_type = "category"
        self.search_term = category
        return Page.serve(self, request, *args, **kwargs)

    @route(r"^tag/(?P<tag>[\w-]+)/$")
    def post_tag(self, request, tag, *args, **kwargs):
        self.posts = self.get_posts().filter(tags=tag)
        self.search_type = "tag"
        self.search_term = tag
        return Page.serve(self, request, *args, **kwargs)

    @route(r"^search/$")
    def post_search(self, request, *args, **kwargs):
        search_query = request.GET.get("q", None)
        self.posts = self.get_posts()
        if search_query:
            self.posts = self.posts.filter(
                Q(body__icontains=search_query)
                | Q(title__icontains=search_query)
                | Q(excerpt__icontains=search_query)
                | Q(categories__name__icontains=search_query)
            )
        self.search_term = search_query
        self.search_type = "search"
        return Page.serve(self, request, *args, **kwargs)


class PostPage(Page):
    body = RichTextField()
    date = models.DateTimeField(
        verbose_name="Post date", default=datetime.datetime.today
    )
    excerpt = MarkdownField(
        verbose_name="excerpt",
        blank=True,
    )
    header_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    categories = ParentalManyToManyField("blog.BlogCategory", blank=True)
    tags = ClusterTaggableManager(through="blog.BlogPageTag", blank=True)
    content_panels = Page.content_panels + [
        MarkdownPanel("body"),
        MarkdownPanel("excerpt"),
        FieldPanel("categories", widget=forms.CheckboxSelectMultiple),
        FieldPanel("tags"),
    ]
    settings_panels = Page.settings_panels + [
        FieldPanel("date"),
    ]

    @property
    def blog_page(self):
        return self.get_parent().specific

    def get_context(self, request, *args, **kwargs):
        context = super(PostPage, self).get_context(request, *args, **kwargs)
        context["blog_page"] = self.blog_page
        context["post"] = self
        if request.user:
            self.save()
        return context

    def get_absolute_url(self):
        return self.url


@register_snippet
class BlogCategory(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=80)
    panels = [
        FieldPanel("name"),
        FieldPanel("slug"),
    ]

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class BlogPageTag(TaggedItemBase):
    content_object = ParentalKey("PostPage", related_name="post_tags")


@register_snippet
class Tag(TaggitTag):
    class Meta:
        proxy = True
