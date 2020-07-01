import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import './style.css';
import { FiMail, FiLock } from 'react-icons/fi';

export default function Logon(){
    const [useracess, setUseracess] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();
    async function handleLogin(e){
        e.preventDefault();
        try{
            const response = await api.post('sessions', {
                useracess,
                password
            });
            localStorage.setItem('id', response.data.user.id);
            localStorage.setItem('name', response.data.user.name);
            localStorage.setItem('token', response.data.token);
            history.push('/insumos')
        }catch(error){
            alert(error)
        }
    }
    return(
        <div className="container mt-md-5">
            <div className="card border-0" style={{background: "#F7FAFC"}}>
                <div className="card-header bg-transparent">
                    <div className="text-muted text-center">
                        <small>Estoque App</small>
                    </div>
                    <div className="btn-wrapper text-center">
                    <img
                        style={{height: "180px", width: "180px"}}
                        alt="logo-castelinho"
                        src={require("../../assets/g10.svg")}
                        />
                   </div>
                </div>
                <div className="card-body">
                    <div className="text-center text-muted">
                        <small>Por favor, informe suas credenciais</small>
                    </div>
                    <div className="row">
                        <div className="col-md-6 offset-md-3 mt-3">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span  className="input-group-text" id="basic-addon1">
                                        <FiMail size={18} color="primary"/>
                                    </span>
                                </div>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    placeholder="Usuário"
                                    value={useracess} 
                                    aria-describedby="basic-addon1"
                                    onChange={e => setUseracess(e.target.value)}
                                    required
                                    autoFocus
                                    />
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-3 mt-1">
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span  className="input-group-text" id="basic-addon1">
                                        <FiLock size={18} color="primary"/>
                                    </span>
                                </div>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    placeholder="Senha" 
                                    value={password}
                                    aria-describedby="basic-addon1"
                                    onChange={e=> setPassword(e.target.value)}
                                    required
                                    />
                            </div>
                        </div>
                        <div className="col-md-6 offset-md-3 mt-3">
                            <button 
                                className="btn btn-lg btn-primary btn-block" 
                                type="submit"
                                onClick={handleLogin}>
                                Entrar
                            </button>
                        </div>



                        {/* <div className="col-12 col-md-6">
                                
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">
                                            <FiLock size={18} color="primary"/>
                                        </div>
                                    </div>
                                    <input 
                                        placeholder="Senha" 
                                        type="password" 
                                        autoComplete="new-password"
                                        value={password}
                                        required
                                        onChange={e=> setPassword(e.target.value)}
                                        />
                                </div>
                        </div>
                         */}



                    </div>
                </div>
            </div>
        </div>
    );
}