export const BASE_FALLEN_SERVER_LOG = "Red caída !"
export const BACKEND_URL = "http://127.0.0.1:8000/";
export const BASE_FALLEN_SERVER_ERROR_MSG = "Network Error"
export const BASE_MESSAGE_MAX_LENGTH = 200;
export const BASE_USERNAME_MAX_LENGTH = 15;
export const BASE_USERNAME_MIN_LENGTH = 6;
export const BASE_FIRSTNAMES_MAX_LENGTH = 30;
export const BASE_LASTNAMES_MAX_LENGTH = 30;
export const BASE_PASSWORD_MIN_LENGTH = 10;
export const BASE_NAMES_CONSTRAINTS = (name_type)=>{
    return {
        required: {
            value: true,
            message: `Por favor, ingresa tu(s) ${name_type}(s)`,
        },
        pattern: {
            value: /^[^\d]+$/,
            message:`Por favor, ingresa un(os) ${name_type}(s) valido(s)`,
        }
    }
}
export const BASE_AGE_CONSTRAINS = {
    required: {
        value: true,
        message: "Por favor, ingresa tu edad.",
    },
    max: {
        value: 120,
        message:
            "Por favor, ingresa una edad valida",
    },
    min: {
        value: 5,
        message: "Debes tener al menos 5 años",
    },
    pattern: {
        value: /^-?\d+$/,
        message:
            "Por favor, ingresa una edad valida",
    },
    }
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