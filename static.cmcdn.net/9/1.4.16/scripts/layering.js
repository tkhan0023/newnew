document.addEventListener('route:load', function () {
    Pancake.Monster.instance.setCoverElement('.cover:not(#curtains)');
}, false);
var Pancake;
(function (Pancake) {
    Pancake.supressLayerEffects = false;
    var Monster = (function () {
        function Monster() {
            this.speed = 0.5;
            this.coverHeight = 0;
            window.addEventListener('resize', this.onResize.bind(this), false);
            document.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
            this.setCoverElement('.cover');
        }
        Monster.prototype.setCoverElement = function (selector) {
            window.scrollTo(0, 0);
            this.coverEl = document.querySelector(selector);
            if (!this.coverEl)
                return;
            this.coverContentEl = this.coverEl.querySelector('.coverContent');
            this.coverPosition = 'above';
            this.onResize();
        };
        Monster.prototype.onResize = function () {
            if (!this.coverEl)
                return;
            this.coverHeight = this.coverEl.offsetHeight;
        };
        Monster.prototype.onScroll = function () {
            this._onScroll(window.scrollY);
        };
        Monster.prototype._onScroll = function (top) {
            if (Pancake.supressLayerEffects)
                return;
            if (!this.coverEl)
                return;
            var coverTop = top * this.speed;
            if (!document.getElementById('curtains')) {
                if (top >= this.coverHeight) {
                    if (this.coverPosition === 'above') {
                        trigger(this.coverEl, 'belowFold');
                        this.coverPosition = 'below';
                    }
                    return;
                }
                else if (this.coverPosition === 'below') {
                    trigger(this.coverEl, 'aboveFold');
                    this.coverPosition = 'above';
                }
            }
            var percent2 = 1 - (top / (this.coverHeight / 1.5));
            this.coverContentEl.style.opacity = percent2.toString();
            this.coverEl.style.transform = "translateY(" + coverTop + "px)";
        };
        Monster.instance = new Monster();
        return Monster;
    }());
    Pancake.Monster = Monster;
    var Curtains = (function () {
        function Curtains(selector) {
            this.revealRate = 1.3;
            this.top = 0;
            this.done = false;
            this.mainEl = document.querySelector('main');
            if (Curtains.instance) {
                Curtains.instance.destroy();
            }
            Curtains.instance = this;
            this.element = document.querySelector(selector);
            if (!this.element)
                return;
            this.scrollListener = _.observe(window, 'scroll', this.onScroll.bind(this));
            this.spacerEl = document.createElement('div');
            this.spacerEl.style.height = (window.innerHeight * 3) + 'px';
            document.body.appendChild(this.spacerEl);
        }
        Curtains.prototype.onScroll = function (e) {
            var _this = this;
            if (this.done)
                return;
            this.frameRequest && window.cancelAnimationFrame(this.frameRequest);
            this.frameRequest = window.requestAnimationFrame(function () {
                _this.setTop(window.scrollY);
            });
        };
        Curtains.prototype.setTop = function (val) {
            var distance = (val * this.revealRate);
            var percent2 = 1 - (distance / window.innerHeight);
            this.element.style.transform = "translateY(" + -distance + "px)";
            var translateY = window.innerHeight / this.revealRate;
            this.mainEl.style.transform = "translateY(" + translateY + "px)";
            if (percent2 <= 0) {
                this.done = true;
                this.destroy();
            }
        };
        Curtains.prototype.destroy = function () {
            var _this = this;
            if (!this.element)
                return;
            this.scrollListener.stop();
            $('html, body').stop();
            setTimeout(function () {
                window.scrollTo(0, 0);
                _this.mainEl.classList.remove('fixed');
                _this.mainEl.style.transform = null;
                _this.element.remove();
                _this.spacerEl.remove();
                _this.element = null;
                setTimeout(function () {
                    window.scrollTo(0, 0);
                }, 1);
            }, 1);
            Curtains.instance = null;
        };
        Curtains.instance = null;
        return Curtains;
    }());
    Pancake.Curtains = Curtains;
    Pancake.Monster.instance.setCoverElement('.cover:not(#curtains)');
    if (document.getElementById('curtains')) {
        Pancake.curtains = new Pancake.Curtains('#curtains');
    }
    function trigger(element, name, detail) {
        return element.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            detail: detail
        }));
    }
})(Pancake || (Pancake = {}));
