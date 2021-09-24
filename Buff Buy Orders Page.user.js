// ==UserScript==
// @name         Buff Buy Orders Page
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script adds ad button that checks net profit margin for all listed buy orders.
// @author       https://github.com/velidonmez
// @match        https://buff.163.com/market/buy_order/wait_supply*
// @grant        none
// ==/UserScript==

(function() {
    const sleep = m => new Promise(r => setTimeout(r, m))
    const mp3_url = 'https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3';

    let ids = []
    jQuery('.criteria').prepend(`<button type="button" class="calculate i_Btn i_Btn_hollow" id="calc">Check NPM</button>`)
    jQuery('#calc').click(async function(){
        for (const [index, itemId] of ids.entries()){
            await sleep(3000)
            const steamPrice = await fetch(`https://buff.163.com/api/market/goods/sell_order?game=csgo&goods_id=${itemId}&page_num=1&sort_by=default`)
            .then(response => response.json())
            .then(data => {
                return data.data.goods_infos[itemId].steam_price_cny
            })
            const npm = await fetch(`https://buff.163.com/api/market/goods/buy_order?game=csgo&goods_id=${itemId}&page_num=1`)
            .then(response => response.json())
            .then(data => {
                return (((steamPrice*0.85 - data.data.items[0].price)/(steamPrice*0.85))*100).toFixed(2)
            })
            jQuery(`#calculate-${index}`).html(npm+'%')
        }
        (new Audio(mp3_url)).play()
    })

    jQuery('.detail-tab-cont table tbody tr').each((i,e)=>{
        const td = jQuery(e).find('td')
        const pPrice = jQuery(td[3]).text().split('(')[0].split(' ')[2]
        const mPrice = jQuery(td[4]).text().split('(')[0].split(' ')[2]
        if(parseFloat(mPrice) > parseFloat(pPrice)){
            jQuery(e).css('background-color','#ff3333')
        }
        const itemId = jQuery(e).find('.name-cont a').attr('href').split('/')[2]
        jQuery(e).append(`<td class="t_Left"> <strong class="f_Strong calculate" id="calculate-${i}">N/A</strong> </td>`)
        ids.push(itemId)
    })
})();