import { useSnackbar } from '../providers/SnackBarProvider';
import axios from 'axios';
import pako from 'pako';
import { strings } from '../constants/strings';

export function handleError(error) {
  if (error.response) {
    // El servidor respondió con un estado diferente de 2xx
    // console.error('Error en la respuesta:', error.response.data.message);
    console.error('Error en la respuesta:', error.response.status);
  } else if (error.request) {
    // La solicitud fue hecha pero no se recibió respuesta
    console.error('No se recibió respuesta:', error.request);
  } else {
    // Ocurrió un error al configurar la solicitud
    console.error('Error en la configuración de la solicitud:', error.message);
  }
}

export const fetchRegions = async () => {
  const mustDoRequest_ = await mustDoRequest('regions');

  if (mustDoRequest_) {
    try {
      const queryParams = {
        min: '',
        compress: '',
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}regions`, { params: queryParams })
      const stringData = compressedBase64ToString(response.data.data);
      localStorage.setItem('regions', stringData);
      return JSON.parse(stringData);
    } catch (error) {
      handleError(error);
      return null;
    }
  } else {
    //console.log('cached data');
    return JSON.parse(localStorage.getItem('regions'));
  }
};
export const fetchFiscalTypes = async (country) => {
  try {
    const params = {
      fiscal_types: '',
      country_name: country,
    };
    const response = await axios.get(`${import.meta.env.VITE_API_URL}finance`, { params: params });
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchProducts = async () => {
  const mustDoRequest_ = await mustDoRequest('products');

  if (mustDoRequest_) {
    try {
      const queryParams = {
        min: '',
        compress: '',
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}products`, { params: queryParams }, { withCredentials: true } )
      const stringData = compressedBase64ToString(response.data.data);
      localStorage.setItem('products', stringData);
      return JSON.parse(stringData);
    } catch (error) {
      handleError(error);
      return null;
    }
  } else {
    // console.log('cached data');
    return JSON.parse(localStorage.getItem('products'));
  }
};
export const fetchVets = async (searchText, page, user_email) => {
  try {
    const queryParams = {
      for_request: '',
      user_email: user_email,
      search: searchText,
      page: page,
    };
    const response = await axios.get(`${import.meta.env.VITE_API_URL}vets`, { params: queryParams })
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchOwnersForInput = async () => {
  const mustDoRequest_ = await mustDoRequest(undefined, 'owners_for_input');

  if (mustDoRequest_) {
    try {
      const queryParams = {
        for_input: '',
        compress: '',
      };
      const response = await axios.get(`${import.meta.env.VITE_API_URL}owners`, { params: queryParams })
      console.log(response);
      const stringData = compressedBase64ToString(response.data.data);
      localStorage.setItem('owners_for_input', stringData);
      return JSON.parse(stringData);
    } catch (error) {
      handleError(error);
      return null;
    }
  } else {
    // console.log('cached data');
    return JSON.parse(localStorage.getItem('owners_for_input'));
  }
};

const mustDoRequest = async (table_name, object_name) => {
  //from server
  const last_update_server = await getLastUpdate(table_name, object_name);
  const last_update_server_date = new Date(last_update_server.replace(' ', 'T'));
  
  //local
  if (localStorage.getItem(`${table_name}_last_update`) === null)
    localStorage.setItem(`${table_name}_last_update`, last_update_server);

  const last_update_local = localStorage.getItem(`${table_name}_last_update`);
  const last_update_local_date = new Date(last_update_local.replace(' ', 'T'));

  //cache file
  const last_update_cache = localStorage.getItem(table_name);

  const mustDoRequest = !last_update_cache || (last_update_server_date > last_update_local_date);
  return mustDoRequest;
}

const getLastUpdate = async (table_name, object_name) => {
  try {
    let url = `${import.meta.env.VITE_API_URL}sys_last_update`;
    
    if (table_name)
      url += `?table_name=${table_name}`;

    if (object_name)
      url += `?object_name=${object_name}`;

    const response = await axios.get(url)
    console.log(response);
    return response.data.data.update_time;
  } catch (error) {
    handleError(error);
    return null;
  }
}

const compressedBase64ToString = (base64string) => {
  const binaryString = atob(base64string); // Decodificar Base64 a binario
  const len = binaryString.length;
  const compressedArray = new Uint8Array(len);
  for (let i = 0; i < len; i++) 
    compressedArray[i] = binaryString.charCodeAt(i);

  const decompressedArray = pako.inflate(compressedArray, { to: 'string' });
  return decompressedArray;
}

export const validateNonEmpty = (field, setErrFunc, fieldRef) => {
  if (!field.trim()) {
    setErrFunc(strings.error_campo_empty);
    fieldRef.current.focus();
    return false;
  } 

  setErrFunc('');
  return true;
}
export const validateEmail = (field, setErrFunc, fieldRef) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(field)) {
    setErrFunc(strings.error_corrige_campo);
    fieldRef.current.focus();
    return false;
  } 

  setErrFunc('');
  return true;
}
export const validatePassword = (field, setErrFunc, fieldRef) => {
  if (!field || field.length < 8) {
    setErrFunc(strings.error_campo_empty);
    fieldRef.current.focus();
    return false;
  }

  setErrFunc('');
  return true;
};

export const verifyCaptchaToken = async (token) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}users?verify_captcha_web`, { response: token });
    // console.log(res.data.success === true);
    return res.data.success === true;
  } catch (error) {
    handleError(error);
    return false;
  }
}