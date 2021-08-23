import express, { response } from "express";
import cors from "cors";
import axios from "axios";
import { URLSearchParams } from "url";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 8000;

var scopes = 'user-read-private user-read-email user-top-read';

app.use(cors());

app.get("/login", (req, res) => {
    res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + process.env.CLIENT_ID! +
    (scopes ? '&scope=' + encodeURIComponent(scopes): '') + 
    '&redirect_uri=' + encodeURIComponent(process.env.REDIRECT_URI!))
})

// replace on spotify dev portal aka add /callback to localhost 
app.get("/callback", (req, res) => {
    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        params: {
            code: req.query.code,
            redirect_uri: process.env.REDIRECT_URI!,
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + Buffer.from(process.env.CLIENT_ID! + ':' + process.env.CLIENT_SECRET!).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => {
        let queryBuilder = new URLSearchParams();
        queryBuilder.append('access_token', response.data.access_token);
        queryBuilder.append('refresh_token', response.data.refresh_token);
        res.redirect('http://localhost:3000/#' + queryBuilder.toString());
    }); 
})

app.listen(port, () => {
    console.log("Server started.")
})