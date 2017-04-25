import app from 'index';
import $http from 'angular-routes';
import $cookies from 'angular-cookies';

const conf = ($http, $cookies) => {
    // For CSRF token compatibility with Django
    const csrftoken = $cookies.get('csrftoken');
    if (csrftoken) {
        $http.defaults.headers.post['X-CSRFToken'] = csrftoken;
    }
};

export default app.run([
    '$http', '$cookies', conf
]);
