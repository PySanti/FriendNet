from django.db.models import BooleanField, Value

def add_istyping_field(queryset):
    """
        Recibira un queryset retornado por la funcion
        values(**kwargs) y retornara el mismo queryset pero con el
        atributo is_typing=False
    """
    if type(queryset) == dict:
        queryset.update({'is_typing' : False})
        return queryset
    return queryset.annotate(is_typing=Value(False, output_field=BooleanField()))