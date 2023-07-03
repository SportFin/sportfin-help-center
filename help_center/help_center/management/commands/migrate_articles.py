import requests
from django.core.management import BaseCommand
from wagtail.core.models import Page
from blog.models import BlogPage, PostPage
from html.parser import HTMLParser
import urllib.request
from django.core.files.images import ImageFile
from django.core.files.base import ContentFile
from wagtail.images.models import Image as WagtailImage
from wagtail.images import get_image_model
import os


# get all the img urls
class ImageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.img_tags = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            src = dict(attrs).get("src")
            if src:
                self.img_tags.append(src)


# delete all the img tags
class ImgTagParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tag_stack = []
        self.output = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            self.tag_stack.append(tag)
        else:
            self.output.append(self.get_starttag_text())

    def handle_endtag(self, tag):
        if self.tag_stack and self.tag_stack[-1] == "img":
            self.tag_stack.pop()
        else:
            self.output.append(f"</{tag}>")

    def handle_data(self, data):
        self.output.append(data)

    def get_output(self):
        return "".join(self.output)


class ImgUploadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.image_urls = []

    def handle_starttag(self, tag, attrs):
        if tag == "img":
            for attr in attrs:
                if attr[0] == "src":
                    self.image_urls.append(attr[1])


class Command(BaseCommand):
    def handle(self, *args, **options):
        url = "https://api.intercom.io/articles"

        headers = {
            "accept": "application/json",
            "Intercom-Version": "2.8",
            "authorization": "Bearer dG9rOjkxMGRlYjYxX2Y2ODFfNDc5OF85NDg3XzU1MWEwYmIyZDRkNDoxOjA=",
        }
        image_urls = []
        response = requests.get(url, headers=headers)
        response = response.json()

        for element in response["data"]:
            html_doc = element["body"]
            parser = ImgUploadParser()
            parser.feed(html_doc)
            for url in parser.image_urls:
                response = requests.get(url)
                image_name = os.path.basename(url)
                wagtail_image = WagtailImage(title=image_name)
                wagtail_image.file.save(image_name, ContentFile(response.content))
                wagtail_image.save()
                html_doc = html_doc.replace(f"<img", f"<div")
                html_doc = html_doc.replace(
                    f'src="{url}"',
                    f'class="richtext-image full-width" height="600" width="800" src="{wagtail_image.file.url}" alt="{image_name}" id="{wagtail_image.id}"',
                )

            # add the modified articles to wagtail
            home = Page.objects.get(id=3)
            my_page = PostPage(
                title=element["title"],
                body=html_doc,
            )
            home.add_child(instance=my_page)

        # download all the images
        # save_dir = "blog/imgs"
        # for url in image_urls:
        #     filename = os.path.join(save_dir, url.split("/")[-1])
        #     urllib.request.urlretrieve(url, filename)
