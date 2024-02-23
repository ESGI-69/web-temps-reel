import axios from 'axios';

const config = {
  baseURL: import.meta.env.VITE_API,
};

const instance = axios.create(config);

instance.defaults.headers.post['Content-Type'] = 'application/json';

export default instance;
