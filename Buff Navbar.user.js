// ==UserScript==
// @name         Buff Navbar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add extra buttons to navbar for easy navigation.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
     jQuery('.nav.nav_entries div.game-select').remove()
    jQuery('.nav.nav_entries ul').prepend('<li class="j_drop-handler"> <a href="/market/buy_order/history?game=csgo"><strong>Buy History</strong></a></li><li class="j_drop-handler"> <a href="/market/sell_order/history?game=csgo"><strong>Sell History</strong></a></li>')
})();