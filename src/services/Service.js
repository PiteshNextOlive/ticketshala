import Config from '../config.json'

const Storage = {
    isLogedin: (para) => {  
        return localStorage.getItem('token') !== null
    },
    set: (key, value) => {
        localStorage.setItem(key, JSON.stringify(value))
    },
    get: (key, value) => {
        return JSON.parse(localStorage.getItem(key))
    },
    setString: (key, value) => {
        localStorage.setItem(key, value)
    },
    logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('auth')
    },
    getToken: (key, value) => {
        return (localStorage.getItem('token')) ? localStorage.getItem('token') : false
    }
}

const Service = {
    get: (para) => {
        const header = {
            "content-type": "application/json",
            accept: "application/json"
        }

        const token = localStorage.getItem('token')
        if (token) {
            header["x-access-token"] = token
        }
        return fetch(Config.BASE_URL + para.url, {
            method: "GET",
            headers: header,
            body: para.body
        })
        .then((response) => {
            if (response.status === 401) {     //Unauthorized.  Invalid JWT Token
                Storage.logout()
                window.location.href = '/'
            } else {
                return response.json()
            }
        }, (error) => {
            console.log(error)
            if (error === 'TypeError: NetworkError when attempting to fetch resource.') {
                console.log('error', 'Unable to reach server.', 'Please check your network connectivity')
            }
        })
        //.then(response => response.json());
    },
    post: (para) => {
        const header = {
            "content-type": "application/json",
            accept: "application/json"
        }

        const token = localStorage.getItem('token')
        if (token) {
            header["x-access-token"] = token
        }

        return fetch(Config.BASE_URL + para.url, {
            method: "POST",
            headers: header,
            body: para.body
        })
        .then((response) => {
            if (response.status === 401) {     //Unauthorized.  Invalid JWT Token
                Storage.logout()
                window.location.href = '/'
            } else if (response.status === 403) {
                window.location.href = '/permissionDenied'
            } else {
                return response.json()
            }
        }, (error) => {
            console.log(error)
            if (error === 'TypeError: NetworkError when attempting to fetch resource.') {
                console.log('error', 'Unable to reach server.', 'Please check your network connectivity')
            }
        })
        //.then(response => response.json())
    },
    patch: (para) => {
        const header = {
            "content-type": "application/json",
            accept: "application/json"
        }

        const token = localStorage.getItem('token')
        if (token) {
            header["x-access-token"] = token
        }

        return fetch(Config.BASE_URL + para.url, {
            method: "PATCH",
            headers: header,
            body: para.body
        })
        .then((response) => {
            if (response.status === 401) {     //Unauthorized.  Invalid JWT Token
                Storage.logout()
                window.location.href = '/'
            } else if (response.status === 403) {
                window.location.href = '/permissionDenied'
            } else {
                return response.json()
            }
        }, (error) => {
            console.log(error)
        })
        //.then(response => response.json())
    },
    delete: (para) => {
        const header = {
            "content-type": "application/json",
            accept: "application/json"
        }

        const token = localStorage.getItem('token')
        if (token) {
            header["x-access-token"] = token
        }
        return fetch(Config.BASE_URL + para.url, {
            method: "DELETE", headers: header, body: para.body
        })
        .then((response) => {
            if (response.status === 401) {     //Unauthorized.  Invalid JWT Token
                Storage.logout()
                window.location.href = '/'
            } else if (response.status === 403) {
                window.location.href = '/permissionDenied'
            } else {
                return response.json()
            }
        }, (error) => {
            console.log(error)
            if (error === 'TypeError: NetworkError when attempting to fetch resource.') {
                console.log('error', 'Unable to reach server.', 'Please check your network connectivity')
            }
        })
        //.then(response => response.json());
    },
    getImage(image) {
        return Config.MEDIA_URL + image
    }
}


export {Service, Storage}
