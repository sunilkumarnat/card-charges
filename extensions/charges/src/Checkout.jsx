
import {
  reactExtension,
  useSelectedPaymentOptions,
  useTotalAmount,
  useApplyCartLinesChange,
  useCartLines,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect } from "react";


// 1. Choose an extension target
export default reactExtension("purchase.checkout.cart-line-list.render-after", () => (
  <Extension />
));

function Extension() {
  const cartLines = useCartLines();
  const applyCartLinesChange = useApplyCartLinesChange();
  const selectedPaymentOption = useSelectedPaymentOptions();
  const totalAmount = useTotalAmount();
  const productVariantId = "gid://shopify/ProductVariant/42337569865837";



  const checkCardChargesInLineItems = () => {
    let resp = false;
    cartLines.find((lineItem) => {
      if (lineItem.merchandise.id === productVariantId) {
        resp = true;
      }
    });
    return resp;
  }
  

  const addCardCharges = async() => {

    const charges = (totalAmount.amount * 2.5) / 100;

    const lineItem = {
      merchandiseId: productVariantId,
      type:"addCartLine",
      title: "Credit Card Charges",
      quantity: 1,
      attributes: [
        {
          key: "Description",
          value: "2.5% On Total Order Amount"
        }
      ],
      price: { amount: charges.toString(), currencyCode: totalAmount.currencyCode },
    };
    const isCardCkargesInLineItems = checkCardChargesInLineItems();
    if(isCardCkargesInLineItems){
      removeCardCharges();
    }
    applyCartLinesChange(lineItem);
    
  }
  const removeCardCharges = () => {
    const cartLineId = cartLines.find((lineItem) => lineItem.merchandise.id === productVariantId) ?.id;
    if(cartLineId) applyCartLinesChange({type: "removeCartLine", id: cartLineId, quantity: 1});
  }

  useEffect(() => {
    selectedPaymentOption[0].type === 'creditCard' ? addCardCharges() : removeCardCharges() ;
  }, [selectedPaymentOption[0].type, cartLines]);
  

  return null;
}