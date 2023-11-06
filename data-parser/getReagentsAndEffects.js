import puppeteer from 'puppeteer';
import fs from 'fs/promises'
import crypto from 'crypto'

// Launch the browser and open a new blank page
  const browser = await puppeteer.launch({headless: 'new'});
  const page = await browser.newPage();

  page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.goto(`https://en.uesp.net/wiki/Online:Alchemy_Ingredients`);

  const selector = await page.waitForSelector('table.wikitable > tbody');

  await selector.$$eval('tr', trs => {
    const effectsMap = {};
    const reagents = trs.map(tr => {
        const imgHref = tr.querySelector('td:nth-child(1) > a > img').src
        const reagentName = tr.querySelector('td:nth-child(2) > b > a').innerText
        const reagentWikiURL = tr.querySelector('td:nth-child(2) > b > a').href
        const comesFrom = tr.querySelector('td:nth-child(7)').innerHTML

        const effects = ['3', '4', '5', '6'].map(n => {
            const td = tr.querySelector(`td:nth-child(${n})`);
            const effectName = td.querySelector(`b > a`).innerText;
            const effectWikiURL = td.querySelector(`b > a`).href;
            const effectImgSrc = td.querySelector(`a > img`).src;
            const effectType = td.className
            const result = {
                effectName,
                effectWikiURL,
                effectImgSrc,
                effectType
            }
            if(!effectsMap[effectName]) effectsMap[effectName] = result
            return effectsMap[effectName]
        })

        return {imgHref, reagentName, reagentWikiURL, effects, comesFrom}
    })
    return {reagents, effectsMap} 
  }).then(res => fs.writeFile('res.json', JSON.stringify(res, null, 2)));
  await browser.close();