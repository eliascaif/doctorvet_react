import React, { createContext, useContext, useState } from "react";
import dayjs from 'dayjs';

const GlobalItemsContext = createContext();

export const GlobalItemsProvider = ({ children }) => {

  // console.log("GlobalItemsProvider reset");
  const [sell, setSell] = useState({
    date: dayjs(),
    pet: null,
    owner: null,
    items: [],
    payments: [],
    total: 0,
    debt: 0,
    deposit: null,
    sell_point: null,
  });

  const [sellItem, setSellItem] = useState({
    product: null,
    price: '',
    quantity : '',
    discount_surcharge: '',
    selected_unit: '',
  });

  const [paymentItem, setPaymentItem] = useState({
    finance_types_payment: null,
    amount: '',
  });

  const [purchase, setPurchase] = useState({
    date: dayjs(),
    provider: null,
    items: [],
    payments: [],
    total: 0,
    debt: 0,
    deposit: null,
  });

  const [purchaseItem, setPurchaseItem] = useState({
    product: null,
    price: '',
    quantity : '',
    discount_surcharge: '',
    selected_unit: '',
  });

  const [vetSchedule, setVetSchedule] = useState({
    weekday: 'MONDAY',
    starting_hour: null,
    ending_hour: null,
    user: null,
    service: null
  });

  const [vetSchedulesList, setVetSchedulesList] = useState([]);

  return (
    <GlobalItemsContext.Provider value={{ sell, setSell, sellItem, setSellItem, paymentItem, setPaymentItem, purchase, setPurchase, purchaseItem, setPurchaseItem, vetSchedule, setVetSchedule, vetSchedulesList, setVetSchedulesList }}>
      {children}
    </GlobalItemsContext.Provider>
  );
};

export const useGlobalsItems = () => useContext(GlobalItemsContext);