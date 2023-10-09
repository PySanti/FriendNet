from django.db.models import Case, When
from django.db import models
from rest_framework import status
from rest_framework.views import (
    APIView,
)
from rest_framework_simplejwt.authentication import (
    JWTAuthentication
)
from rest_framework.permissions import (
    IsAuthenticated,
    AllowAny
)
from .utils.set_photo_link import set_photo_link
from .utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE,
    USERS_LIST_ATTRS,
    USER_SHOWABLE_FIELDS,
    BASE_UNEXPECTED_ERROR_RESPONSE,
    BASE_NO_MORE_PAGES_RESPONSE,
    BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE,
    BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE,
    BASE_USER_NOT_EXISTS_RESPONSE
)
from django.core.mail import send_mail
from django.contrib.auth.hashers import (
    check_password
)
from django.http import JsonResponse
from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    ActivateUserSerializer,
    GetUserDetailSerializer,
    UpdateUsuariosSerializer,
    ChangeUserPwdSerializer,
    GetUsersListSerializer,
    SendActivationEmailSerializer,
    ChangeEmailForActivationSerializer,
    UserIsOnlineSerializer,
    EnterChatSerializer
)
from rest_framework.response import Response
from .paginators import (
    UsersListPaginator
)
from .models import Usuarios
from applications.Chats.paginators import MessagesPaginationClass
from applications.Usuarios.jwt_views import MyTokenObtainPerView
from applications.Chats.models import Chats
from django.contrib.auth.hashers import check_password
from applications.Notifications.models import Notifications
from django_ratelimit.decorators import ratelimit 
from django.utils.decorators import method_decorator
# non - secured api's

class CheckExistingUserAPI(APIView):
    serializer_class        = CheckExistingUserSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                if Usuarios.objects.userExists(username=request.data['username'], email=request.data['email']):
                    return Response({'existing' : 'true'}, status.HTTP_200_OK)
                else:
                    return Response({'existing' : 'false'}, status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE
class CreateUsuariosAPI(APIView):
    serializer_class        = CreateUsuariosSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        # enviamos al serializer los datos para hacer las comprobaciones de la imagen
        serializer = self.serializer_class(data=request.data, context={'request' : request.data})
        if serializer.is_valid():
            serialized_data = serializer.data
            try:
                serialized_data = set_photo_link(
                    sended_data=serialized_data, 
                    view_type="creating",  
                    photo_file=request.FILES['photo'] if ('photo' in request.FILES) else None,
                )
                try:
                    new_user = Usuarios.objects.create_user(**serialized_data)
                    return Response({'new_user_id' : new_user.id}, status=status.HTTP_201_CREATED)
                except:
                    return Response({'error': "error_creating"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except:
                return Response({'error': "cloudinary_error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class GetUserDetailAPI(APIView):
    serializer_class = GetUserDetailSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                if Usuarios.objects.userExists(request.data['username']):
                    user = Usuarios.objects.get(username=request.data['username'])
                    if (check_password(request.data['password'], user.password)):
                        formated_user_data = Usuarios.objects.getFormatedUserData(user)
                        return JsonResponse({'user' : formated_user_data}, status=status.HTTP_200_OK)
                    else:
                        return BASE_USER_NOT_EXISTS_RESPONSE
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE
class GetUsersListAPI(APIView):
    serializer_class        = GetUsersListSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    pagination_class        = UsersListPaginator

    @method_decorator(ratelimit(key="ip", rate="5/s", method="POST"))
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                session_user = Usuarios.objects.get(id=serialized_data.data['session_user_id'])
                senders_notifications_ids = [a['sender_user_id'] for a in list(session_user.notifications.values('sender_user_id'))]
                users_list = Usuarios.objects.filter(is_active=True).exclude(id=serialized_data.data['session_user_id'])
                if 'user_keyword' in serialized_data.data:
                    users_list = users_list.filter(username__icontains=serialized_data.data['user_keyword'])
                users_list = users_list.order_by(
                    Case(
                        When(id__in=senders_notifications_ids, then=0),
                        default=1,
                        output_field=models.IntegerField(),
                    )
                )
                try:
                    # pagination
                    result_page = self.pagination_class().paginate_queryset(users_list.values(*USERS_LIST_ATTRS), request)
                except Exception:
                    return BASE_NO_MORE_PAGES_RESPONSE

                return JsonResponse({"users_list": result_page}, status=status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE

class ChangeEmailForActivationAPI(APIView):
    serializer_class        = ChangeEmailForActivationSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                user = Usuarios.objects.get(id=serialized_data.data['user_id'])
                if check_password(serialized_data.data['password'], user.password):
                    if (Usuarios.objects.userExists(email=serialized_data.data['new_email'])):
                        return Response({'error' : 'email_exists'}, status.HTTP_400_BAD_REQUEST)
                    else:
                        Usuarios.objects.setEmail(user, serialized_data.data['new_email'])
                        return Response({'success' : 'email_setted'}, status.HTTP_200_OK)
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class ActivateUserAPI(APIView):
    serializer_class        = ActivateUserSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                user = Usuarios.objects.get(id=request.data['user_id'])
                if check_password(serialized_data.data['password'], user.password):
                    Usuarios.objects.activateUser(user)
                    return Response({'success' : 'user_activated'}, status.HTTP_200_OK)
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE

class SendActivationEmailAPI(APIView):
    serializer_class        = SendActivationEmailSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                user = Usuarios.objects.get(username=serialized_data.data['username']) 
                if (check_password(serialized_data.data['password'], user.password)):
                    send_mail(
                        subject         =   "Activa tu cuenta", 
                        message         =   f"Codigo : {serialized_data.data['activation_code']}", 
                        from_email      =   "friendnetcorp@gmail.com", 
                        recipient_list  =   [serialized_data.data['user_email']])
                    return Response({"email_sended" : True}, status.HTTP_200_OK)
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE


class LoginUserAPI(MyTokenObtainPerView):
    def post(self, request, *args, **kwargs):
        user = Usuarios.objects.get(username=request.data['username'])
        if (Usuarios.objects.user_is_online(user.id)):
            return Response({'error' : 'user_is_online'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return super().post(request, *args, **kwargs)


#  secured api's

class UpdateUserDataAPI(APIView):
    serializer_class        = UpdateUsuariosSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def put(self, request, *args, **kwargs):
        # enviamos al serializer los datos para hacer las comprobaciones de la imagen
        serializer = self.serializer_class(data=request.data, context={'request' : request.data})
        if serializer.is_valid():
            user = request.user
            serialized_data = serializer.data
            if ((serialized_data['username'] != user.username) and (Usuarios.objects.userExists(username=serialized_data['username']))) or (serialized_data['email'] != user.email) and (Usuarios.objects.userExists(email=serialized_data['email'])):
                return Response({'error' : 'username_or_email_taken'}, status.HTTP_400_BAD_REQUEST)
            try:
                serialized_data = set_photo_link(
                    sended_data=serialized_data, 
                    view_type="updating", 
                    photo_file=request.FILES['photo'] if ('photo' in request.FILES) else None,
                    current_photo_link=user.photo_link)
                try:
                    updated_user = Usuarios.objects.updateUser(user, serialized_data)
                    return JsonResponse({'user_data_updated' : {i[0]:i[1] for i in updated_user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}}, status=status.HTTP_200_OK)
                except:
                    return Response({'error': "error_updating"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except:
                return Response({'error': "cloudinary_error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            print(serializer._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE

class ChangeUserPwdAPI(APIView):
    serializer_class        = ChangeUserPwdSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                user = request.user
                if check_password(request.data['old_password'], user.password):
                    Usuarios.objects.changePassword(user, request.data['new_password'])
                    return Response({'success' : 'pwd_setted'}, status.HTTP_200_OK)
                else:
                    return Response({'error' : 'invalid_pwd'}, status.HTTP_400_BAD_REQUEST)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            print(serialized_data._errors)
            return BASE_SERIALIZER_ERROR_RESPONSE


class UserIsOnlineAPI(APIView):
    serializer_class        = UserIsOnlineSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            serialized_data = request.data
            try:
                target_user = Usuarios.objects.get(id=serialized_data["target_user_id"])
            except:
                return Response({'error' : 'user_not_found'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"is_online" : Usuarios.objects.user_is_online(target_user.id)}, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

class EnterChatApi(APIView):
    serializer_class        =  EnterChatSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    pagination_class        = MessagesPaginationClass

    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            data = request.data
            print(data)
            try:
                receiver_user = Usuarios.objects.get(id=data["receiver_id"])
            except Exception:
                return Response({'error' : 'user_not_found'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    user_is_online = {'is_online' : Usuarios.objects.user_is_online(receiver_user.id)}
                except Exception:
                    return Response({'error' : 'error_while_checking_is_online'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    try:
                        messages = Chats.objects.getMessagesHistorialReady(request, data['receiver_id'], self)
                    except Exception:
                        return BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE
                    else:
                        deleted_notification = {'notification_deleted' : None}
                        if ('related_notification_id' in data):
                            try:
                                Notifications.objects.deleteNotification(data['related_notification_id'])
                            except:
                                return BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE
                            else:
                                deleted_notification = {'notification_deleted' : True}
                        messages.update(user_is_online)
                        messages.update(deleted_notification)
                        return Response(messages, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE