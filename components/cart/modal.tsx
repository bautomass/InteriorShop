//components/cart/modal.tsx
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import LoadingDots from 'components/loading-dots';
import Price from 'components/price';
import { DEFAULT_OPTION } from 'lib/constants';
import type { Cart } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useRef, useState } from 'react';
import { createCartAndSetCookie } from './actions';
import { useCart } from './cart-context';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal({
  initialCart,
  isCartPage = false
}: {
  initialCart?: Cart;
  isCartPage?: boolean;
}) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(isCartPage);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const handleCheckout = async () => {
    console.log('Checkout attempted:', {
      hasCart: !!cart,
      checkoutUrl: cart?.checkoutUrl,
      isCheckingOut
    });
    
    if (!cart || !cart.lines?.length) {
      console.error('Cart is empty or not initialized');
      return;
    }
    
    if (!cart.checkoutUrl && cart.lines.length > 0) {
      try {
        await createCartAndSetCookie();
        return;
      } catch (error) {
        console.error('Failed to create new cart:', error);
        return;
      }
    }
    
    setIsCheckingOut(true);
    try {
      console.log('Redirecting to:', cart.checkoutUrl);
      window.location.assign(cart.checkoutUrl!);
    } catch (error) {
      console.error('Checkout error:', error);
      setIsCheckingOut(false);
    }
  };

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      if (!isOpen) {
        setIsOpen(true);
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef]);

  useEffect(() => {
    if (cart) {
      console.log('Cart State:', {
        hasItems: cart.lines?.length > 0,
        checkoutUrl: cart.checkoutUrl,
        totalQuantity: cart.totalQuantity
      });
    }
  }, [cart]);

  const isCheckoutDisabled = !cart?.lines?.length || isCheckingOut;

  return (
    <>
      {!isCartPage && (
        <button aria-label="Open cart" onClick={openCart}>
          <OpenCart quantity={cart?.totalQuantity} />
        </button>
      )}

      {isCartPage ? (
        <div className="w-full">
          {!cart || (cart.lines?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingCartIcon className="h-16 text-neutral-300" />
              <p className="mt-6 text-center text-2xl font-medium text-neutral-400">
                Your cart is empty
              </p>
              <p className="mt-2 text-center text-sm text-neutral-500">
                Add some items to start shopping
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Cart Items */}
              <div className="divide-y divide-neutral-100">
                {cart.lines.map((item, i) => (
                  <div key={i} className="flex py-6 first:pt-0">
                    {/* Product Image */}
                    <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-100 bg-neutral-50">
                      <Image
                        src={item.merchandise.product.featuredImage.url}
                        alt={item.merchandise.product.title}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-neutral-900">
                            {item.merchandise.product.title}
                          </h3>
                          {item.merchandise.title !== DEFAULT_OPTION && (
                            <p className="mt-1 text-sm text-neutral-500">
                              {item.merchandise.title}
                            </p>
                          )}
                        </div>
                        <Price
                          className="text-sm font-medium text-neutral-900"
                          amount={item.cost.totalAmount.amount}
                          currencyCode={item.cost.totalAmount.currencyCode}
                        />
                      </div>

                      {/* Quantity Controls */}
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <DeleteItemButton
                            item={item}
                            optimisticUpdate={updateCartItem}
                          />
                        </div>
                        <div className="flex items-center rounded-lg border border-neutral-200">
                          <EditItemQuantityButton
                            item={item}
                            type="minus"
                            optimisticUpdate={updateCartItem}
                          />
                          <span className="px-3 text-sm font-medium text-neutral-600">
                            {item.quantity}
                          </span>
                          <EditItemQuantityButton
                            item={item}
                            type="plus"
                            optimisticUpdate={updateCartItem}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="rounded-lg bg-neutral-50 p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-neutral-600">Subtotal</p>
                    <Price
                      className="font-medium text-neutral-900"
                      amount={cart.cost.totalAmount.amount}
                      currencyCode={cart.cost.totalAmount.currencyCode}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-neutral-600">Shipping</p>
                    <p className="font-medium text-neutral-900">Free</p>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-neutral-600">Tax</p>
                    <Price
                      className="font-medium text-neutral-900"
                      amount={cart.cost.totalTaxAmount.amount}
                      currencyCode={cart.cost.totalTaxAmount.currencyCode}
                    />
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-base font-medium text-neutral-900">Total</p>
                      <Price
                        className="text-lg font-medium text-neutral-900"
                        amount={cart.cost.totalAmount.amount}
                        currencyCode={cart.cost.totalAmount.currencyCode}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckoutDisabled}
                  className="mt-6 w-full rounded-lg bg-[#8B4513] px-6 py-3 text-center text-base 
                    font-medium text-white shadow-sm transition-all duration-150 
                    hover:bg-[#723710] focus:outline-none focus:ring-2 focus:ring-[#8B4513] 
                    focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <LoadingDots className="bg-white" />
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Transition show={isOpen}>
          <Dialog onClose={closeCart} className="relative z-50">
            <Transition.Child
              as={Fragment}
              enter="transition-all ease-in-out duration-300"
              enterFrom="opacity-0 backdrop-blur-none"
              enterTo="opacity-100 backdrop-blur-[.5px]"
              leave="transition-all ease-in-out duration-200"
              leaveFrom="opacity-100 backdrop-blur-[.5px]"
              leaveTo="opacity-0 backdrop-blur-none"
            >
              <div className="fixed inset-0 bg-primary-900/30" aria-hidden="true" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition-all ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition-all ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-primary-200 bg-primary-50/80 p-6 text-primary-900 backdrop-blur-xl dark:border-primary-700 dark:bg-primary-900/80 dark:text-primary-50 md:w-[390px]">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold">My Cart</p>
                  <button aria-label="Close cart" onClick={closeCart}>
                    <CloseCart />
                  </button>
                </div>

                {!cart || cart.lines.length === 0 ? (
                  <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                    <ShoppingCartIcon className="h-16 text-primary-600 dark:text-primary-400" />
                    <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
                  </div>
                ) : (
                  <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                    <ul className="flex-grow overflow-auto py-4">
                      {cart.lines
                        .sort((a, b) =>
                          a.merchandise.product.title.localeCompare(b.merchandise.product.title)
                        )
                        .map((item, i) => {
                          const merchandiseSearchParams = {} as MerchandiseSearchParams;

                          item.merchandise.selectedOptions.forEach(({ name, value }) => {
                            if (value !== DEFAULT_OPTION) {
                              merchandiseSearchParams[name.toLowerCase()] = value;
                            }
                          });

                          const merchandiseUrl = createUrl(
                            `/product/${item.merchandise.product.handle}`,
                            new URLSearchParams(merchandiseSearchParams)
                          );

                          return (
                            <li
                              key={i}
                              className="flex w-full flex-col border-b border-primary-200 dark:border-primary-700"
                            >
                              <div className="relative flex w-full flex-row justify-between px-1 py-4">
                                <div className="absolute z-40 -ml-1 -mt-2">
                                  <DeleteItemButton
                                    item={item}
                                    optimisticUpdate={updateCartItem}
                                  />
                                </div>
                                <div className="flex flex-row">
                                  <div className="relative h-16 w-16 overflow-hidden rounded-md border border-primary-200 bg-primary-100 dark:border-primary-700 dark:bg-primary-800">
                                    <Image
                                      className="h-full w-full object-cover"
                                      width={64}
                                      height={64}
                                      alt={
                                        item.merchandise.product.featuredImage.altText ||
                                        item.merchandise.product.title
                                      }
                                      src={item.merchandise.product.featuredImage.url}
                                    />
                                  </div>
                                  <Link
                                    href={merchandiseUrl}
                                    onClick={closeCart}
                                    className="z-30 ml-2 flex flex-row space-x-4"
                                  >
                                    <div className="flex flex-1 flex-col text-base">
                                      <span className="leading-tight">
                                        {item.merchandise.product.title}
                                      </span>
                                      {item.merchandise.title !== DEFAULT_OPTION ? (
                                        <p className="text-sm text-primary-500 dark:text-primary-400">
                                          {item.merchandise.title}
                                        </p>
                                      ) : null}
                                    </div>
                                  </Link>
                                </div>
                                <div className="flex h-16 flex-col justify-between">
                                  <Price
                                    className="flex justify-end space-y-2 text-right text-sm"
                                    amount={item.cost.totalAmount.amount}
                                    currencyCode={item.cost.totalAmount.currencyCode}
                                  />
                                  <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-primary-200 dark:border-primary-700">
                                    <EditItemQuantityButton
                                      item={item}
                                      type="minus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                    <p className="w-6 text-center">
                                      <span className="w-full text-sm">{item.quantity}</span>
                                    </p>
                                    <EditItemQuantityButton
                                      item={item}
                                      type="plus"
                                      optimisticUpdate={updateCartItem}
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                    <div className="py-4 text-sm text-primary-500 dark:text-primary-400">
                      <div className="mb-3 flex items-center justify-between border-b border-primary-200 pb-1 dark:border-primary-700">
                        <p>Taxes</p>
                        <Price
                          className="text-right text-base text-primary-900 dark:text-primary-50"
                          amount={cart.cost.totalTaxAmount.amount}
                          currencyCode={cart.cost.totalTaxAmount.currencyCode}
                        />
                      </div>
                      <div className="mb-3 flex items-center justify-between border-b border-primary-200 pb-1 pt-1 dark:border-primary-700">
                        <p>Shipping</p>
                        <p className="text-right">Calculated at checkout</p>
                      </div>
                      <div className="mb-3 flex items-center justify-between border-b border-primary-200 pb-1 pt-1 dark:border-primary-700">
                        <p>Total</p>
                        <Price
                          className="text-right text-base text-primary-900 dark:text-primary-50"
                          amount={cart.cost.totalAmount.amount}
                          currencyCode={cart.cost.totalAmount.currencyCode}
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutDisabled}
                      className="block w-full rounded-full bg-[#8B4513] p-3 text-sm font-medium text-primary-50 opacity-90 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCheckingOut ? (
                        <LoadingDots className="bg-primary-50" />
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </Dialog>
        </Transition>
      )}
    </>
  );
}

