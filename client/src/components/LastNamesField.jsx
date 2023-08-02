import { FormField } from "./FormField";
import {BASE_LASTNAMES_MAX_LENGTH} from "../utils/constants.js"
import { PropTypes } from "prop-types";

export function LastNamesField({defaultValue, registerObject, errors}){
    return (
        <FormField label="Apellidos"  errors={errors}>
            <input
                defaultValue={defaultValue}
                maxLength={BASE_LASTNAMES_MAX_LENGTH}
                type="text"
                id={registerObject.name}
                name={registerObject.name}
                {...registerObject}
            />
        </FormField>
    )
}

LastNamesField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
    defaultValue : PropTypes.string
}

LastNamesField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}