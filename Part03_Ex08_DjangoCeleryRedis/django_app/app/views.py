from django.http import HttpResponse
from .tasks import my_task

def index(request):
    my_task.delay()
    return HttpResponse("Hello, World! Task sent to Celery.")
