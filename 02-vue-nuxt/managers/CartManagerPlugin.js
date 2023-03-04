// DEPENDENCIES
import CartManager from "./CartManager";

export default {
  install: (Vue) => {
    Vue.prototype.$cart = new CartManager();
  },
};
