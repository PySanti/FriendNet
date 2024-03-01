from rest_framework import pagination

class MessagesPaginationClass(pagination.PageNumberPagination):
    page_size = 15