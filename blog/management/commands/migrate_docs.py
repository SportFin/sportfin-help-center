import glob
import os
from django.core.management import BaseCommand
from wagtail.models import Page
from blog.models import BlogPage, PostPage
import markdown
from django.conf import settings

folder_path = "/docs/"

home = Page.objects.get(id=32)

# Retrieve all Markdown files from the folder
md_files = glob.glob(os.path.join(folder_path, "*.md"))


# Iterate over the Markdown files
class Command(BaseCommand):
    def handle(self, *args, **options):
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.endswith(".md"):
                    # Construct the full path to the Markdown file
                    md_file = os.path.join(root, file)

                    with open(md_file, "r") as f:
                        # Read the content of the Markdown file
                        md_content = f.read()
                        md_content = markdown.markdown(
                            md_content, extensions=["nl2br"], safe_mode="escape"
                        )
                        lines = md_content.split("\n")
                        title = lines[1].strip()

                        # Remove the first line from the content
                        body = "\n".join(lines[1:])

                        # Create a new Wagtail article page
                        my_page = PostPage(
                            title=title, body=body  # Use the file name as the title
                        )

                        # Add the newly created article page as a child of the home page
                        home.add_child(instance=my_page)
