var SiteActions = {
    setStyles: function (data) {
        var ss = document.getElementById('styles');
        var href = ss.getAttribute('href');
        var basePath = href.substring(0, href.indexOf('?') + 1);
        for (var key in data) {
            ss.dataset[key] = data[key];
        }
        var url = basePath + _.serialize(ss.dataset);
        ss.setAttribute('href', url);
    },
    loadPartial: function (data) {
        var el = document.querySelector(data.selector);
        return fetch(data.url)
            .then(function (response) { return response.text(); })
            .then(function (html) {
            el.outerHTML = html;
            return Promise.resolve(true);
        });
    },
    updateBlock: function (data) {
        var block = SiteBlocks[data.name];
        block && block.update(data.data);
    },
    editCover: function () {
        Pancake.Cover.edit();
    },
    showNav: function () {
        Pancake.Nav.open();
    },
    hideNav: function () {
        Pancake.Nav.close();
    }
};
var SiteBlocks = {
    nav: {
        update: function (data) {
            var navEl = document.querySelector('nav');
            return fetch('/?partial=nav', { credentials: 'same-origin' })
                .then(function (response) { return response.text(); })
                .then(function (html) {
                navEl.innerHTML = Carbon.DOM.parse(html).innerHTML;
            });
        }
    },
    siteTitle: {
        update: function (text) {
            var siteTitle = document.querySelector('.siteTitle');
            siteTitle.textContent = text;
        }
    },
    tagline: {
        update: function (text) {
            for (var _i = 0, _a = Array.from(document.querySelectorAll('.tagline')); _i < _a.length; _i++) {
                var el = _a[_i];
                el.style.display = text ? null : 'none';
                el.textContent = text || '';
            }
        }
    },
    footer: {
        update: function () {
            SiteActions.loadPartial({
                url: '/?partial=footer',
                selector: 'footer'
            });
        }
    },
    siteFooterContent: {
        update: function (text) {
            var el = document.querySelector('.footerBlurb');
            el.innerHTML = text;
        }
    },
    brandingGlyph: {
        update: function (value) {
            var el = document.querySelector('carbon-glyph');
            el.innerHTML = "&#x" + value + ";";
        }
    },
    photo: {
        update: function () {
            site.load('/about');
        }
    },
    cover: {
        update: function () {
            site.load('/about');
        }
    },
    resume: {
        update: function () {
            site.load('/about');
        }
    }
};
var Page = (function () {
    function Page(name, site) {
        this.name = name;
        this.site = site;
        this.mainEl = document.querySelector('main');
        this.navEl = document.querySelector('nav');
    }
    Page.prototype.load = function (cxt) {
        var _this = this;
        return this.site.load(cxt).then(function () {
            document.body.classList.remove('editingCover');
            if (cxt.init)
                return Promise.resolve();
            var promise = Carbon.Animation(_this.mainEl, Page.loadAnimation || "carbon:fadePageIn", cxt);
            Page.loadAnimation = null;
            return promise;
        });
    };
    Page.prototype.unload = function (cxt) {
        Pancake.Nav.close();
        if (Pancake.curtains) {
            try {
                Pancake.curtains.destroy();
            }
            catch (err) { }
        }
        var promise = Carbon.Animation(this.mainEl, Page.unloadAnimation || "carbon:fadePageOut", cxt);
        Page.unloadAnimation = null;
        return promise.then(function () { return Carbon.delay(50); });
    };
    Page.loadAnimation = "carbon:fadePageIn";
    Page.unloadAnimation = "carbon:fadePageOut";
    return Page;
}());
var Carbon;
(function (Carbon) {
    Carbon.delay = function (ts) {
        return new Promise(function (fullfill, reject) {
            setTimeout(fullfill, ts);
        });
    };
})(Carbon || (Carbon = {}));
var Site = (function () {
    function Site() {
        this.router = new Carbon.Router({
            '/': new Page('home', this),
            '/about': new Page('about', this),
            '/contact': new Page('contact', this),
            '/projects/{id}': new Page('projectPage', this),
            '/blog': new Page('blog', this),
            '/blog/{tag}': new Page('blog', this)
        });
        this.router.beforeNavigate = function (e) {
            if (!e)
                return;
            var target = e.target;
            if (!target)
                return;
            Page.loadAnimation = target.dataset['loadAnimation'];
            Page.unloadAnimation = target.dataset['unloadAnimation'];
            return true;
        };
        this.router.start();
        var navEl = document.querySelector('nav');
        navEl.addEventListener('click', function (e) {
            var aEl = e.target.closest('a');
            if (!aEl)
                return;
            if (aEl.href === location.href) {
                Pancake.Nav.close();
            }
        }, false);
    }
    Site.prototype.load = function (cxt) {
        this.path = cxt.url;
        if (cxt.init) {
            this.onLoaded();
            return Promise.resolve(true);
        }
        return this._load(cxt.url, true);
    };
    Site.prototype._load = function (path, notify) {
        var _this = this;
        this.path = path;
        var mainEl = document.querySelector('main');
        var url = path + (path.includes('?') ? '&' : '?') + 'partial=true';
        return fetch(url)
            .then(function (response) {
            try {
                var properties = JSON.parse(response.headers.get("x-properties"));
                document.title = properties.title || '';
            }
            catch (err) { }
            return response.text();
        }).then(function (html) {
            Carbon.DOM.beforeRemoval(mainEl);
            mainEl.innerHTML = html;
            if (notify !== false) {
                window.scrollTo(0, 0);
            }
            _this.onLoaded();
            return Promise.resolve(true);
        });
    };
    Site.prototype.onLoaded = function () {
        var navToggleEl = document.querySelector('.navToggle');
        navToggleEl && navToggleEl.classList.remove('light', 'dark', 'underCover');
        Carbon.DOM.onChange();
        if (!this.lazyLoader) {
            this.lazyLoader = new Carbon.LazyLoader();
        }
        this.lazyLoader.setup();
    };
    return Site;
}());
Carbon.controllers.set('form', {
    setup: function (e) { Carbon.Form.get(e.target); }
});
Carbon.controllers.set('caption', {
    show: function (e) {
        var itemEl = e.target.closest('carbon-item');
        itemEl.classList.add('hovering');
        itemEl.addEventListener('mouseleave', function () {
            itemEl.classList.remove('hovering');
        }, { once: true });
    }
});
Carbon.controllers.set('form', {
    setup: function (e) { Carbon.Form.get(e.target); }
});
document.body.addEventListener('player:play', function (e) {
    var target = e.target;
    target.closest('carbon-piece').classList.add('played');
});
Carbon.ActionKit.observe('click', 'mouseover');
var site = new Site();
