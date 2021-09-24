// ==UserScript==
// @name         Buff Market Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds extra features to the listed items when you click sell or purchase button on the page.This not the ideal way to this propbably.But it works for me so get over it.Warning: You can get banned for using this.Sending too much api requests is not allowed on buff163.Use it carefully.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/market/csgo
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const INTERVAL = 1000
    const discount = function(final, initial) {
        final = parseFloat(final)
        initial = parseFloat(initial)
        return -100 * ((final - initial) / Math.abs(initial))
    }
    function getParameterByName(name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
    jQuery('#buying').click(function() {
        const game = 'csgo'
        const page_num = getParameterByName('page_num')
        const category_group = getParameterByName('category_group')
        const category = getParameterByName('category')
        const min_price = getParameterByName('min_price')
        const max_price = getParameterByName('max_price')
        const quality = getParameterByName('quality')
        const exterior = getParameterByName('exterior')
        const itemset = getParameterByName('itemset')


        const urlSearchParams = {game,page_num,category,category_group}
        if(min_price){urlSearchParams.min_price = min_price}
        if(max_price){urlSearchParams.max_price = max_price}
        if(quality){urlSearchParams.quality = quality}
        if(exterior){urlSearchParams.exterior = exterior}
        if(itemset){urlSearchParams.itemset = itemset}


        setTimeout(function() {
            fetch(`https://buff.163.com/api/market/goods/buying?${new URLSearchParams(urlSearchParams)}`)
                .then(response => response.json())
                .then(data => {
                jQuery('.market-card .list_card ul li').each((i, e) => {
                    jQuery(e).css("height", "+=100");
                    const itemId = jQuery(e).find("a").attr('href').split('?')[0].split('/')[2]
                    const currItem = data.data.items.find(el => el.id == itemId)
                    if (currItem) {
                        const steamPrice = currItem.goods_info.steam_price_cny
                        const discountRate = discount(currItem.buy_max_price, currItem.sell_min_price * 0.975).toFixed(2)
                        const steamRate = discount(currItem.sell_min_price, steamPrice).toFixed(2)
                        const lowestPrice = currItem.buy_max_price <= currItem.sell_min_price ? currItem.buy_max_price : currItem.sell_min_price
                        const netProfitMargin = (((currItem.goods_info.steam_price_cny*0.85 - lowestPrice)/(currItem.goods_info.steam_price_cny*0.85))*100).toFixed(2)
                        if (discountRate <= -7) {
                            jQuery(e).css("background", "#e63946");

                        } else if (discountRate > 16) {
                            jQuery(e).css("background", "#118ab2");

                        }
                        jQuery(e).append(`<p><span class="f_12px f_Bold c_Gray">Buy and sell: <strong class="f_Strong">${discountRate}%</strong></span></p>
                                          <p><span class="f_12px f_Bold c_Gray">SCM NPM: <strong class="f_Strong" ${netProfitMargin>40?'style="color: #DD2F0B"':''}>${netProfitMargin}%</strong></span></p>
                                          <p><span class="f_12px f_Bold c_Gray"><strong class="f_Strong"><small>${steamRate}%</small></strong> cheaper than SCM.</span></p>
                                          <p><a href="${currItem.steam_market_url}" class="f_12px f_Bold c_Gray">Steam Market</a></p>
                        `)
                    }
                })
            })
        }, INTERVAL);
})

    jQuery('#selling').click(function() {
        const game = 'csgo'/*getParameterByName('game')*/
        const page_num = getParameterByName('page_num')
        const category_group = getParameterByName('category_group')
        const category = getParameterByName('category')
        const min_price = getParameterByName('min_price')
        const max_price = getParameterByName('max_price')
        const quality = getParameterByName('quality')
        const exterior = getParameterByName('exterior')
        const itemset = getParameterByName('itemset')

        const urlSearchParams = {game,page_num,category,category_group}
        if(min_price){urlSearchParams.min_price = min_price}
        if(max_price){urlSearchParams.max_price = max_price}
        if(quality){urlSearchParams.quality = quality}
        if(exterior){urlSearchParams.exterior = exterior}
        if(itemset){urlSearchParams.itemset = itemset}


        setTimeout(function() {
            fetch(`https://buff.163.com/api/market/goods?${new URLSearchParams(urlSearchParams)}`)
                .then(response => response.json())
                .then(data => {
                jQuery('.market-card .list_card ul li').each((i, e) => {
                    jQuery(e).css("height", "+=100");
                    const itemId = jQuery(e).find("a").attr('href').split('?')[0].split('/')[2]
                    const currItem = data.data.items.find(el => el.id == itemId)
                    if (currItem) {
                        const steamPrice = currItem.goods_info.steam_price_cny
                        const discountRate = discount(currItem.buy_max_price, currItem.sell_min_price * 0.975).toFixed(2)
                        const steamRate = discount(currItem.sell_min_price, steamPrice).toFixed(2)
                        const lowestPrice = currItem.buy_max_price <= currItem.sell_min_price ? currItem.buy_max_price : currItem.sell_min_price
                        const netProfitMargin = (((currItem.goods_info.steam_price_cny*0.85 - lowestPrice)/(currItem.goods_info.steam_price_cny*0.85))*100).toFixed(2)
                        if (discountRate <= -7) {
                            jQuery(e).css("background", "#e63946");

                        } else if (discountRate > 16) {
                            jQuery(e).css("background", "#118ab2");

                        }
                        jQuery(e).append(`<p><span class="f_12px f_Bold c_Gray">Buy and sell: <strong class="f_Strong">${discountRate}%</strong></span></p>
                                          <p><span class="f_12px f_Bold c_Gray">SCM NPM: <strong class="f_Strong" ${netProfitMargin>40?'style="color: #DD2F0B"':''}>${netProfitMargin}%</strong></span></p>
                                          <p><span class="f_12px f_Bold c_Gray"><strong class="f_Strong"><small>${steamRate}%</small></strong> cheaper than SCM.</span></p>
                                          <p><a href="${currItem.steam_market_url}" target="_blank" class="f_12px f_Bold c_Gray">Steam Market</a></p>
                        `)
                    }
                })
            })
        }, INTERVAL);
    })
})();