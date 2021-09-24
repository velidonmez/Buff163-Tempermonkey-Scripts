// ==UserScript==
// @name         Buff Item Details Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add extra information to item details page.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/goods/*
// @grant        none
// ==/UserScript==

(async function() {
    'use strict';
    const discount = function(final,initial){
        final = parseFloat(final)
        initial = parseFloat(initial)
        return -100 *((final-initial)/Math.abs(initial))
    }
    let cheapest = 0
    let steam = 0
    let firstBuy = 0
    //const goodsId = new URLSearchParams(window.location.search).get('goods_id')
    const goodsId = window.location.pathname.split('/')[2]
    const game = jQuery('body').attr('class').trim()
    let items = null
    const disc = await fetch(`https://buff.163.com/api/market/goods/sell_order?game=${game}&goods_id=${goodsId}&page_num=1&sort_by=default`)
    .then(response => response.json())
    .then(data => {
        cheapest = data.data.items[0].price
        steam = data.data.goods_infos[goodsId].steam_price_cny
        return discount(cheapest,steam)
    })
    const profitPercentage = await fetch(`https://buff.163.com/api/market/goods/buy_order?game=${game}&goods_id=${goodsId}&page_num=1`)
    .then(response => response.json())
    .then(data => {
        firstBuy = data.data.items[0].price
        //const steam = data.data.goods_infos[goodsId].steam_price_cny
        return discount(firstBuy,cheapest*0.975)
    })
    const netProfitMargin = (((steam*0.85 - firstBuy)/(steam*0.85))*100).toFixed(2)
    jQuery('.detail-summ').prepend(`<span>You can profit <strong class="f_Strong"><big>${profitPercentage.toFixed(2)}%</big></strong> with buy and sell. |</span>
                                    <span><strong class="f_Strong"><big>${disc.toFixed(2)}%</big></strong> cheaper compared to steam. |</span>
                                    <span class="f_12px f_Bold c_Gray">SCM NPM: <strong class="f_Strong">${netProfitMargin}%</strong></span>
                                   `)

})();