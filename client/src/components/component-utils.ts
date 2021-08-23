export const profileHeader = ((token : string) => {
    return ({
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
    });
})

export const userInfoHeader = ((token : string) => {
    return ({
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    });
})

