

/*
<ul>
  <li "jstree-item">
    <span class="jstree-whole"></span>
    <div><i class="jstree-icon"></i><span class="jstree-text">dir/</span></div>
  </li>
  <li>b.txt</li>
  <li>c.txt</li>
  <li>d.txt</li>
</ul>
*/


function JsTree(list) {

  return this._makeTreeNode(list)
}

JsTree.prototype = {
  constructor: JsTree,
  _makeTreeNode: function(list) {
    var fn = arguments.callee;
    var nodes = list.map(data => {
      var children;
      if(Array.isArray(data.children)) {
        children = fn(data.children)
      }

      var li = document.createElement('li');
      li.className = data.class || ''
      li.innerHTML = "<span class='jstree-whole'></span>"
      if(data.key) {
        li.setAttribute('jstree-key', data.key)
      }

      var div = document.createElement('div');
      div.className='jstree-witem';
      div.innerHTML = `<i class='jstree-icon'></i><span class='jstree-text'>${data.text}</span>`
      if(data.onclick) {
        div.onclick = data.onclick.bind(li, data);
      }

      li.appendChild(div);
      children && li.appendChild(children);

      return li;
    })
    var ul = document.createElement('ul');
    ul.className = 'jstree'
    nodes.forEach(n=>ul.appendChild(n))
    return ul;
  }
};


module.exports = JsTree