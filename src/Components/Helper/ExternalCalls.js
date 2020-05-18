import axios from 'axios';

let putRequest = (topic, format, url) => {
  return axios({
    method: 'PUT',
    url: url,
    data: {
      SubTopic: topic,
      Format: format
    },
    auth: {
      ...window.production.httpAuth
    }
  });
}

 export function SwitchDecoderTopic(inTopic, inFormat, outTopic, outFormat) {
    return axios.all([
      putRequest(inTopic, inFormat, window.production.httpIn),
      putRequest(outTopic, outFormat, window.production.httpOut)
    ]);
}