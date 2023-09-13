export const BASE_FALLEN_SERVER_LOG = "Red caída !"
export const BASE_JWT_ERROR_LOG = "Error inesperado validando JWT !"
export const BACKEND_URL = "http://127.0.0.1:8000/";
export const BASE_FALLEN_SERVER_ERROR_MSG = "Network Error"
export const JWT_LOCALSTORAGE_NAME = "jwt"
export const UNAUTHORIZED_STATUS_CODE = 401
export const BASE_MESSAGE_MAX_LENGTH = 200;
export const BASE_USERNAME_MAX_LENGTH = 15;
export const BASE_USERNAME_MIN_LENGTH = 6;
export const BASE_PASSWORD_MIN_LENGTH = 10;
export const BASE_LOGIN_REQUIRED_ERROR_MSG = "requires_login"
export const BASE_ACTIVATION_CODE_CONSTRAINTS = {
    required: {
        value: true,
        message:
            "Por favor ingresa un código de activación",
    },
    pattern: {
        value: /^-?\d+$/,
        message:
            "Por favor, ingresa un codigo valido",
    },
    minLength: {
        value: 6,
        message:
            "Debes ingresar al menos 6 caracteres",
    },
}


export const BASE_EMAIL_CONSTRAINTS = {
    required: {
        value: true,
        message: "Por favor, ingresa tu correo electrónico",
    },
    pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Por favor, ingresa un correo electrónico valido",
    },
};
export const BASE_USERNAME_CONSTRAINTS = {
    required: {
        value: true,
        message: "Por favor, ingresa el nombre de tu usuario",
    },
    minLength: {
        value: BASE_USERNAME_MIN_LENGTH,
        message: `Por favor, ingresa un usuario con al menos ${BASE_USERNAME_MIN_LENGTH} caracteres`,
    },
    pattern : {
        value : /^[^\s]+$/,
        message : "Por favor, ingresa un nombre de usuario sin espacios"
    }
};
export const BASE_PASSWORD_CONSTRAINTS = {
    required: {
        value: true,
        message: "Por favor, ingresa una contraseña",
    },
    minLength: {
        value: BASE_PASSWORD_MIN_LENGTH,
        message: `Por favor, ingresa una contraseña con al menos ${BASE_PASSWORD_MIN_LENGTH} caracteres`,
    },
};

export const MESSAGES_WEBSOCKET_ENDPOINT = "ws://localhost:8000/ws/messages/"
export const MAIN_WEBSOCKET = {
    'current' : null
}
