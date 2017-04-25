import app from 'index';

class DateService {
    static get $inject() {
        return [];
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return year + '-' +
            ('0' + month).slice(-2) + '-' +
            ('0' + day).slice(-2) + ' ' +
            ('0' + hours).slice(-2) + ':' +
            ('0' + minutes).slice(-2) + ':' +
            ('0' + seconds).slice(-2);
    }

    fetchDate(response) {
        response.forEach(item => {
            item.formatedDate = this.formatDate(item.time);
        });
        return response;
    }
}

export default app
    .service('dateService', DateService);

