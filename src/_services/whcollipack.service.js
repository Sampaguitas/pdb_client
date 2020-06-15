import config from 'config';
import { authHeader } from '../_helpers';

export const whcollipackService = {
    getAll,
};

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll(projectId) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(), 'Content-Type': 'application/json'
    };

    return fetch(`${config.apiUrl}/whcollipack/findAll?projectId=${projectId}`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        if (text == 'Unauthorized') {
            logout();
            location.reload(true);
        }
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}