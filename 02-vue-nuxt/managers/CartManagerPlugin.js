// DEPENDENCIES
import CartManager from "./CartManager";

export default {
  install: (Vue) => {
    /* istanbul ignore next */
    Vue.prototype.$cart = new CartManager();
  },
};
