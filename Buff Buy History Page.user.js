// ==UserScript==
// @name         Buff Buy History Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows your desired currency value * multiplier.This for determining steam sale price.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/market/buy_order/history*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    //Update currency below with your preferred currency. YOUR_CURRENCY/CNY value
    const CURRENCY = 1.37
    const CURRENCY_SYMBOL = '₺'
    const MULTIPLIER = 2
    jQuery('.list_tb tbody tr').each((i,e)=>{
        const priceContainer = jQuery(e).find('td>strong')
        const mainPrice = priceContainer.text().split(' ')[1]
        const tryPrice = (parseFloat(mainPrice) * MULTIPLIER * CURRENCY).toFixed(2)
        priceContainer.append(`<small> (${CURRENCY_SYMBOL}${tryPrice}) </small>`)
    })
})();

