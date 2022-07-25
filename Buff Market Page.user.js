// ==UserScript==
// @name         Buff Market Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds extra features to the listed items when you click sell or purchase button on the page.This not the ideal way to this propbably.But it works for me so get over it.Warning: You can get banned for using this.Sending too much api requests is not allowed on buff163.Use it carefully.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/market/csgo
// @grant        none
// ==/UserScript==

(function () {
    'use strict'

    const INTERVAL = 1000

    const discount = function (final, initial) {
        final = parseFloat(final)
        initial = parseFloat(initial)
        return -100 * ((final - initial) / Math.abs(initial))
    }

    const getParameterByName = function (name, url = window.location.href) {
        name = name.replace(/[\[\]]/g, '\\$&')
        const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
        const results = regex.exec(url)
        if (!results) { return null }
        if (!results[2]) { return '' }
        return decodeURIComponent(results[2].replace(/\+/g, ' '))
    }

    const setParams = function () {
        const game = 'csgo'
        const page_num = getParameterByName('page_num')
        const category_group = getParameterByName('category_group')
        const category = getParameterByName('category')
        const min_price = getParameterByName('min_price')
        const max_price = getParameterByName('max_price')
        const quality = getParameterByName('quality')
        const exterior = getParameterByName('exterior')
        const itemset = getParameterByName('itemset')

        const urlSearchParams = {
            game,
            page_num,
            category,
            category_group
        }
        if (min_price) {
            urlSearchParams.min_price = min_price
        }
        if (max_price) {
            urlSearchParams.max_price = max_price
        }
        if (quality) {
            urlSearchParams.quality = quality
        }
        if (exterior) {
            urlSearchParams.exterior = exterior
        }
        if (itemset) {
            urlSearchParams.itemset = itemset
        }
        return urlSearchParams
    }

    jQuery('.block-header').prepend('<a href="javascript:void(0)" class="i_Btn i_Btn_hollow" id="listItems" style="line-height:42px;">List</a>')

    jQuery('#listItems').click(function () {
        jQuery('#j_list_card').remove()
        jQuery('.pager.card-pager').remove()
        const urlSearchParams = setParams()

        fetch(`https://buff.163.com/api/market/goods?${new URLSearchParams(urlSearchParams)}`)
            .then(response => response.json())
            .then((data) => {
                jQuery('#j_market_card').append('<ul class="card_csgo" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;" id="generatedList"></ul>')
                jQuery('#generatedList').empty()

                data?.data?.items?.forEach((currItem) => {
                    const listEl = jQuery('<li style="display:flex;align-items:center;padding:20px;gap:16px;border:2px solid black;justify-content:space-between;"></li>')
                    const steamPrice = currItem.goods_info.steam_price_cny
                    const discountRate = discount(currItem.buy_max_price, currItem.sell_min_price * 0.975).toFixed(2)
                    const steamRate = discount(currItem.sell_min_price, steamPrice).toFixed(2)
                    const lowestPrice = currItem.buy_max_price <= currItem.sell_min_price ? currItem.buy_max_price : currItem.sell_min_price
                    const netProfitMargin = (((currItem.goods_info.steam_price_cny * 0.85 - lowestPrice) / (currItem.goods_info.steam_price_cny * 0.85)) * 100).toFixed(2)
                    const itemContent =
                        `
                            <div style="display:flex;flex-direction:column;gap:8px;">
                                <strong class="f_Strong">
                                    <a href="/goods/${currItem.id}?from=market#tab=selling" title="${currItem.name}">${currItem.name}</a>
                                </strong>
                                <a style="display: flex;justify-content: center;" href="/goods/${currItem.id}?from=market#tab=selling" title="${currItem.name}">
                                    <img src="${currItem.goods_info.original_icon_url}" width="84" height="84">
                                </a>
                            </div>
                            <div style="display:flex;flex-direction:column;">
                                <p><strong class="f_Strong">¥ ${currItem.sell_min_price}</strong><span class="l_Right f_12px f_Bold c_Gray">${currItem.sell_num} on sale</span></p>
                                <p><span class="f_12px f_Bold c_Gray">Buy and sell: <strong class="f_Strong">${discountRate}%</strong></span></p>
                                <p><span class="f_12px f_Bold c_Gray">SCM NPM: <strong class="f_Strong" ${netProfitMargin > 40 ? 'style="color: #DD2F0B"' : ''}>${netProfitMargin}%</strong></span></p>
                                <p><span class="f_12px f_Bold c_Gray"><strong class="f_Strong"><small>${steamRate}%</small></strong> cheaper than SCM.</span></p>
                                <p><a href="${currItem.steam_market_url}" class="f_12px f_Bold c_Gray">Steam Market</a></p>
                                <button class="buyItem" onclick="triggerBuy(${currItem.id})">Click me</button>
                            </div>
                        `
                    if (discountRate <= -7) {
                        jQuery(listEl).append(itemContent)
                        jQuery(listEl).css('background', '#e63946')
                        jQuery('#generatedList').append(listEl)
                    } else if (discountRate > 16) {
                        jQuery(listEl).append(itemContent)
                        jQuery(listEl).css('background', '#118ab2')
                        jQuery('#generatedList').append(listEl)
                    }
                })
            })
    })

    jQuery('#buying').click(function () {
        const urlSearchParams = setParams()
        setTimeout(function () {
            fetch(`https://buff.163.com/api/market/goods/buying?${new URLSearchParams(urlSearchParams)}`)
                .then(response => response.json())
                .then((data) => {
                    jQuery('.market-card .list_card ul li').each((i, e) => {
                        jQuery(e).css('height', '+=100')
                        const itemId = jQuery(e).find('a').attr('href').split('?')[0].split('/')[2]
                        const currItem = data.data.items.find(el => el.id == itemId)
                        if (currItem) {
                            const steamPrice = currItem.goods_info.steam_price_cny
                            const discountRate = discount(currItem.buy_max_price, currItem.sell_min_price * 0.975).toFixed(2)
                            const steamRate = discount(currItem.sell_min_price, steamPrice).toFixed(2)
                            const lowestPrice = currItem.buy_max_price <= currItem.sell_min_price ? currItem.buy_max_price : currItem.sell_min_price
                            const netProfitMargin = (((currItem.goods_info.steam_price_cny * 0.85 - lowestPrice) / (currItem.goods_info.steam_price_cny * 0.85)) * 100).toFixed(2)
                            if (discountRate <= -7) {
                                jQuery(e).css('background', '#e63946')
                            } else if (discountRate > 16) {
                                jQuery(e).css('background', '#118ab2')
                            }
                            jQuery(e).append(`
                                            <p><span class="f_12px f_Bold c_Gray">Buy and sell: <strong class="f_Strong">${discountRate}%</strong></span></p>
                                            <p><span class="f_12px f_Bold c_Gray">SCM NPM: <strong class="f_Strong" ${netProfitMargin > 40 ? 'style="color: #DD2F0B"' : ''}>${netProfitMargin}%</strong></span></p>
                                            <p><span class="f_12px f_Bold c_Gray"><strong class="f_Strong"><small>${steamRate}%</small></strong> cheaper than SCM.</span></p>
                                            <p><a href="${currItem.steam_market_url}" class="f_12px f_Bold c_Gray">Steam Market</a></p>
                                            `)
                        }
                    })
                })
        }, INTERVAL)
    })

    window.triggerBuy = function (itemId) {
        fetch(`https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${itemId}&page_num=1&sort_by=default`)
            .then(response => response.json())
            .then(data => {
                const cheapestItem = data.data.items[0]
                const buyButton = 
                                `
                                    <a href="javascript:void(0)"
                                      class="i_Btn i_Btn_mid2 btn-buy-order"
                                      data-goodsid="${cheapestItem.goods_id}"
                                      data-price="${cheapestItem.price}"
                                      data-orderid="${cheapestItem.id}"
                                      data-sellerid="${cheapestItem.user_id}"
                                      data-goods-name=""
                                      data-goods-sell-min-price=""
                                      data-goods-icon-url="${cheapestItem.img_src}"
                                      data-cooldown="false"
                                      data-mode="${cheapestItem.mode}"
                                      data-asset-info="${JSON.stringify(cheapestItem.asset_info)}">
                                        Buy
                                    </a>
                                `
                jQuery('body').append(buyButton)
                jQuery(`[data-orderid=${cheapestItem.id}]`).trigger("click")
            })

    }
})()
