var Pancake;
(function (Pancake) {
    Pancake.Nav = {
        visible: false,
        open: function () {
            var navEl = document.querySelector('nav');
            navEl.classList.add('active');
            navEl.classList.remove('closed');
            var openAnimation = navEl.dataset['openAnimation'];
            Pancake.Nav.visible = true;
            if (openAnimation) {
                return Carbon.Animation(navEl, openAnimation);
            }
        },
        close: function () {
            var navEl = document.querySelector('nav');
            navEl.classList.remove('active');
            Pancake.Nav.visible = false;
            var closeAnimation = navEl.dataset['closeAnimation'];
            closeAnimation && Carbon.Animation(navEl, closeAnimation);
            return Promise.resolve();
        }
    };
    Pancake.Cover = {
        edit: function () {
            var coverPageWrapperEl = document.querySelector('.coverPageWrapper');
            _.getHTML('/?partial=coverPage').then(function (html) {
                coverPageWrapperEl.innerHTML = html;
                Carbon.controllers.coverEditor.open();
                new Pancake.Curtains('#curtains');
            });
        },
        remove: function () {
            var el = document.querySelector('.coverPageWrapper');
            el.innerHTML = '';
            bridge.reload();
        },
        update: function (data) {
            var coverPageWrapperEl = document.querySelector('.coverPageWrapper');
            if (location.pathname == '/') {
                return _.getHTML('/?partial=coverPage').then(function (html) {
                    coverPageWrapperEl.innerHTML = html;
                    new Pancake.Curtains('#curtains');
                    if (data.type !== 'removed') {
                        Carbon.controllers.coverEditor.open();
                    }
                });
            }
            return bridge.reload().then(function () {
                if (data.type === 'removed') {
                    bridge.reload();
                }
                else {
                    Carbon.controllers.coverEditor.open();
                }
                return Promise.resolve(true);
            });
        },
        setAlignment: function (alignment) {
            var el = document.querySelector('.coverImg');
            el.classList.remove('top', 'center', 'bottom');
            el.classList.add(alignment);
        },
        setOverlay: function (option) {
            var el = document.querySelector('.cover .overlay');
            if (el) {
                el.className = 'overlay ' + option;
            }
        },
        setFont: function (value) {
            for (var _i = 0, _a = Array.from(document.querySelectorAll('.heading')); _i < _a.length; _i++) {
                var el = _a[_i];
                el.className = 'heading ' + value;
            }
        },
        setDefaultFont: function (value) {
            for (var _i = 0, _a = Array.from(document.querySelectorAll('.heading.default')); _i < _a.length; _i++) {
                var el = _a[_i];
                el.className = 'heading ' + value;
            }
        },
        setTextColor: function (value) {
            var el = document.querySelector('.cover .coverContent');
            el.classList.remove('light', 'dark');
            el.classList.add(value);
        },
        setBlackAndWhite: function (value) {
            var coverImg = document.querySelector('.coverImg');
            coverImg.classList.toggle('bw', value);
        },
        setBlur: function (value) {
            Pancake.Cover.update({ type: 'updated' }).then(function () {
                document.querySelector('.toggleList').classList.add('editing');
            });
        },
        setFullscreen: function (value) {
            document.querySelector('.project').classList.toggle('full', value);
            document.querySelector('.cover').classList.toggle('full', value);
        }
    };
})(Pancake || (Pancake = {}));
Carbon.controllers.nav = {
    toggle: function (e) {
        document.querySelector('nav').classList.toggle('active');
    }
};
var Carbon;
(function (Carbon) {
    var CoverEditor = (function () {
        function CoverEditor() {
        }
        CoverEditor.prototype.close = function () {
            document.querySelector('.coverEditor').classList.remove('open');
            document.body.classList.remove('editingCover');
        };
        CoverEditor.prototype.open = function () {
            var coverEditor = document.querySelector('.coverEditor');
            coverEditor.classList.add('open');
            document.body.classList.add('editingCover');
            window.scrollTo(0, 0);
            var editor = document.querySelector('.coverEditor');
            var position = document.getElementsByTagName('main')[0];
            if (window.location.pathname !== '/')
                position.insertBefore(editor, position.firstChild);
        };
        return CoverEditor;
    }());
    Carbon.CoverEditor = CoverEditor;
})(Carbon || (Carbon = {}));
Carbon.controllers.coverEditor = new Carbon.CoverEditor();
Carbon.controllers.coverPage = Pancake.Cover;
document.body.addEventListener('aboveFold', function () {
    var el = document.querySelector('.navToggle');
    el.classList.remove('underCover');
});
document.body.addEventListener('belowFold', function () {
    var el = document.querySelector('.navToggle');
    el.classList.add('underCover');
});
Carbon.controllers.page = {
    setNavToggle: function (e) {
        var coverTextColor = e.target.dataset['coverTextColor'];
        var hasCover = e.target.matches('.hasCover');
        var navToggleEl = document.querySelector('.navToggle');
        navToggleEl.classList.remove('light', 'dark');
        hasCover && navToggleEl.classList.add(coverTextColor);
    },
    smoothScroll: function (e) {
        var scrollRatio = 1;
        $('html, body').animate({
            scrollTop: window.innerHeight * scrollRatio
        }, 2000);
    }
};
(function (Pancake) {
    var LayerRotator = (function () {
        function LayerRotator() {
            var _this = this;
            this.layers = document.querySelector('.coverTextOverlayColors');
            this.bg = document.querySelector('.coverTextOverlayColors .coverOverlay');
            this.txt = document.querySelector('.coverTextOverlayColors .coverTextColor');
            this.size = this.bg.offsetHeight * .65;
            this.degs = 40;
            this.anims = {
                duration: 150,
                fill: 'forwards'
            };
            this.layers.addEventListener('mouseenter', function () {
                if (!_this.bg.matches('.editing') && !_this.txt.matches('.editing')) {
                    _this.open();
                }
            });
            this.layers.addEventListener('mouseleave', function () {
                if (!_this.bg.matches('.editing') && !_this.txt.matches('.editing')) {
                    _this.close();
                }
            });
        }
        LayerRotator.prototype.open = function () {
            this.bg.animate([
                { transform: "rotate(0deg) translateY(-" + this.size + "px) rotate(0deg)" },
                { transform: "rotate(-" + this.degs + "deg) translateY(-" + this.size + "px) rotate(" + this.degs + "deg)" }
            ], this.anims);
            this.txt.animate([
                { transform: "rotate(0deg) translateY(" + this.size + "px) rotate(0deg)" },
                { transform: "rotate(-" + this.degs + "deg) translateY(" + this.size + "px) rotate(" + this.degs + "deg)"
                }
            ], this.anims);
        };
        LayerRotator.prototype.close = function () {
            this.bg.animate([
                { transform: "rotate(-" + this.degs + "deg) translateY(-" + this.size + "px) rotate(" + this.degs + "deg)" },
                { transform: "rotate(0deg) translateY(-" + this.size + "px) rotate(0deg)" }
            ], this.anims);
            this.txt.animate([
                { transform: "rotate(-" + this.degs + "deg) translateY(" + this.size + "px) rotate(" + this.degs + "deg)" },
                { transform: "rotate(0deg) translateY(" + this.size + "px) rotate(0deg)" }
            ], this.anims);
        };
        return LayerRotator;
    }());
    Pancake.LayerRotator = LayerRotator;
})(Pancake || (Pancake = {}));
Carbon.controllers.layerRotator = {
    setup: function (e) {
        new Pancake.LayerRotator();
    }
};
Carbon.ActionKit.observe('click');
