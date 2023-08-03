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
    USER_SHOWABLE_FIELDS
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
    DisconnectUserSerializer,
    SendActivationEmailSerializer,
    ChangeEmailForActivationSerializer
)
from rest_framework.response import Response
from .models import Usuarios


# non - secured api's

class CreateUsuariosAPI(APIView):
    serializer_class        = CreateUsuariosSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        # enviamos al serializer los datos para hacer las comprobaciones de la imagen
        serializer = self.serializer_class(data=request.data, context={'request' : request.data})
        if serializer.is_valid():
            serialized_data = serializer.data.copy()
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
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)
class ChangeEmailForActivationAPI(APIView):
    serializer_class        = ChangeEmailForActivationSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            serialized_data = serialized_data.data
            if (Usuarios.objects.userExists(email=serialized_data['new_email'])):
                return Response({'error' : 'email_exists'}, status.HTTP_400_BAD_REQUEST)
            else:
                user = Usuarios.objects.get(id=serialized_data['user_id'])
                Usuarios.objects.setEmail(user, serialized_data['new_email'])
                return Response({'success' : 'email_setted'}, status.HTTP_200_OK)
        else:
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class CheckExistingUserAPI(APIView):
    serializer_class        = CheckExistingUserSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            if Usuarios.objects.userExists(username=request.data['username'], email=request.data['email']):
                return Response({'existing' : 'true'}, status.HTTP_200_OK)
            else:
                return Response({'existing' : 'false'}, status.HTTP_200_OK)
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class GetUserDetailAPI(APIView):
    serializer_class = GetUserDetailSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            if Usuarios.objects.userExists(request.data['username']):
                user = Usuarios.objects.get(username=request.data['username'])
                if (check_password(request.data['password'], user.password)):
                    formated_user_data = Usuarios.objects.getFormatedUserData(user)
                    Usuarios.objects.deleteAllNotifications(user)
                    return JsonResponse({'user' : formated_user_data})
                else:
                    return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'error' : 'user_not_exists'}, status.HTTP_400_BAD_REQUEST)
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)
class ActivateUserAPI(APIView):
    serializer_class        = ActivateUserSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            try:
                Usuarios.objects.activateUser(Usuarios.objects.get(id=request.data['user_id']))
                return Response({'success' : 'user_activated'}, status.HTTP_200_OK)
            except:
                return Response({'error' : 'error_activating_user'}, status.HTTP_500_INTERNAL_SERVER_ERROR) 
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)
class SendActivationEmailAPI(APIView):
    serializer_class        = SendActivationEmailSerializer
    authentication_classes  = []
    permission_classes      = [AllowAny]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if (serialized_data.is_valid()):
            send_mail(
                subject         =   "Activa tu cuenta", 
                message         =   f"Codigo : {serialized_data.data['activation_code']}", 
                from_email      =   "friendnetcorp@gmail.com", 
                recipient_list  =   [serialized_data.data['user_email']])

            return Response({"email_sended" : True}, status.HTTP_200_OK)
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)

#  secured api's

class UpdateUserDataAPI(APIView):
    serializer_class        = UpdateUsuariosSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def put(self, request, *args, **kwargs):
        # enviamos al serializer los datos para hacer las comprobaciones de la imagen
        serializer = self.serializer_class(data=request.data, context={'request' : request.data})
        if serializer.is_valid():
            user = Usuarios.objects.get(id=kwargs['pk'])
            serialized_data = serializer.data
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
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status=status.HTTP_400_BAD_REQUEST)

class ChangeUserPwdAPI(APIView):
    serializer_class        = ChangeUserPwdSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.get(id=request.data['user_id'])
            if check_password(request.data['old_password'], user.password):
                Usuarios.objects.changePassword(user, request.data['new_password'])
                return Response({'success' : 'pwd_setted'}, status.HTTP_200_OK)
            else:
                return Response({'error' : 'invalid_pwd'}, status.HTTP_400_BAD_REQUEST)
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)

class GetUsersListAPI(APIView):
    serializer_class        = GetUsersListSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            users_list = Usuarios.objects.filter(is_active=True).exclude(id=request.data['session_user_id'])
            if 'user_keyword' in serialized_data.data:
                users_list = users_list.filter(username__icontains=serialized_data.data['user_keyword'])
            return JsonResponse({"users_list": list(users_list.values(*USERS_LIST_ATTRS))})
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)


class DisconnectUserAPI(APIView):
    serializer_class        = DisconnectUserSerializer
    authentication_classes  = [JWTAuthentication]
    permission_classes      = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        serialized_data = self.serializer_class(data=request.data)
        if serialized_data.is_valid():
            user = Usuarios.objects.get(id=request.data['session_user_id'])
            Usuarios.objects.setUserConection(user, False)
            return Response({'success' : 'user_disconected'}, status.HTTP_200_OK)
        else:
            print(serialized_data._errors)
            return Response(BASE_SERIALIZER_ERROR_RESPONSE, status.HTTP_400_BAD_REQUEST)