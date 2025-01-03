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
import { createCartAndSetCookie, redirectToCheckout } from './actions';
import { useCart } from './cart-context';
import CloseCart from './close-cart';
import { DeleteItemButton } from './delete-item-button';
import { EditItemQuantityButton } from './edit-item-quantity-button';
import OpenCart from './open-cart';

type MerchandiseSearchParams = {
  [key: string]: string;
};

interface CartModalProps {
  initialCart?: Cart;
  isCartPage?: boolean;
  checkoutButton?: React.ReactNode;
}

export default function CartModal({
  initialCart,
  isCartPage = false,
  checkoutButton
}: CartModalProps) {
  const { cart, updateCartItem } = useCart();
  const [isOpen, setIsOpen] = useState(isCartPage);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

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

  return (
    <>
      {!isCartPage && (
        <button aria-label="Open cart" onClick={openCart}>
          <OpenCart quantity={cart?.totalQuantity} />
        </button>
      )}

      {isCartPage ? (
        <div className="w-full">
          {!cart || cart.lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <ShoppingCartIcon className="h-16 text-[#6B5E4C]" />
              <p className="mt-6 text-center text-2xl font-bold text-[#6B5E4C]">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <CartContent cart={cart} updateCartItem={updateCartItem} closeCart={closeCart} />
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
                                  <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
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
                    {checkoutButton}
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

function CheckoutButton() {
  const [isPending, setIsPending] = useState(false);

  return (
    <button
      className="block w-full rounded-full bg-accent-600 p-3 text-sm font-medium text-primary-50 opacity-90 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
      type="submit"
      disabled={isPending}
      onClick={() => setIsPending(true)}
    >
      {isPending ? <LoadingDots className="bg-primary-50" /> : 'Proceed to Checkout'}
    </button>
  );
}

function CartContent({
  cart,
  updateCartItem,
  closeCart
}: {
  cart: Cart;
  updateCartItem: (merchandiseId: string, type: 'plus' | 'minus' | 'delete') => void;
  closeCart: () => void;
}) {
  return (
    <div className="flex h-full flex-col justify-between overflow-hidden">
      <ul className="flex-grow overflow-auto py-4">
        {cart.lines
          .sort((a, b) => a.merchandise.product.title.localeCompare(b.merchandise.product.title))
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
                    <DeleteItemButton item={item} optimisticUpdate={updateCartItem} />
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
                        <span className="leading-tight">{item.merchandise.product.title}</span>
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
      <form action={redirectToCheckout}>
        <CheckoutButton />
      </form>
    </div>
  );
}
