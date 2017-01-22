importScripts('./lib/marked.min.js', './lib/highlight.min.js');

// var marked = null

var renderer = new marked.Renderer();
renderer.code=function (code,lang) {
    var before = '<div class="pre-before">Copy</div>';

    var input = d.createElement('textarea')
    input.style.display='none'
    input.innerHTML = code
    
    return '<pre>' + before + input.outerHTML + 
        '<code>'+hljs.highlightAuto(code).value+'</code></pre>';
};
renderer.listitem = function(text) {
    if (/^\s*\[[x ]\]\s*/.test(text)) {
        text = text
        .replace(/^\s*\[ \]\s*/, '<input style="vertical-align: middle;" type="checkbox" disabled/> ')
        .replace(/^\s*\[x\]\s*/, '<input style="vertical-align: middle;" type="checkbox" checked="true" disabled/> ');
            return '<li style="list-style: none">' + text + '</li>';
        } else {
            return '<li>' + text + '</li>';
    }
};
// renderer.headmap = {}
renderer.heading = function (text, level) {
    // var map = renderer.headmap;
    var escapedText = text.toLowerCase();
 //    if(!!map[text])
 //        escapedText+='-'+map[text]++;
 //    else
 //        map[text]=1;
 //    escapedText = ''
    return '<h' + level + '><a name="' +
        escapedText +
        '" class="anchor" href="#' +
        escapedText +
        '"><span class="header-link"></span></a>' +
        text + '</h' + level + '>';
};
renderer.image = function(href, title, text) {
    var wd = w.localStorage['current_fpath'] && w.localStorage['current_fpath'] || ''
    if(!href.startsWith('http')) {
        if(href.startsWith('/upload')) {
            return `<img src="file://${w.nPath.join(wd, '..', '..', href)}" alt=${text} />`
        }
        return `<img src="file://${w.nPath.join(wd, '..', href)}" alt=${text} />`
    }
    return `<img src="${href}" alt=${text} />`
}
renderer.link = function(href, title, text) {
    
    var wd = w.localStorage['current_fpath'] && w.localStorage['current_fpath'] || ''
    
    if(!href.startsWith('http')) {
        return `<a href="file://${w.nPath.join(wd, '..', href)}" target="_blank" >${text}</a>`
    }
    return `<a href="${href}" target="_blank" >${text}</a>`
}


onmessage = function(message) {
    var data=message.data;

    var md = data.markdown;
    var html = marked(md);

    postMessage({html: html});
}

