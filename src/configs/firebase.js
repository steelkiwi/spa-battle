import app from 'index';

export default app.config(() => {
    const config = {
        apiKey: '',
        authDomain: '',
        databaseURL: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: ''
    };
    firebase.initializeApp(config);
});
