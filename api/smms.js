// https://sm.ms/api/upload
var FormData = require('form-data');
var https = require('https');
var md5 = require('./utils').md5;
var form = new FormData();

module.exports = {
    upload(buffer) {
        if(buffer.length>=1024*1024*5) {
            return Promise.reject(false);
        }
        var form = new FormData();
        // form.append('file_id', ''+Date.now());
        form.append('smfile', buffer, {
            filename: md5(buffer)
        });

        return new Promise((resolve, reject) => {
            var request = https.request({
                method: 'post',
                hostname: 'sm.ms',
                path: '/api/upload',
                headers: form.getHeaders()
            }, (res) => {
                var all = '';
                res.on('data', chunk => all+=chunk)
                res.on('end', () => {
                    all = JSON.parse(all);
                    resolve(all.code == 'success' && all.data && all.data.url)
                })
            }).on('error', () => resolve(false));

            form.pipe(request);
        })
    }
}
