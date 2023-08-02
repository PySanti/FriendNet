import { FormField } from "./FormField";
import {BASE_FIRSTNAMES_MAX_LENGTH} from "../utils/constants.js"
import { PropTypes } from "prop-types";

export function FirstNamesField({defaultValue, registerObject, errors}){
    return (
        <FormField label="Nombres"  errors={errors}>
            <input
                defaultValue={defaultValue}
                maxLength={BASE_FIRSTNAMES_MAX_LENGTH}
                type="text"
                id={registerObject.name}
                name={registerObject.name}
                {...registerObject}
            />
        </FormField>
    )
}

FirstNamesField.propTypes = {
    registerObject : PropTypes.object.isRequired,
    errors : PropTypes.string,
    defaultValue : PropTypes.string
}

FirstNamesField.defaultProps = {
    errors : undefined,
    defaultValue : undefined,
}