import moment from "moment"

/**
 * Funcion creada para interpretar y formatear las fechas
 * de los mensajes
 */
export function formatedMessageDate(stringed_date){
    return moment(stringed_date).format("MMM D YYYY, h:mm a");
}