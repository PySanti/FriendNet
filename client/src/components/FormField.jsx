import { InputError } from "./InputError";
import { Label } from "./Label";

export function FormField(props){
    return (
        <>
            <InputError message={props.errors}/>
            <div className="form-field">
                <Label>
                    {props.label}
                </Label>
                {props.children}
            </div>
        </>
    )
}