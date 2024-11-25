const fetch = require("node-fetch");

const fetchAsync = async (url) => {
    try {
        const response = await fetch(url, {});
        //if (!responce.ok) return undefined;
        const data = await response.text();
        return data;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

async function get(wtf) {
    let url = '';
    switch (wtf) {
        case 'vpngate':
            url = 'http://www.vpngate.net/api/iphone';
            break;
        default: 
            return false;
    }
    return await fetchAsync(url);
}

module.exports = { get };
