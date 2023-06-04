from django.views.generic import (
    TemplateView
)
from .models import Home
# Create your views here.
class HomeView(TemplateView):
    """
        Vista creada para el home del proyecto
    """
    template_name = 'Home/home_view.html'
    def get_context_data(self, **kwargs):
        """
            Envia la informacion del Home extraida de la DB al template del Home
        """
        context = super().get_context_data(**kwargs)
        context['home_data'] = Home.objects.get(id=1)
        return context