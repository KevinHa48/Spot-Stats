import React, {useState, useEffect} from "react";
import queryString from "query-string";
import Dashboard from './Dashboard'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

interface RequestType {
    login_status: boolean
    token: string
}

const AuthPage = () => {
    const [request, setRequest] = useState<RequestType>({
        login_status: false,
        token: ''
    });

    useEffect(() => {
        const parsed_url = queryString.parse(window.location.hash);
        if(parsed_url.access_token) setRequest({ 
            login_status: true,
            token: `${parsed_url.access_token}`
         });
    }, []);

    return (
        <div>
            {(request.login_status) ? 
            <Dashboard status = {request.token} /> : 
            <a href = "http://localhost:8000/login">
                <button>Login with Spotify</button>
            </a>
            }
        </div>
    )
}
export default AuthPage;