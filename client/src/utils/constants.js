export const BASE_FALLEN_SERVER_LOG = "¡ Red caída !"
export const BASE_USER_NOT_EXISTS_ERROR = "user_not_exists"
export const BACKEND_URL = "http://127.0.0.1:8000/";
export const BASE_FALLEN_SERVER_ERROR_MSG = "Network Error"
export const JWT_LOCALSTORAGE_NAME = "jwt"
export const UNAUTHORIZED_STATUS_CODE = 401
export const BASE_MESSAGE_MAX_LENGTH = 200;
export const BASE_USERNAME_MAX_LENGTH = 15;
export const BASE_USERNAME_MIN_LENGTH = 6;
export const BASE_PASSWORD_MIN_LENGTH = 10;
export const BASE_LOGIN_REQUIRED_ERROR_MSG = "requires_login"
export const BASE_UNEXPECTED_ERROR_MESSAGE = "unexpected_error"
export const BASE_UNEXPECTED_ERROR_LOG = "¡ Error inesperado !"
export const LOCAL_STORAGE_DARK_MODE_NAME = "darkMode"
export const BASE_ACTIVATION_CODE_CONSTRAINTS = {
    required: {
        value: true,
        message:
            "Por favor ingresa un código de activación",
    },
    pattern: {
        value: /^-?\d+$/,
        message:
            "Por favor, ingresa un código valido",
    },
    minLength: {
        value: 6,
        message:
            "Debes ingresar al menos 6 caracteres",
    },
}

export const BASE_PAGE_NOT_FOUND_LOG = "Pagina no encontrada :("
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

export const CHAT_WEBSOCKET_ENDPOINT = "ws://localhost:8000/ws/chat/"
export const NOTIFICATIONS_WEBSOCKET_ENDPOINT = "ws://localhost:8000/ws/notifications/"
export const CHAT_WEBSOCKET = {
    'current' : null
}
export const NOTIFICATIONS_WEBSOCKET = {
    'current' : null
}
export const BASE_RATE_LIMIT_BLOCK_RESPONSE = "Has hecho muchas solicitudes últimamente, espera un poco ... "