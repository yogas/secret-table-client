import React, {ChangeEvent, FC, FormEvent, useCallback, useState} from 'react';
import { useHistory } from 'react-router-dom';
import '../auth-form/auth-form.css';
import ApiService from "../../services/api-service";

const api = new ApiService();

const CreateTableForm: FC = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    
    const onSubmitHandler = useCallback((e: FormEvent) => {
        e.preventDefault();
        api.createTable(name).then(
            (data) => {
                if(data.ok) {
                    history.push(`/tables/${data.parsedBody.table.id}`);
                } else {
                    alert(data.parsedBody.msg);
                }
            }
        )
        setName('');
    }, [history, name]);
    
    return (
        <form className="auth-form" onSubmit={onSubmitHandler}>
            <h1>Create table</h1>
            <div className="input-field col s12">
                <input onInput={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} id="name" type="text" placeholder="Name" />
            </div>
            <button type="submit" className="waves-effect waves-light btn-large auth-form__submit-btn">Create</button>
        </form>
    )
}

export default CreateTableForm;