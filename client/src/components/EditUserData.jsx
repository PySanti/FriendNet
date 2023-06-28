import { UserDataForm } from "./UserDataForm";

export function EditUserData(props){
    return (
        <UserDataForm method="PUT" updating={true}/>
    )
}