var Carbon;
(function (Carbon) {
    Carbon.Animation = function (selector, text, cxt) {
        if (!text)
            return Promise.resolve();
        var animationName = text.split(':')[1];
        var animation = Animations[animationName];
        if (!animation) {
            throw new Error("animation " + animationName + " not found");
        }
        return animation(selector);
    };
    var AnimationPromise = function (player) {
        return new Promise(function (resolve) {
            player.onfinish = function () {
                resolve(true);
            };
        });
    };
    var timing = { duration: 300, iterations: 1, fill: 'forwards' };
    var Animations = {
        fadePageIn: function (element) {
            var keyframes = [
                { opacity: '0' },
                { opacity: '1' }
            ];
            return AnimationPromise(element.animate(keyframes, timing));
        },
        fadePageOut: function (element) {
            var keyframes = [
                { opacity: '1' },
                { opacity: '0' }
            ];
            return AnimationPromise(element.animate(keyframes, timing));
        }
    };
})(Carbon || (Carbon = {}));
