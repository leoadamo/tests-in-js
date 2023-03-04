// DEPENDENCIES
import { mount } from "@vue/test-utils";
import CartManager from "@/managers/CartManager";

// COMPONENTS
import DefaultLayout from "@/layouts/default";
import TheCart from "@/components/TheCart";

describe("Default Layout - Unit", () => {
  /**
   * Mounts the default layout component.
   *
   * @returns {object} The wrapper instance.
   */
  function mountLayout() {
    const wrapper = mount(DefaultLayout, {
      mocks: {
        $cart: new CartManager(),
      },
      stubs: {
        Nuxt: true,
      },
    });

    return { wrapper };
  }

  it("Should mount the cart.", () => {
    const { wrapper } = mountLayout();

    expect(wrapper.findComponent(TheCart).exists()).toBe(true);
  });

  it("Should toggle the cart.", async () => {
    const { wrapper } = mountLayout();

    const toggleButton = wrapper.find('[data-testid="toggle-button"]');

    await toggleButton.trigger("click");
    expect(wrapper.vm.isOpen).toBe(true);

    await toggleButton.trigger("click");
    expect(wrapper.vm.isOpen).toBe(false);
  });
});
