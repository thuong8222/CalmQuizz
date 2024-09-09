const DEFAULT_APP_HOST = '4ee3-14-232-219-207.ngrok-free.app';
//const DEFAULT_APP_HOST = 'api.swayvn.com';
export default {

    API_URL: () => {
        var uri = 'https://' + DEFAULT_APP_HOST + '/api/';
        return uri;
    },
    SOCKET_URL: () => {
        var uri = 'wss://' + DEFAULT_APP_HOST;
        return uri;
    },
}
