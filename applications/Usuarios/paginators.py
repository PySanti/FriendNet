from rest_framework.pagination import PageNumberPagination

class UsersListPaginator(PageNumberPagination):
    page_size = 14