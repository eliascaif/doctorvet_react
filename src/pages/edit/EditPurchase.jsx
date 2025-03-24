import React, { useState, useEffect, useRef } from "react";
import { 
  TextField, 
  Autocomplete, 
  Box, Divider, Typography, IconButton, ListItem,
  ListItemText, List,
 } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  fetchForInput, 
  fetchProducts, 
  formatCurrency, 
  validateDecimal,
  getDescription,
  getSubtotal
} from "../../utils/lib";
import axios from "axios";
import { useSnackbar } from "../../providers/SnackBarProvider";
import { useAppBar } from "../../providers/AppBarProvider";
import { strings } from "../../constants/strings";
import EditPage from "./EditPage";
import { useConfig } from "../../providers/ConfigProvider";
import { useLoading } from "../../providers/LoadingProvider";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import ListItemWAvatarRemove from "../../layouts/ListItemWAvatarRemove";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ListItemProductRemove from "../../layouts/ListItemProductRemove";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import { useGlobalsItems } from "../../providers/GlobalItemsProvider";
import Decimal from "decimal.js";
import ProductUnitSelector from "../../layouts/ProductUnitSelector";
import DepositSelector from "../../layouts/DepositsSelector";
import CloseIcon from "@mui/icons-material/Close";
import InventoryIcon from '@mui/icons-material/Inventory';
import StorefrontIcon from '@mui/icons-material/Storefront';

const EditPurchase = () => {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { updateTitle } = useAppBar();
  const { isLoading, setIsLoading } = useLoading();
  const location = useLocation();
  const { purchase, setPurchase, purchaseItem, setPurchaseItem, paymentItem, setPaymentItem } = useGlobalsItems();

  const [errors, setErrors] = useState({});
  const [refs, setRefs] = useState({
    product: useRef(null),
    quantity: useRef(null),
    price: useRef(null),
    discount: useRef(null),
    payment_amount: useRef(null),
    amount: useRef(null),
  });

  const [deposits, setDeposits] = useState([]);
  const [paymentsTypes, setPaymentsTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [productDisabled, setProductDisabled] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    setPurchase({
      ...purchase,
      date: dayjs(),
    });

    if (location.state?.product) manageInsertSellItem(location.state.product);

    updateTitle(undefined, "Compra", "Completa los datos");
    const fetchPurchasesForInput = async () => {
      const purchasesForInput = await fetchForInput("purchases", "purchases_for_input");
      setDeposits(purchasesForInput.deposits);
      setPaymentsTypes(purchasesForInput.finance_types_payments);
      const products = await fetchProducts();
      setProducts(products);

      setIsLoading(false);

      if (refs.product.current) refs.product.current.focus();
    };
    fetchPurchasesForInput();
  }, []);

  // Establecer depósito predeterminado
  useEffect(() => { 
    if (deposits.length > 0) {
      setPurchase((prevSell) => ({
        ...prevSell,
        deposit: deposits[0],
      }));
    }
  }, [deposits]);

  const handleSearchProvider = () => {
    navigate("/main/search-provider", { state: { from: "/main/edit-purchase" } });
  };
  const handleRemoveProvider = () => {
    setPurchase({ ...purchase, provider: null });
  };


  const handleSearchProduct = () => {
    navigate("/main/search-product", { state: { from: "/main/edit-purchase" } });
  };

  // Agregar producto: valida campos, agrega el producto y recalcula total y deuda
  const handleAddProduct = () => {
    if (!purchaseItem.product || !purchaseItem.quantity || !purchaseItem.price) {
      snackbar(`Selecciona ${strings.product_service.toLowerCase()}, cantidad y precio`);
      return;
    }

    if (
      !validateDecimal("quantity", purchaseItem.quantity, setErrors, refs.quantity) ||
      !validateDecimal("price", purchaseItem.price, setErrors, refs.price) ||
      (purchaseItem.discount_surcharge &&
        !validateDecimal("discount", purchaseItem.discount_surcharge, setErrors, refs.discount))
    )
      return;

    const newItems = [...purchase.items, structuredClone(purchaseItem)];
    const { total, debt } = calculateTotalAndDebt(newItems, purchase.payments);

    setPurchase({
      ...purchase,
      items: newItems,
      total,
      debt,
    });

    setPurchaseItem({
      product: null,
      price: "",
      quantity: "",
      discount_surcharge: "",
      selected_unit: "",
    });

    refs.product.current.focus();
  };

  // Remover producto y actualizar total y deuda
  const handleRemoveProduct = (index) => {
    const updatedItems = purchase.items.filter((_, i) => i !== index);
    const { total, debt } = calculateTotalAndDebt(updatedItems, purchase.payments);
    setPurchase((prevSell) => ({
      ...prevSell,
      items: updatedItems,
      total,
      debt,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!purchase.date) {
      snackbar("Selecciona la fecha");
      return;
    }

    if (!purchase.deposit) {
      snackbar("Selecciona el depósito");
      return;
    }

    if (!purchase.sell_point) {
      snackbar("Selecciona el punto de venta");
      return;
    }

    if (!purchase.items || purchase.items.length === 0) {
      snackbar(`Agrega al menos un ${strings.product_service.toLowerCase()}`);
      return;
    }

    // If there's a total but no payments, confirm with user
    if (purchase.total > 0 && (!purchase.payments || purchase.payments.length === 0)) {
      if (!window.confirm("¿Deseas guardar la venta sin pagos?")) {
        return;
      }
    }

    save();
  };

  const save = async () => {
    setIsLoading(true);
    try {
      // Format the date to MySQL datetime format before sending
      const sellToSend = {
        ...purchase,
        date: dayjs(purchase.date).format('YYYY-MM-DD HH:mm:ss')
      };
      
      // Log the sale object before sending
      console.log('Sale object to be sent:', sellToSend);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}sells`, sellToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200 || response.status === 201) {
        snackbar("Venta guardada correctamente");
        setPurchase({
          date: dayjs(),
          deposit: deposits[0] || null,
          sell_point: sellPoints[0] || null,
          items: [],
          payments: [],
          total: 0,
          debt: 0
        });

        setPaymentItem({
          finance_types_payment: null,
          amount: "",
        });

      } else {
        throw new Error("Error al guardar la venta");
      }
    } catch (error) {
      console.error('Error saving sell:', error);
      snackbar(error.response?.data?.message || "Error al guardar la venta");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcula el total de la venta y la deuda (total - pagos realizados)
  const calculateTotalAndDebt = (items, payments = []) => {
    let total = new Decimal(0);
    items.forEach((item) => {
      const quantity = new Decimal(item.quantity.toString().replace(",", ".") || 0);
      const price = new Decimal(item.price.toString().replace(",", ".") || 0);
      const discount = new Decimal(item.discount_surcharge.toString().replace(",", ".") || 0);
      const subtotal = quantity.times(price);
      const discountAmount = subtotal.times(discount.div(100));
      total = total.plus(subtotal.minus(discountAmount));
    });
    total = total.toDecimalPlaces(2);

    const totalPayments = payments.reduce(
      (sum, payment) =>
        sum.plus(new Decimal(payment.amount.toString().replace(",", ".") || 0)),
      new Decimal(0)
    );
    const debt = total.minus(totalPayments).toDecimalPlaces(2);
    return { total: total.toNumber(), debt: debt.toNumber() };
  };

  // Modify manageInsertSellItem to handle default unit assignment
  const manageInsertSellItem = (product) => {
    if (product) {
      setProductDisabled(false);
      setPurchaseItem({
        product: product,
        quantity: (1).toFixed(2),
        price: product.p1 ? product.p1.toFixed(2) : (0).toFixed(2),
        discount_surcharge: (0).toFixed(2),
        // Automatically set default unit for simple unit products
        selected_unit: product.unit?.is_complex === 1 
          ? '' // Leave empty for complex units to allow selection
          : product.unit?.first_unit_string || '' // Set default for simple units
      });
      refs.quantity.current.select();
      refs.quantity.current.focus();
    } else {
      setProductDisabled(true);
      setPurchaseItem({
        product: null,
        quantity: "",
        price: "",
        discount_surcharge: "",
        selected_unit: "",
      });
    }
  };

  // Retorna true si el producto tiene al menos dos precios
  const hasAtLeastTwoPrices = (product) => {
    let count = 0;
    if (product.p1 !== undefined) count++;
    if (product.p2 !== undefined) count++;
    if (product.p3 !== undefined) count++;
    return count >= 2;
  };

  // Agregar pago: valida campos, revisa que el monto no supere la deuda y recalcula la deuda
  const handleAddPayment = () => {
    if (!paymentItem.finance_types_payment || !paymentItem.amount) {
      snackbar(`Selecciona medio de pago y monto`);
      return;
    }

    if (!validateDecimal("amount", paymentItem.amount, setErrors, refs.amount))
      return;

    const paymentAmount = new Decimal(
      paymentItem.amount.toString().replace(",", ".") || 0
    );
    const currentDebt = new Decimal(purchase.debt || 0);
    if (paymentAmount.greaterThan(currentDebt)) {
      snackbar(`El pago excede el total a pagar`);
      return;
    }

    const newPayments = [...purchase.payments, structuredClone(paymentItem)];
    const { total, debt } = calculateTotalAndDebt(purchase.items, newPayments);
    setPurchase({
      ...purchase,
      payments: newPayments,
      total,
      debt,
    });

    setPaymentItem({
      finance_types_payment: null,
      amount: "",
    });
  };

  // Remover pago y actualizar la deuda
  const handleRemovePayment = (index) => {
    const updatedPayments = purchase.payments.filter((_, i) => i !== index);
    const { total, debt } = calculateTotalAndDebt(purchase.items, updatedPayments);
    setPurchase({
      ...purchase,
      payments: updatedPayments,
      total,
      debt,
    });
  };

  return (
    <EditPage onSubmit={handleSubmit}>
      <Box sx={{ width: "100%", marginTop: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Fecha y hora"
            value={purchase.date}
            onChange={(newValue) => setPurchase({ ...purchase, date: newValue })}
            renderInput={(params) => <TextField {...params} fullWidth />}
            slotProps={{ textField: { fullWidth: true } }}
            format="DD/MM/YYYY HH:mm"
          />
        </LocalizationProvider>
      </Box>

      <Box display="flex" gap={2} alignItems="center">
        <ListItemWAvatarRemove
          primary={purchase.provider?.name || "SELECCIONAR"}
          onClick={handleSearchProvider}
          onDelete={handleRemoveProvider}
          avatarContent={<StorefrontIcon />}
        />
      </Box>

      {deposits.length > 0 && (
        <Box
          display="flex"
          gap={2}
          width="100%"
          justifyContent="center"
          sx={{ marginTop: 1 }}
        >
          {deposits.length > 0 && (
            <Box flex={1}>
              <DepositSelector
                deposits={deposits}
                value={purchase.deposit}
                onChange={(selected) =>
                  setPurchase((prev) => ({ ...prev, deposit: selected }))
                }
              />
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ marginY: 2 }} />

      <Box display="flex" flexDirection="row" justifyContent="center" alignItems="center" mt={2}>
        <Typography variant="h6" fontWeight="bold" mr={2}>
          Total: {formatCurrency(purchase.total)}
        </Typography>
        {purchase?.debt > 0 && (
          <Typography variant="h6" fontWeight="bold">
            Deuda: {formatCurrency(purchase.debt)}
          </Typography>
        )}
      </Box>

      <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

      <Typography variant="caption">{strings.products_services}</Typography>

      <Box display="flex" gap={1} alignItems="center">
        {/* Product autocomplete with search functionality */}
        <Autocomplete
          fullWidth
          options={products}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={purchaseItem?.product}
          onChange={(e, newValue) => {
            manageInsertSellItem(newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={strings.product_service}
              name="product"
              margin="normal"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  refs.quantity.current.select();
                  refs.quantity.current.focus();
                }
              }}
              inputRef={refs.product}
            />
          )}
        />

        {/* Product search button */}
        <IconButton onClick={handleSearchProduct} sx={{ marginTop: 1 }}>
          <SearchIcon />
        </IconButton>

        {/* Quantity input field:
            - Accepts decimal numbers
            - Right-aligned text
            - Validates input to only allow numbers and decimal separator
            - Auto-focuses on price field when Enter is pressed
        */}
        <TextField
          label="Cantidad"
          type="text"
          inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]*" }}
          value={purchaseItem?.quantity}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.,]/g, "");
            setPurchaseItem({ ...purchaseItem, quantity: value });
          }}
          sx={{ marginTop: 1, "& .MuiInputBase-input": { textAlign: "right" } }}
          disabled={productDisabled}
          inputRef={refs.quantity}
          error={!!errors.quantity}
          helperText={errors.quantity}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              refs.price.current.select();
              refs.price.current.focus();
            }
          }}
        />

        {/* Unit selector - Only displayed for products with complex units */}
        {purchaseItem.product?.unit.is_complex === 1 && (
          <ProductUnitSelector
            product={purchaseItem.product}
            sellItem={purchaseItem}
            setSellItem={setPurchaseItem}
          />
        )}

        {/* Cost */}
        <TextField
          label="Costo"
          type="text"
          inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]*" }}
          value={purchaseItem?.price}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.,]/g, "");
            setPurchaseItem({ ...purchaseItem, price: value });
          }}
          sx={{ marginTop: 1, "& .MuiInputBase-input": { textAlign: "right" } }}
          disabled={productDisabled}
          inputRef={refs.price}
          error={!!errors.price}
          helperText={errors.price}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              refs.discount.current.select();
              refs.discount.current.focus();
            }
          }}
          InputLabelProps={{ shrink: !!purchaseItem?.price }}
        />

        {/* Discount */}  
        <TextField
          label="Descuento (%)"
          type="text"
          inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]*" }}
          value={purchaseItem?.discount_surcharge}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.,]/g, "");
            setPurchaseItem({ ...purchaseItem, discount_surcharge: value });
          }}
          sx={{ marginTop: 1, "& .MuiInputBase-input": { textAlign: "right" } }}
          disabled={productDisabled}
          inputRef={refs.discount}
          error={!!errors.discount}
          helperText={errors.discount}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddProduct();
              refs.product.current.select();
              refs.product.current.focus();
            }
          }}
          InputLabelProps={{ shrink: !!purchaseItem?.discount_surcharge }}
        />

        <IconButton onClick={handleAddProduct} sx={{ marginTop: 1 }}>
          <KeyboardReturnIcon />
        </IconButton>
      </Box>

      {/* Product list */}  
      <Box>
        {purchase.items?.map((item, index) => (
          <ListItemProductRemove
            key={index}
            product={item.product.name}
            description={getDescription(item)}
            subtotal={formatCurrency(
              getSubtotal(item.quantity, item.price, item.discount_surcharge)
            )}
            onDelete={handleRemoveProduct}
            index={index}
            thumbUrl={item.product.thumb_url}
            avatarContent={<InventoryIcon sx={{ fontSize: 20 }} />}
          />
        ))}
      </Box>

      <Divider sx={{ marginTop: 2, marginBottom: 1 }} />

      <Typography variant="caption">Pagos</Typography>

      {/* Payments form */}
      <Box display="flex" gap={1} alignItems="center">
        <Autocomplete
          fullWidth
          options={paymentsTypes}
          getOptionLabel={(option) => (option ? option.name : "")}
          value={paymentItem?.finance_types_payment}
          onChange={(e, newValue) =>
            setPaymentItem({
              ...paymentItem,
              finance_types_payment: newValue,
              amount: purchase.total ? purchase.total.toString() : "",
              date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              id: newValue.id,
              name: newValue.name,
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Medios de pago"
              name="paymentType"
              margin="normal"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  refs.amount.current.select();
                  refs.amount.current.focus();
                }
              }}
              inputRef={refs.amount}
            />
          )}
        />
        <TextField
          label="Monto"
          type="text"
          inputProps={{ inputMode: "decimal", pattern: "[0-9]*[.,]?[0-9]*" }}
          value={paymentItem?.amount}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.,]/g, "");
            setPaymentItem({ ...paymentItem, amount: value });
          }}
          sx={{ marginTop: 1, "& .MuiInputBase-input": { textAlign: "right" } }}
          inputRef={refs.amount}
          error={!!errors.amount}
          helperText={errors.amount}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddPayment();
            }
          }}
        />

        <IconButton onClick={handleAddPayment} sx={{ marginTop: 1 }}>
          <KeyboardReturnIcon />
        </IconButton>
      </Box>

      {/* Payments list */}
      <List>
        {purchase.payments?.map((item, index) => (
          <ListItem
            key={index}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => handleRemovePayment(index)}
                sx={{ width: "42px", height: "42px" }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{ paddingRight: "56px" }}
          >
            <ListItemText
              primary={`${dayjs(item.created_at).format("DD/MM/YYYY")}. ${item.finance_types_payment.name}: ${formatCurrency(item.amount)}`}
            />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ marginY: 2 }} />

    </EditPage>
  );
};

export default EditPurchase;
