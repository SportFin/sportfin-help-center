from help_center.help_center.base import *

DEBUG = False

try:
    from .local import *
except ImportError:
    pass
