import axios from 'axios';

 export function SwitchDecoderTopic(topic, format) {
    return axios({
        method: 'PUT',
        url: window.production.httpIn,
        data: {
          SubTopic: topic,
          Format: format
        },
        auth: {
          ...window.production.httpAuth
        }
    });
}