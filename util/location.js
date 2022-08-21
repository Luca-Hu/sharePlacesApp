const axios = require('axios');
const API_KEY = process.env.GOOGLE_API_KEY;
const HttpError = require('../models/http-error'); 

async function getCoordsForAddress(address){ // async fucntion: 它的返回值不是立刻的，也不是同步的，而是异步的，一直等待await的响应。
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
        address
        )}&fields=geometry&key=${API_KEY}`);
    // `` 在js中允许你创建一个字符串并在其中轻松插入动态段： ${ }
    // encodeURIComponent() : 用于去除字符串中的特殊字符
    // fields 限制 API 的响应返回内容
    const data = response.data; // axios 提供 .data 来保存数据

    if(!data || data.status === 'ZREO_RESULTS'){
        const error = new HttpError('Could not find location for the specific address.', 422);
        throw error; // 如果在异步函数中抛出错误，那么所有内容的promise 也都会抛出这个错误
    }

    const coordinates = data.results[0].geometry.location; // data的结构见 google map api docs。 在api返回的data中找到坐标位置。
    return coordinates;
}

module.exports = getCoordsForAddress;