import axios from 'axios';
import pako from 'pako';
import { strings } from '../constants/strings';
import Decimal from "decimal.js";

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
      // const response = await axios.get(`${import.meta.env.VITE_API_URL}products`, { params: queryParams }, { withCredentials: true } )
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}products`, 
        { params: queryParams, withCredentials: true },
      );
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

export const fetchOwner = async (id, updateLastView) => {
  try {
    const queryParams = {
      id: id,      
    };

    if (updateLastView)
      queryParams.updateLastView = 1;

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}owners`, 
      { params: queryParams, withCredentials: true },
    );
    //console.log(response);
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchPet = async (id, updateLastView) => {
  try {
    const queryParams = {
      id: id,      
    };

    if (updateLastView)
      queryParams.updateLastView = 1;

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}pets`, 
      { params: queryParams, withCredentials: true },
    );
    // console.log(response);    
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchClinic = async (id_pet, page) => {
  try {
    const queryParams = {
      id_pet: id_pet,
      page: page,      
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}pets_clinic`, 
      { params: queryParams, withCredentials: true },
    );
    return response.data.data.content;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const fetchForInput = async (table, objectName) => {
  const mustDoRequest_ = await mustDoRequest(undefined, objectName);

  if (mustDoRequest_) {
    try {
      const queryParams = {
        for_input: '',
        compress: '',
      };
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${table}`, 
        { params: queryParams, withCredentials: true },
      );
      //console.log(response);
      
      const stringData = compressedBase64ToString(response.data.data);
      localStorage.setItem(objectName, stringData);
      return JSON.parse(stringData);
    } catch (error) {
      handleError(error);
      return null;
    }
  } else {
    // console.log('cached data');
    return JSON.parse(localStorage.getItem(objectName));
  }
};

export const fetchById = async (id, endpoint) => {
  try {
    const queryParams = {
      id: id,      
    };

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}${endpoint}`, 
      { params: queryParams, withCredentials: true },
    );
    //console.log(response);
    
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

export const fetchRecent = async (page, table) => {
  try {
    const queryParams = {
      recent: '',
      page: page,      
    };

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}${table}`, 
      { params: queryParams, withCredentials: true },
    );
    //console.log(response.data.data.content);
    return response.data.data.content;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetch = async (table, params) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}${table}`, 
      { params: params ? params : null, withCredentials: true },
    );
    // console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchSearchPage = async (table, searchText, page, productsGlobalsInclude = false) => {
  try {
    const params = {
      search: searchText,
      page: page,
      globals_include: productsGlobalsInclude ? 1 : null,
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}${table}`, 
      {params: params, withCredentials: true},
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchSearchPageServices = async (table, searchText, page, productsGlobalsInclude = false) => {
  try {
    const params = {
      search: searchText,
      page: page,
      services: '',
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}products`, 
      {params: params, withCredentials: true},
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};
export const fetchSearchPageServicesCategories = async (searchText, page) => {
  try {
    const params = {
      search: searchText,
      page: page,
      only_services: '',
      format: 'SEARCH',
    };
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}products_categories`, 
      {params: params, withCredentials: true},
    );
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

// export const fetchSearchProducts = async (searchText, page, globalsInclude) => {
//   try {
//     const params = {
//       search: searchText,
//       page: page,
//       globals_include: globalsInclude,
//     };
//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}products`, 
//       { params: params, withCredentials: true },
//     );
//     return response.data.data;
//   } catch (error) {
//     handleError(error);
//     return null;
//   }
// };


// export const fetchOwnersRecent = async (page) => {
//   try {
//     const queryParams = {
//       recent: '',
//       page: page,      
//     };

//     const response = await axios.get(
//       `${import.meta.env.VITE_API_URL}owners`, 
//       { params: queryParams, withCredentials: true },
//     );
//     //console.log(response.data.data.content);
    
//     return response.data.data.content;
//   } catch (error) {
//     handleError(error);
//     return null;
//   }
// };
export const fetchPetsDashboard = async () => {
  try {
    const queryParams = {
      dashboard: '',
    };

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}pets`, 
      { params: queryParams, withCredentials: true },
    );
    console.log(response.data.data);
    
    return response.data.data;
  } catch (error) {
    handleError(error);
    return null;
  }
};

const mustDoRequest = async (table_name, object_name) => {
  
  let final_object_name = table_name;
  if (object_name)
    final_object_name = object_name;

  //from server
  const last_update_server = await getLastUpdate(table_name, object_name);
  const last_update_server_date = new Date(last_update_server.replace(' ', 'T'));
  
  //local
  if (localStorage.getItem(`${final_object_name}_last_update`) === null)
    localStorage.setItem(`${final_object_name}_last_update`, last_update_server);

  const last_update_local = localStorage.getItem(`${final_object_name}_last_update`);
  const last_update_local_date = new Date(last_update_local.replace(' ', 'T'));

  //cache file
  const last_update_cache = localStorage.getItem(final_object_name);

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

    const response = await axios.get(
      url,
      { withCredentials: true },
    );
    //console.log(response);
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
export const validateNonEmpty = (fieldName, fieldValue, setErrFunc, fieldRef) => {
  if (fieldValue != null && fieldValue.trim() != '') {
    setErrFunc({});
    return true;
  }

  let error = {
    [fieldName]: strings.error_campo_empty
  };
  setErrFunc(error);
  fieldRef.current.focus();
  fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
}
export const validateEmail = (fieldName, fieldValue, setErrFunc, fieldRef, nullPass) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if ( (nullPass && !fieldValue) || (emailRegex.test(fieldValue)) ) {
    setErrFunc({});
    return true;
  }

  let error = {
    [fieldName]: strings.error_corrige_campo
  };
  setErrFunc(error);
  fieldRef.current.focus();
  fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;
}
export const validatePassword = (fieldName, fieldValue, setErrFunc, fieldRef) => {
  if (fieldValue.length >= 8) {
    setErrFunc({});
    return true;
  }

  let error = {
    [fieldName]: strings.error_campo_empty
  };
  setErrFunc(error);
  fieldRef.current.focus();
  fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  return false;

  // if (!fieldValue || field.length < 8) {
  //   setErrFunc(strings.error_campo_empty);
  //   fieldRef.current.focus();
  //   fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //   return false;
  // }

  // setErrFunc('');
  // return true;
};
export const validateDecimal = (fieldName, fieldValue, setErrFunc, fieldRef) => {
  const trimmedValue = fieldValue.trim();
  
  // Expresión regular para validar números decimales
  const decimalPattern = /^[+-]?((\d+\.?\d*)|(\.\d+))$/;
  
  if (decimalPattern.test(trimmedValue) && !isNaN(trimmedValue)) {
    setErrFunc({});
    return true;
  }

  const error = {
    [fieldName]: strings.error_corrige_campo
  };
  
  setErrFunc(error);
  
  if (fieldRef?.current) {
    fieldRef.current.focus();
    fieldRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  
  return false;
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
export const formatCurrency = (number) => {
  const currencyFormat = new Intl.NumberFormat(navigator.language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return currencyFormat.format(number);
}
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(navigator.language).format(date);
};
export const formatDate2 = (dateString) => {
  // Handle both formats: with time (YYYY-MM-DD HH:mm:ss) and without (YYYY-MM-DD)
  const localDate = dateString.includes(' ') ? dateString : `${dateString} 00:00:00`;
  const date = new Date(localDate.replace(' ', 'T'));
  return new Intl.DateTimeFormat(navigator.language).format(date);
};
export const formatDateReplaceHour = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  
  if (isToday) {
    return new Intl.DateTimeFormat(navigator.language, {
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    }).format(date);
  }
  
  return new Intl.DateTimeFormat(navigator.language).format(date);
};

export const formatDateLong = (dateString) => {
  // Ensure the date is interpreted in local timezone by appending T00:00:00
  const localDate = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
  const date = new Date(localDate);
  return new Intl.DateTimeFormat(navigator.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};
export const formatHour = (dateString, hour12 = false) => {
  const date = new Date(dateString);
  const hour = new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: hour12,
  }).format(date);
  return hour;
}
export const formatDateHour = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(navigator.language, {
    dateStyle: 'medium', // Formato para la fecha (short, medium, long o full)
    timeStyle: 'short',  // Formato para la hora (short, medium, long o full)
  }).format(date);
};
export const getSupplyStr = (supplyStr) => {
  if (supplyStr == 'NA')
    return 'Sin suministro';
  else if (supplyStr == 'PENDING')
    return 'Suministro pendiente';
  else if (supplyStr == 'EXPIRED')
    return 'Suministro vencido';
  else
    return 'Suministro pendiente y vencido';
}
export const getReasonStr = (reasonStr) => {
  if (reasonStr == 'SUPPLY')
    return 'Suministro';
  if (reasonStr == 'SELL')
    return 'Venta';
  if (reasonStr == 'CLINIC')
    return 'Clínica';
  if (reasonStr == 'RECIPE')
    return 'Receta';
  if (reasonStr == 'CLINIC2')
    return 'Clínica extendida';
}

export const openCache = async () => {
  const cache = await caches.open('doctorvet-cache');
  return cache;
};

// Almacenar un archivo en el caché usando su nombre y la URL
export const cacheResource = async (fileName, url) => {
  const cache = await openCache();
  const response = await fetch(url);

  const cachedResource = {
    fileName,
    response,
  };

  // Almacenamos el archivo en el cache con el nombre del archivo como clave
  await cache.put(fileName, new Response(JSON.stringify(cachedResource)));
};

export const getResource = async (fileName, url) => {
  const cache = await openCache();
  
  //const cachedResponse = await cache.match(fileName);

  // if (cachedResponse) {
  //   const cachedData = await cachedResponse.json();
  //   console.log(cachedData);

  //   //return cachedData.response; // Si existe en el caché, lo retornamos
  //   return URL.createObjectURL(await cachedData.response.blob());
  // }

  // Si el archivo no está en caché, lo descargamos desde la URL
  console.log(url);

  const response = await axios.get(url, { responseType: 'blob' });
  console.log(response);

  //await cacheResource(fileName, url);
  //return response;
  //return URL.createObjectURL(await response.blob());
};

export const capitalizeFirstLetter = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
} 

export const getFirstPrincipalOwner = (owners) => {
  const principalOwner = owners.find(owner => 
    owner.is_principal !== null && owner.is_principal === 1
  );
  
  if (principalOwner) return principalOwner;
  if (owners.length > 0) return owners[0];
  return null;
};

// Función que retorna la descripción de un producto (incluye cantidad, unidad, precio y descuento/recargo)
export const getDescription = (item) => {
  let unit = item.selected_unit;
  if (!unit && item.product && item.product.unit) {
    unit = item.product.unit.is_complex === 1
      ? item.product.unit.second_unit_string
      : item.product.unit.first_unit_string;
  }
  let description = `${item.quantity} ${unit} x ${formatCurrency(item.price)}`;
  const discount_surcharge = item.discount_surcharge;
  if (discount_surcharge == null) return description;
  if (discount_surcharge > 0) {
    description += ` (x -${discount_surcharge}%)`;
  } else if (discount_surcharge < 0) {
    description += ` (x +${Math.abs(discount_surcharge)}%)`;
  }
  return description;
};

// Calcula el subtotal aplicando descuento/recargo
export const getSubtotal = (quantityValue, priceValue, discountValue) => {
  const quantity = quantityValue != null ? new Decimal(quantityValue) : new Decimal(0);
  let price = priceValue != null ? new Decimal(priceValue) : new Decimal(0);
  const discount = discountValue != null ? new Decimal(discountValue) : new Decimal(0);

  if (!discount.equals(0)) {
    price = price.sub(price.mul(discount).div(100));
  }
  const subtotal = quantity.mul(price);
  return subtotal.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
};
