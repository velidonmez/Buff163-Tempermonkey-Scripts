// ==UserScript==
// @name         Buff Sales History Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  How much you did you earn after 2.5% commission is calculated.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/market/sell_order/history*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    jQuery('.list_tb tbody tr').each((i,e)=>{
        const priceContainer = jQuery(e).find('td>strong')
        const mainPrice = priceContainer.text().split(' ')[1]
        const netGain = (parseFloat(mainPrice) * 0.975).toFixed(2)
        priceContainer.append(`<small> (¥ ${netGain}) </small>`)
    })
})();