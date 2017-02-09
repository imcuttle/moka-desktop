const sizeOf = require('image-size');
var url = require('url');
var path = require('path');

const isUrlString = str => url.parse(str).slashes

const getImageSizeFromUrl_Path = (src) => {
    const ops = url.parse(src);
    return ops.slashes ? getImgSizeFromURL(src) : getImgSizeFromPath(src)
}

const getImgSizeFromURL = (url) => {
    const ops = url.parse(imgUrl);
    const protocol = ops.protocol.replace(/:$/, '');
    let protocolPackage;
    if (protocol === 'http' || protocol === 'https') {
        protocolPackage = require(protocol);
    } else {
        return Promise.reject("illegal protocol: " + protocol)
    }

    return new Promise( function (resolve, reject) {
        protocolPackage.get(url, function (res) {
            let statusCode = res.statusCode;
            if (statusCode === 302 || statusCode === 301) {
                console.log(url, statusCode, "=>", res.headers['location']);
                return getImgSizeFromURL(res.headers['location'])
            }
            const chunks = []
            res.on('data', function (chunk) {
                chunks.push(chunk);
            }).on('end', () => {
                const buffer = Buffer.concat(chunks);
                const size = sizeOf(buffer);
                console.log(url, "<=>", size);
                resolve(size);
            })
        }).on('error', (err) => reject(err.message))
    })
}


const getImgSizeFromPath = (path) => {
    return new Promise((resolve, reject) => {
        sizeOf(path, (err, size) => {
            if (err) reject(err.message);
            else {
                console.log(path, "<=>", reject)
                resolve(size);
            }
        })
    })
}


module.exports = {
    getImgSizeFromURL,
    getImgSizeFromBuffer: sizeOf
}