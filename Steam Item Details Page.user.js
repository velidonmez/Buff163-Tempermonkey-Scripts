// ==UserScript==
// @name         Steam Item Details Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script adds a link to steam that redirects to buff163 item search page. Also shows item's usd and cny value.
// @author       https://github.com/velidonmez
// @match        https://steamcommunity.com/market/listings/730/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    const locationArr = window.location.href.split('/')
    const itemName = locationArr[locationArr.length-1]
    const rmbValue = await fetch(`https://steamcommunity.com/market/priceoverview/?currency=23&appid=730&market_hash_name=${itemName}`)
        .then(response => response.json())
        .then(data => data.lowest_price)
    const usdValue = await fetch(`https://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=${itemName}`)
        .then(response => response.json())
        .then(data => data.lowest_price)
    console.log(rmbValue,usdValue)
    jQuery('.market_listing_largeimage').append(`<h1 class="market_title_text">RMB VALUE: ${rmbValue}</h1><h1 class="market_title_text">USD VALUE: ${usdValue}</h1><a href="https://buff.163.com/market/?game=csgo#tab=selling&page_num=1&search=${itemName}" target="_blank" class="market_title_text">Search at BUFF</h1>`)
})();