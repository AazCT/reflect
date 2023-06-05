const fetch = require("node-fetch");

const qiwi_url = 'https://edge.qiwi.com/sinap/crossRates';

const fetchAsync = async (url) => {
    try {
        let response = await fetch(url, {});
        let data = await response.json();
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

const getRate = async () => {
    const data = await fetchAsync(qiwi_url);
    let fres = 0;
    if (data) {
        data.result.forEach(el => {
            if ((el.from === '643') && (el.to === '398')){
                fres = el.rate;
                //console.log('Tenge rate: ' + fres);
                return fres;
            }
        });
    }
    return fres;
}

const getTenge = async (tenge = 0) => {
    const clearIt = (it) => {
        if (typeof it === 'number') {
            return it;
        }
        return it.replace(/\s/g,'').replace('₸', '').replace(',', '.');
    }
    const rate = await getRate();
    if (rate === 0) {
        console.log(`Не удалось получить курс валют!`);
        return 0;
    }
    const ten = clearIt(tenge);
    if (!(ten * 1)) {
        console.log(`"${ten}" - это неверное значение!`);
        return 0;
    }
    let res = ten * rate;
    res = res.toFixed(2).replace('.', ',');
    //console.log(`${ten} тенге в рублях: ${res}`);
    return res;
}

const getTengeFunc = async (tenge) => {
    return await getTenge(tenge);
}

module.exports = { getTengeFunc }