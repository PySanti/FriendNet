from django.views.generic import (
    TemplateView
)
from .models import Home
# Create your views here.
class HomeView(TemplateView):
    template_name = 'Home/home_view.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['home_data'] = Home.objects.get(id=1)
        return context