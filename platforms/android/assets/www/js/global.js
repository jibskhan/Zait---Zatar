window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}

var doc = document;

var ctr = 0;
var spaces = /\s+/, a1 = [''];

var toArray = function(list) {
	return Array.prototype.slice.call(list || [], 0);
};

var byId = function(id) {
	if (typeof id == 'string') { return doc.getElementById(id); }
	return id;
};

var query = function(query, root) {
	return queryAll(query, root)[0];
}

var queryAll = function(query, root) {
	if (!query) { return []; }
	if (typeof query != 'string') { return toArray(query); }
	if (typeof root == 'string') {
		root = byId(root);
		if(!root){ return []; }
	}

	root = root || document;
	var rootIsDoc = (root.nodeType == 9);
	var doc = rootIsDoc ? root : (root.ownerDocument || document);

	// rewrite the query to be ID rooted
	if (!rootIsDoc || ('>~+'.indexOf(query.charAt(0)) >= 0)) {
		root.id = root.id || ('qUnique' + (ctr++));
		query = '#' + root.id + ' ' + query;
	}
	// don't choke on something like ".yada.yada >"
	if ('>~+'.indexOf(query.slice(-1)) >= 0) { query += ' *'; }
	return toArray(doc.querySelectorAll(query));
};

var strToArray = function(s) {
	if (typeof s == 'string' || s instanceof String) {
		if (s.indexOf(' ') < 0) {
			a1[0] = s;
			return a1;
		} else {
			return s.split(spaces);
		}
	}
	return s;
};

// Needed for browsers that don't support String.trim() (e.g. iPad)
var trim = function(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

Element.prototype.addClass = function(classStr)
{
	classStr = strToArray(classStr);
	var cls = ' ' + this.className + ' ';
	for (var i = 0, len = classStr.length, c; i < len; ++i) {
		c = classStr[i];
		if (c && cls.indexOf(' ' + c + ' ') < 0) {
			cls += c + ' ';
		}
	}
	this.className = trim(cls);
}
Element.prototype.removeClass = function(classStr)
{
	var cls;
	if (classStr !== undefined) {
		classStr = strToArray(classStr);
		cls = ' ' + this.className + ' ';
		for (var i = 0, len = classStr.length; i < len; ++i) {
			cls = cls.replace(' ' + classStr[i] + ' ', ' ');
		}
		cls = trim(cls);
	} else {
		cls = '';
	}
	if (this.className != cls) {
		this.className = cls;
	}
}
Element.prototype.toggleClass = function(classStr)
{
	var cls = ' ' + this.className + ' ';
	if (cls.indexOf(' ' + trim(classStr) + ' ') >= 0) {
		this.removeClass(classStr);
	} else {
		this.addClass(classStr);
	}
}
Element.prototype.hasClass = function(classStr)
{
	var cls = ' ' + this.className + ' ';
	return cls.indexOf(' ' + trim(classStr) + ' ') >= 0;
}
Element.prototype.remove = function()
{
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function()
{
	for (var i = 0, len = this.length; i < len; i++)
	{
		if (this[i] && this[i].parentElement)
		{
			this[i].parentElement.removeChild(this[i]);
		}
	}
}

Array.prototype.in_array = function(p_val)
{
	var key = false;
	this.forEach(function(value, index) {
		if(value == p_val) {
			key = index;
		}
	})

	return key;
}
Array.prototype.array_rand = function()
{
	var key = rand(0, this.length - 1);

	return this[key];
}

String.prototype.strip_tags = function(allowed)
{
	allowed = (((allowed || "") + "").toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
	var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
	commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

	return this.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1)
	{
		return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
	});
}
String.prototype.trunc = function(n,useWordBoundary)
{
	var toLong = this.length>n, 
		s_ = toLong ? this.substr(0,n-1) : this;
	s_ = useWordBoundary && toLong ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	return  toLong ? s_ + '&hellip;' : s_;
}

function rand(min, max)
{
	var argc = arguments.length;
	if (argc === 0)
	{
		min = 0;
		max = 2147483647;
	}
	else if (argc === 1)
	{
		return min;
	}

	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var monthArray = new Array("كانون الثاني ", "شباط ", "آذار ", "نيسان", "أيار", "حزيران", "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول");
function showLocalDate(timestamp, hidehour)
{
	var dt = new Date(timestamp * 1000);
	var hr = dt.getHours();
	var min = dt.getMinutes();
	var ampm = "م"
	if (hr < 12){
		ampm = "ص"
	}
	if (hr > 12){
		hr -= 12;
	}
	if (hr < 10){
		hr = "&nbsp;" + hr;
	}
	if (min < 10){
		min = "0" + min;
	}

	var mm = monthArray[dt.getMonth()];	

	return (hidehour ? '' : hr + ":"+ min + " " + ampm + " &sdot; ") + dt.getDate() + " " + mm + " " + dt.getFullYear();
}
function timeSince(timestamp)
{
	var dt = new Date();
	var seconds = (Math.floor(dt.getTime() / 1000) + (dt.getTimezoneOffset() * 60)) - (timestamp - 10800); // 10800 jordan

	var interval = Math.floor(seconds / 31536000);
	if (interval > 1)
	{
		return showLocalDate(timestamp, true);
		//return interval + " سنة";
	}

	interval = Math.floor(seconds / 2592000);
	if (interval > 10)
	{
		return "منذ " + interval + " شهر";
	}
	if (interval > 2)
	{
		return "منذ " + interval + " أشهر";
	}
	if (interval > 1)
	{
		return "منذ شهرين";
	}
	if (interval > 0)
	{
		return "منذ شهر";
	}

	interval = Math.floor(seconds / 86400);
	if (interval > 10)
	{
		return "منذ " + interval + " يوم";
	}
	if (interval > 2)
	{
		return "منذ " + interval + " أيام";
	}
	if (interval > 1)
	{
		return "منذ يومين";
	}
	if (interval > 0)
	{
		return "منذ يوم";
	}
	
	interval = Math.floor(seconds / 3600);
	if (interval > 10)
	{
		return "منذ " + interval + " ساعة";
	}
	if (interval > 2)
	{
		return "منذ " + interval + " ساعات";
	}
	if (interval > 1)
	{
		return "منذ ساعتين";
	}
	if (interval > 0)
	{
		return "منذ ساعة";
	}
	
	interval = Math.floor(seconds / 60);
	if (interval > 10)
	{
		return "منذ " + interval + " دقيقة";
	}
	if (interval > 2)
	{
		return "منذ " + interval + " دقائق";
	}
	if (interval > 1)
	{
		return "منذ دقيقتين";
	}
	if (interval > 0)
	{
		return "منذ دقيقة";
	}
	
	return "أقل من دقيقة";
	//return Math.floor(seconds) + " ثانية";
}

function implode(glue, pieces)
{
	var i = '', retVal = '', tGlue = '';
	if (arguments.length === 1)
	{
		pieces = glue;
		glue = '';
	}

	if (typeof(pieces) === 'object')
	{
		if (Object.prototype.toString.call(pieces) === '[object Array]')
		{
			return pieces.join(glue);
		}
		for (i in pieces)
		{
			retVal += tGlue + pieces[i];
			tGlue = glue;
		}

		return retVal;
	}

	return pieces;
}

var main = byId('title');
var filter = byId('filter');

var _SCRIPT = '';
function getUrlVars(url)
{
	if (!url)
	{
		url = window.location.href.replace(/\+/g, " ");
	}
	url = decodeURI(url);

	var vars = [], hash;
	if (url.indexOf('#') == -1)
	{
		_SCRIPT = url.slice(url.indexOf('?') + 1);
	}
	else
	{
		_SCRIPT = url.slice(url.indexOf('?') + 1, url.indexOf('#'));
	}
	var hashes = _SCRIPT.split('&');

	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
var _GET = getUrlVars('');

var searchform = doc.forms["searchform"];
var queryArray = new Array('section', 'category', 'search');
queryArray.forEach(function(key) {
	if (_GET[key] === undefined)
	{
		_GET[key] = '';
	}

	if (searchform)
	{
		searchform[key].value = _GET[key];
	}
})

function getUrlFile(url)
{
	if (!url)
	{
		url = window.location.pathname;
	}
	
	return url.replace(/^.*[\\\/]/, '');
}
var __FILE__ = getUrlFile();

function fetchQuery(varname, value)
{
	var scriptpath = '';

	queryArray.forEach(function(key) {
		if (typeof varname == 'string')
		{
			if (varname == key)
			{
				if (typeof value == 'string' && value != '')
				{
					scriptpath += '&' + key + '=' + value;
				}
				
				return;
			}
			
		}
		else if (varname !== undefined)
		{
			var index = varname.in_array(key);
			if (index !== false)
			{
				if (typeof value == 'string')
				{
					if (value != '')
					{
						scriptpath += '&' + key + '=' + value;
					}
				}
				else if (value !== undefined)
				{
					if (value[index] != '')
					{
						scriptpath += '&' + key + '=' + value[index];
					}
				}

				return;
			}
		}

		if (_GET[key])
		{
			scriptpath += '&' + key + '=' + _GET[key];
		}
	})

	return scriptpath;
}
var SCRIPTQUERY = _GET['email'] ? '&email=' + _GET['email']  : fetchQuery();

var loadClass = 'loading';

var section = byId('sec');
if (section != null)
{
	var list = section.querySelector('.list');
}

var firstid = 0, firstorder = 0, lastid = 0, lastorder = 0, length = 0, queue = [], item = [];

var h = ''; // window.location.hash

// Cordova Plugins
function toastMsg(message, longDuration)
{
	if (longDuration)
	{
		toast.showLong(message);
	}
	else
	{
		toast.showShort(message);
	}
}
function checkConnection(redirect)
{
	var networkState = navigator.connection.type;

	var states = {};
	states[Connection.UNKNOWN]  = 'Unknown connection';
	states[Connection.ETHERNET] = 'Ethernet connection';
	states[Connection.WIFI]     = 'WiFi connection';
	states[Connection.CELL_2G]  = 'Cell 2G connection';
	states[Connection.CELL_3G]  = 'Cell 3G connection';
	states[Connection.CELL_4G]  = 'Cell 4G connection';
	states[Connection.NONE]     = false; // 'No network connection'

	if (networkState == Connection.NONE)
	{
		if (redirect)
		{
			window.location.href = 'connection.html';
		}
		else
		{
			toastMsg('الجهاز غير متصل بالإنترنت', true);
		}
	}

	return states[networkState];
}


// IScroll
var myScroll;
function requestData(start, count)
{
	var url = 'http://zait-zatar.com/mobile-ar/ajax.php?do=product&start=' + start + '&count=' + count + SCRIPTQUERY;
	if (queue.in_array(url) !== false)
	{
		return;
	}

	var cur = length++;
	queue[cur] = url;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url);
	xhr.timeout = 14000;
	xhr.ontimeout = function ()
	{
		queue.splice(cur);
		section.removeClass(loadClass);
	}
	xhr.onload = function(e)
	{
		var data = JSON.parse(this.responseText);
		if (data.length)
		{
			myScroll.updateCache(start, data);
		}
		else if (start == 0)
		{
			sec.innerHTML = '<div class="notification">' + 'No results found' + (_GET['search'] ? ' for ' + _GET['search'] : '') + '.</div>';
		}

		//queue.splice(cur);
		section.removeClass(loadClass);
	}
	xhr.send();
}

function updateContent(el, data)
{
	if (data === undefined)
	{
		el.innerHTML = '<img src="img/loader.gif" style="margin:0 10px;" width="28" height="28" />تحميل الرجاء الانتظار';
		return;
	}
	id = parseInt(data['product_id']);
	price = parseFloat(data['price']);
	image = data['image'] ? data['image'] : 'img/thumb.jpg';

	_PRODUCT[id] = [data['name'], image, price];

	el.innerHTML = '<div class="cartform"><input id="textcart_' + id + '" type="submit" onclick="updateProduct(' + id + ')" value="' + (_CART[id] ? 'تحديث' : 'إضافة') + '">' +
					'<input type="button" onclick="changeQuantity(' + id + ', -1);" value="-"><input type="text" name="quantity" id="quantity_' + id + '" value="' + (_CART[id] ? _CART[id][4] : '1') + '" readonly><input type="button" onclick="changeQuantity(' + id + ', 1);" value="+"></div>' +
					'<img class="cover_p" src="' + image + '" />' +
					'<div>' + data['name'] + '</div>' +
					'<div>' + price + ' JD</div>';;

}

function pullDownAction () {
	fetch_data();
}

function pullUpAction () {
	fetch_data('older');
}

function ScrollPullRefresh()
{	
	myScroll = new IScroll(section, {
		fadeScrollbar: true,
		hideScrollbar:true
	});
	myScroll.on('scrollEnd', pullUpAction);
}
function ScrollInfinite(limit)
{
	myScroll = new IScroll(section, {
		infiniteElements: '.list .row',
		dataset: requestData,
		dataFiller: updateContent,
		cacheSize: 40,
		infiniteLimit: limit,
		fadeScrollbar: true,
		hideScrollbar:true
	});

	//myScroll.on('scrollEnd', pullUpAction);

	document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
}
function ScrollSimple()
{
	myScroll = new IScroll(section, {
		fadeScrollbar: true,
		hideScrollbar:true
	});
}

// database
var db;
document.addEventListener("deviceready", function() {
	db = window.openDatabase("Databases", "1.0", "Zait-Zatar", 2*1024*1024);
	db.transaction(populateDB, errorCB);
}, false);

function populateDB(tx) {
	//tx.executeSql('DROP TABLE IF EXISTS CART');
	tx.executeSql('CREATE TABLE IF NOT EXISTS CART (id INTEGER PRIMARY KEY ASC, name, image, price INTEGER, quantity INTEGER)');

	//tx.executeSql('DROP TABLE IF EXISTS ACCOUNT');
	tx.executeSql('CREATE TABLE IF NOT EXISTS ACCOUNT (provider PRIMARY KEY ASC, accountid, userid, name, email, accesstoken, accesstokensecret, dateline INTEGER KEY)');

	if (_GET['do'] == 'updatelogin')
	{
		toastMsg('أهلاً بك في أسواق زيت وزعتر, ' + _GET['n']);
		navigator.notification.vibrate(500);

		tx.executeSql('REPLACE INTO ACCOUNT (provider, accountid, userid, name, email, accesstoken, accesstokensecret, dateline) VALUES (?,?,?,?,?,?,?,?)', [_GET['p'],_GET['a'],_GET['u'],_GET['n'],_GET['e'],_GET['at'],_GET['as'],_GET['d']]);
	}

	tx.executeSql('SELECT * FROM ACCOUNT LIMIT 1', [], fetch_account, errorCB);
}
function errorCB(err) { console.log('errorCB: '); console.debug(err); }
function successCB() {}

// Account
var ACCOUNT = {"accountid":0}, _PRODUCT = {}, _CART = {};
function fetch_account(tx, res)
{
	if (res.rows.length)
	{
		var login = res.rows.item(0);

		ACCOUNT = {"provider":login.provider,"accountid":login.accountid,"userid":login.userid,"name":login.name,"email":login.email,"accesstoken":login.accesstoken,"accesstokensecret":login.accesstokensecret};
	}

	tx.executeSql('SELECT * FROM CART', [], fetch_cart, errorCB);
}
function fetch_cart(tx, res)
{
	for (var i = 0; i < res.rows.length; i++)
	{
		var item = res.rows.item(i);
		_CART[item.id] = [item.id, item.name, item.image, item.price, item.quantity];
	}
	updateCart();

	onDeviceReady();
}

var totalitem = 0, totalprice = 0;
function updateCart()
{
	totalitem = 0, totalprice = 0;
	for(var varname in _CART)
	{
		totalitem += _CART[varname][4];
		totalprice += _CART[varname][3] * _CART[varname][4];
	}

	var cart = byId('cart-total');
	if (cart == null)
	{
		return;
	}

	if (totalitem)
	{
		cart.innerHTML = totalitem + ' ' + (totalitem < 2 ? 'item' : 'منتجات') + ' - ' + parseFloat(totalprice).toFixed(2) + ' JD';
		if (__FILE__ == 'cart.html' || __FILE__ == 'checkout.html')
		{
			byId('subtotal').innerHTML = parseFloat(totalprice).toFixed(2) + ' JD';
			var total = byId('total');
			if (total != null)
			{
				total.innerHTML = parseFloat(totalprice + 1.50).toFixed(2) + ' JD';
			}
			if (__FILE__ == 'cart.html')
			{
				byId('checkout').style.display = totalprice < 10 ? 'none' : '';
			}
			if (totalprice < 10)
			{
				toastMsg('لا يمكن إتمام عملية الشراء. أقل قيمة لإتمام العملية هي 10 دنانير');
				if (__FILE__ == 'checkout.html')
				{
					window.location.href = 'cart.html';
				}
			}
		}
	}
	else
	{
		if (__FILE__ == 'cart.html' || __FILE__ == 'checkout.html')
		{
			toastMsg('السلة فارغة');
			window.history.back();
		}
		cart.innerHTML = 'السلة فارغة';
	}	
}

function updateProduct(id)
{
	var product = _PRODUCT[id];
	var quantity = parseInt(byId('quantity_' + id).value);

	var elm = byId('product_' + id);
	var textcart = byId('textcart_' + id);

	if (quantity)
	{
		db.transaction(function(tx) {
			tx.executeSql('REPLACE INTO CART (id, name, image, price, quantity) VALUES (?,?,?,?,?)', _CART[id]);
		}, errorCB);

		_CART[id] = [id, product[0], product[1], product[2], quantity];
		if (textcart != null)
		{
			textcart.value = 'تحديث';
		}
	}
	else
	{					
		db.transaction(function(tx) {
			tx.executeSql('DELETE FROM CART WHERE id = ?', [id]);
		}, errorCB);

		delete _CART[id];
		if (textcart != null)
		{
			textcart.value = 'إضافة';
			byId('quantity_' + id).value = 1;
		}

		if (elm != null)
		{
			elm.remove();
		}
	}

	toastMsg('تم تحديث سلة الشراء');
	updateCart();
}
function changeQuantity(id,  vl)
{
	var elm = byId('quantity_' + id);
	var textcart = byId('textcart_' + id);

	var total = parseInt(elm.value) + vl;

	if (textcart != null && textcart.value != 'إضافة')
	{
		if (total < 1)
		{
			textcart.value = 'حذف';
			elm.value = 0;
		}
		else
		{
			textcart.value = 'تحديث';
			elm.value = total;
		}
	}
	else
	{
		var number = (__FILE__ == 'history.html' ? 0 : 1);
		elm.value = total < number ? number : total;
	}
}

// Events
function onSearchKeyDown()
{
	if (searchform)
	{
		doc.forms["searchform"]["search"].focus();
	}
}
		
var lastPressedTime = 0;
function goBack(skip)
{
	if (__FILE__ == 'connection.html')
	{
		if (checkConnection(false))
		{
			window.history.back();
		}
	}
	else if (__FILE__ == 'checkout.html')
	{
		window.location.href = 'cart.html';
	}
	else if (__FILE__ == 'history.html')
	{
		window.location.href = 'order.html';
	}
	else if (__FILE__ == 'recover.html')
	{
		window.location.href = 'forget.html';
	}
	else if (__FILE__ == 'forget.html')
	{
		window.location.href = 'login.html';
	}
	else if (__FILE__ == 'register.html')
	{
		window.location.href = 'login.html';
	}
	else if (__FILE__ == 'details.html')
	{
		window.location.href = 'section.html?e=1' + SCRIPTQUERY + '&id=' + h;
	}
	else if (__FILE__ == 'edit.html' || __FILE__ == 'password.html' || __FILE__ == 'order.html')
	{
		window.location.href = 'account.html';
	}
	else if (__FILE__ == 'images.html')
	{
		window.location.href = 'details.html?' + SCRIPTQUERY + '#' + _GET['id'];
	}
	else if (__FILE__ == 'main.html' || __FILE__ == 'login.html')
	{
		if (__FILE__ == 'main.html' && _GET['section'])
		{
			window.location.href = 'main.html';
		}
		else if (new Date().getTime() - lastPressedTime < 3000)
		{
			navigator.app.exitApp();
		}
		else
		{
			lastPressedTime = new Date().getTime();
			toastMsg('اضغط مرة اخرى للخروج');
		}
	}
	else if (ACCOUNT.accountid)
	{
		if (_GET['section'] && _GET['category'])
		{
			window.location.href = 'main.html?' + fetchQuery('search');
		}
		else
		{
			window.location.href = 'main.html';
		}
		//window.history.back();
	}
	else
	{
		window.location.href = 'login.html';
	}
	
	return false;
}

function initialize()
{

}