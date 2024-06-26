from django.core.cache import cache
from django.http import QueryDict
from asgiref.sync import async_to_sync
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
from .utils.generate_security_code import generate_security_code
from .utils.constants import (
    BASE_SERIALIZER_ERROR_RESPONSE,
    USERS_LIST_ATTRS,
    USER_SHOWABLE_FIELDS,
    BASE_UNEXPECTED_ERROR_RESPONSE,
    BASE_NO_MORE_PAGES_RESPONSE,
    BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE,
    BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE,
    BASE_USER_NOT_EXISTS_RESPONSE,
)
from .utils.send_activation_mail import send_activation_mail
from django.contrib.auth.hashers import (
    check_password
)
from django.http import JsonResponse
from .serializers import (
    CreateUsuariosSerializer,
    CheckExistingUserSerializer,
    CheckSecurityCodeSerializer,
    ActivateUserSerializer,
    GetUserDetailSerializer,
    UpdateUsuariosSerializer,
    ChangeUserPwdSerializer,
    GetUsersListSerializer,
    GenerateSendSecurityCodeSerializer,
    ChangeEmailForActivationSerializer,
    EnterChatSerializer,
    RecoveryPasswordSerializer
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
from .websockets.ws_utils.broadcast_updated_user import broadcast_updated_user
from .utils.handle_initial_notification_ids import handle_initial_notification_ids
from .utils.add_istyping_field import add_istyping_field
import logging





users_list_logger = logging.getLogger('users_list_logger')
signup_logger = logging.getLogger('signup_logger')
# non - secured api's
class RecoveryPasswordAPI(APIView):
    serializer_class        = RecoveryPasswordSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                if (Usuarios.objects.user_exists(email=serialized_data.data["email"])):
                    user = Usuarios.objects.get(email=serialized_data.data["email"])
                    if (serialized_data.data["security_code"] == user.security_code):
                        user.set_password(serialized_data.data["new_password"])
                        user.save()
                        return Response({"success"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"error" : "security_code"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class CheckExistingUserAPI(APIView):
    serializer_class        = CheckExistingUserSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                return Response({'existing' : True if Usuarios.objects.user_exists(username=request.data['username'], email=request.data['email']) else False }, status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
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
                    signup_logger.info(f"NUEVO USUARIO : {new_user.id}-{new_user.username}")
                    return Response({'new_user_id' : new_user.id}, status=status.HTTP_200_OK)
                except:
                    return Response({'error': "error_creating"}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'error': "cloudinary_error"}, status=status.HTTP_400_BAD_REQUEST)
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
                if Usuarios.objects.user_exists(request.data['username']):
                    user = Usuarios.objects.get(username__iexact=request.data['username'])
                    if (check_password(request.data['password'], user.password)):
                        formated_user_data = Usuarios.objects.get_formated_user_data(user)
                        return JsonResponse({'user' : formated_user_data}, status=status.HTTP_200_OK)
                    else:
                        return BASE_USER_NOT_EXISTS_RESPONSE
                else:
                    return BASE_USER_NOT_EXISTS_RESPONSE
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class GetUsersListAPI(APIView):
    serializer_class        = GetUsersListSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    pagination_class        = UsersListPaginator

    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            try:
                page = int(request.query_params.get('page'))
                session_user = Usuarios.objects.get(id=serialized_data.data['session_user_id'])
                senders_notifications_ids = handle_initial_notification_ids('get', session_user.id)
                if (page == 1):
                    # si es la primera pagina lo definimos, sino solo lo buscamos
                    initial_notifications_list = Chats.objects.recent_message_id_list(session_user)
                    senders_notifications_ids = initial_notifications_list
                    handle_initial_notification_ids('post', session_user.id,initial_notifications_list )
                users_list  = Usuarios.objects.get_filtered_users_list(
                    session_user, 
                    senders_notifications_ids, 
                    serialized_data.data['user_keyword'] if 'user_keyword' in serialized_data.data else None)
                

                # logging 
                if ((session_user.id == 1) and (page == 1)):
                    listed_users_list = list(users_list)
                    users_list_logger.info("Lista de usuarios")
                    for u in listed_users_list:
                        user_page = (listed_users_list.index(u)//20)+1
                        users_list_logger.info(f"{u.username} - {user_page}")
                try:
                    # pagination
                    result_page = self.pagination_class().paginate_queryset(add_istyping_field(users_list.values(*USERS_LIST_ATTRS)), request)
                except Exception:
                    return BASE_NO_MORE_PAGES_RESPONSE
                return JsonResponse({"users_list": result_page}, status=status.HTTP_200_OK)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
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
                if (Usuarios.objects.user_exists(email=serialized_data.data['new_email'])):
                    return Response({'error' : 'email_exists'}, status.HTTP_400_BAD_REQUEST)
                else:
                    Usuarios.objects.set_email(user, serialized_data.data['new_email'])
                    return Response({'success' : 'email_setted'}, status.HTTP_200_OK)
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
                Usuarios.objects.activate_user(Usuarios.objects.get(id=request.data['user_id']))
                return Response({'success' : 'user_activated'}, status.HTTP_200_OK)
            except:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class CheckSecurityCodeAPI(APIView):
    serializer_class        = CheckSecurityCodeSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            if (Usuarios.objects.user_exists(email=serialized_data.data["user_email"])):
                try:
                    user = Usuarios.objects.get(email=serialized_data.data["user_email"])
                    if (serialized_data.data["code"] == user.security_code):
                        return Response({"success" : "valid_code"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"error" : "invalid_security_code"}, status=status.HTTP_400_BAD_REQUEST)
                except:
                    return BASE_UNEXPECTED_ERROR_RESPONSE
            else:
                return BASE_USER_NOT_EXISTS_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE
class GenerateSendSecurityCodeAPI(APIView):
    serializer_class        = GenerateSendSecurityCodeSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            if (Usuarios.objects.user_exists(email=serialized_data.data["user_email"])):
                try:
                    code = generate_security_code()
                    user = Usuarios.objects.get(email=serialized_data.data["user_email"])
                    send_activation_mail(serialized_data.data['user_email'], f"{serialized_data.data['message']}, {user.username}", code)
                    Usuarios.objects.set_security_code(Usuarios.objects.get(email=serialized_data.data["user_email"]), code)
                    return Response({"email_sended" : True}, status.HTTP_200_OK)
                except Exception:
                    return BASE_UNEXPECTED_ERROR_RESPONSE
            else:
                return BASE_USER_NOT_EXISTS_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE


class LoginUserAPI(MyTokenObtainPerView):
    def post(self, request, *args, **kwargs):
        user = Usuarios.objects.get(username__iexact=request.data['username'])
        if (Usuarios.objects.user_is_online(user.id)):
            return Response({'error' : 'user_is_online'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if isinstance(request.data, QueryDict):
                request.data._mutable = True
            request.data['username'] = user.username
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
            if ((serialized_data['username'] != user.username) and (Usuarios.objects.user_exists(username=serialized_data['username']))) or (serialized_data['email'] != user.email) and (Usuarios.objects.user_exists(email=serialized_data['email'])):
                return Response({'error' : 'username_or_email_taken'}, status.HTTP_400_BAD_REQUEST)
            try:
                serialized_data = set_photo_link(
                    sended_data=serialized_data, 
                    view_type="updating", 
                    photo_file=request.FILES['photo'] if ('photo' in request.FILES) else None,
                    current_photo_link=user.photo_link)
                try:
                    old_email = user.email
                    updated_user = Usuarios.objects.update_user(user, serialized_data)
                    if (user.email != old_email):
                        Usuarios.objects.deactivate_user(user)
                        return JsonResponse({'user_inactive' : True}, status=status.HTTP_200_OK)
                    else:
                        async_to_sync(broadcast_updated_user)(updated_user)
                        return JsonResponse({'user_data_updated' : {i[0]:i[1] for i in updated_user.__dict__.items() if i[0] in USER_SHOWABLE_FIELDS}}, status=status.HTTP_200_OK)
                except:
                    return Response({'error': "error_updating"}, status=status.HTTP_400_BAD_REQUEST)
            except:
                return Response({'error': "cloudinary_error"}, status=status.HTTP_400_BAD_REQUEST)
        else:
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
                    Usuarios.objects.change_password(user, request.data['new_password'])
                    return Response({'success' : 'pwd_setted'}, status.HTTP_200_OK)
                else:
                    return Response({'error' : 'invalid_pwd'}, status.HTTP_400_BAD_REQUEST)
            except Exception:
                return BASE_UNEXPECTED_ERROR_RESPONSE
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE



class EnterChatAPI(APIView):
    serializer_class        =  EnterChatSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    pagination_class        = MessagesPaginationClass
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            data = request.data
            if (request.user.id == data["receiver_id"]):
                return Response({"error" : "same_user"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                receiver_user = Usuarios.objects.get(id=data["receiver_id"])
                if (not receiver_user.is_active):
                    raise Exception
            except Exception:
                return Response({'error' : 'user_not_found'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                try:
                    user_is_online = {'is_online' : Usuarios.objects.user_is_online(receiver_user.id)}
                except Exception:
                    return Response({'error' : 'error_while_checking_is_online'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    try:
                        cache.set(f"message_pagination_ref_{request.user.id}", Chats.objects.get_last_message_ref(data['receiver_id'], request.user.id))
                        messages = Chats.objects.get_messages_historial_page(request, data['receiver_id'], self)
                    except Exception:
                        return BASE_ERROR_WHILE_GETTING_MESSAGES_RESPONSE
                    else:
                        deleted_notification = {'notification_deleted' : None}
                        if ('related_notification_id' in data):
                            try:
                                Notifications.objects.delete_notification(data['related_notification_id'])
                            except:
                                return BASE_ERROR_WHILE_DELETING_NOTIFICATION_RESPONSE
                            else:
                                deleted_notification = {'notification_deleted' : True}
                        messages.update(user_is_online)
                        messages.update(deleted_notification)
                        return Response(messages, status=status.HTTP_200_OK)
        else:
            return BASE_SERIALIZER_ERROR_RESPONSE

class GetUserNotificationsAPI(APIView):
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            notifications = Usuarios.objects.get_formated_notifications(request.user)
            return Response({'recent_notifications' : notifications }, status=status.HTTP_200_OK)
        except Exception:
            return BASE_UNEXPECTED_ERROR_RESPONSE