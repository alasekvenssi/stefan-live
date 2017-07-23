var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("util/Color", ["require", "exports"], function (require, exports) {
    "use strict";
    var Color = (function () {
        function Color(r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 255; }
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }
        Color.prototype.getRGB = function () {
            return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.prototype.getRGBA = function () {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a / 255 + ")";
        };
        Color.prototype.toString = function () {
            return this.getRGBA();
        };
        Color.prototype.toInt32 = function () {
            return this.r | (this.g << 8) | (this.b << 16) | (this.a << 24);
        };
        Color.prototype.toInt24 = function () {
            return this.r | (this.g << 8) | (this.b << 16);
        };
        Color.prototype.isValid = function () {
            if (this.r < 0 || this.r > 255 || this.g < 0 || this.g > 255 || this.b < 0 || this.b > 255 || this.a < 0 || this.a > 255) {
                return false;
            }
            else {
                return true;
            }
        };
        Color.randomRGB = function () {
            return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
        };
        Color.randomRGBA = function () {
            return new Color(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
        };
        Color.fromInt32 = function (num) {
            return new Color(num & 0xFF, (num >> 8) & 0xFF, (num >> 16) & 0xFF, (num >> 24) & 0xFF);
        };
        Color.fromInt24 = function (num) {
            return new Color(num & 0xFF, (num >> 8) & 0xFF, (num >> 16) & 0xFF);
        };
        Color.fromString = function (colorString) {
            colorString = colorString.trim();
            if (colorString.length == 0) {
                return Color.Transparent;
            }
            var result = new Color();
            if ((colorString.length == 7 || colorString.length == 9) && colorString[0] == '#') {
                var colors = ["", "", ""];
                for (var i = 0; i < 6; ++i) {
                    var colorsIdx = Math.floor(i / 2);
                    colors[colorsIdx] += colorString[i + 1].toUpperCase();
                }
                result.r = parseInt(colors[0], 16);
                result.g = parseInt(colors[1], 16);
                result.b = parseInt(colors[2], 16);
            }
            if (colorString.length == 9 && colorString[0] == '#') {
                var alpha = (colorString[7] + colorString[8]).toUpperCase();
                result.a = parseInt(alpha, 16);
            }
            if (colorString[0] == '#') {
                if (!result.isValid()) {
                    throw "Invalid params";
                }
                return result;
            }
            var temp = "";
            var array;
            for (var i = 0; i < colorString.length; ++i) {
                if (!isNaN(parseInt(colorString[i], 10)) || colorString[i] == ',' || colorString[i] == '.') {
                    temp += colorString[i];
                }
            }
            array = temp.split(',', 5);
            if (array.length != 3 && array.length != 4) {
                throw "Invalid amout of ','";
            }
            result = new Color(parseInt(array[0], 10), parseInt(array[1], 10), parseInt(array[2], 10));
            if (array.length == 4) {
                result.a = parseFloat(array[3]);
            }
            if (!result.isValid()) {
                throw "Invalid params";
            }
            return result;
        };
        Color.Black = new Color(0, 0, 0);
        Color.Blue = new Color(0, 0, 255);
        Color.Cyan = new Color(0, 255, 255);
        Color.Green = new Color(0, 255, 0);
        Color.Magenta = new Color(255, 0, 255);
        Color.Red = new Color(255, 0, 0);
        Color.Transparent = new Color(0, 0, 0, 0);
        Color.White = new Color(255, 255, 255);
        Color.Yellow = new Color(255, 255, 0);
        return Color;
    }());
    exports.__esModule = true;
    exports["default"] = Color;
});
define("util/Arrays", ["require", "exports"], function (require, exports) {
    "use strict";
    function forEachInPlace(array, op) {
        array.forEach(op);
        return array;
    }
    exports.forEachInPlace = forEachInPlace;
    function fillArray(array, begin, end, value) {
        for (var i = begin; i < end; i++) {
            array[i] = value;
        }
        return array;
    }
    exports.fillArray = fillArray;
    function filterInPlace(array, filter) {
        for (var i = 0; i < array.length; i++) {
            if (!filter(array[i], i, array)) {
                array.splice(i, 1);
                i--;
            }
        }
        return array;
    }
    exports.filterInPlace = filterInPlace;
    function filter(array, filter) {
        var filtered = new Array();
        for (var i = 0; i < array.length; i++) {
            if (filter(array[i], i, array)) {
                filtered.push(array[i]);
            }
        }
        return filtered;
    }
    exports.filter = filter;
    function remove(array, target) {
        return filterInPlace(array, function (elem) { return elem !== target; });
    }
    exports.remove = remove;
});
define("util/Math", ["require", "exports", "util/Arrays"], function (require, exports, Arrays) {
    "use strict";
    function round(x, precision) {
        if (precision === void 0) { precision = Epsilon; }
        var temp = Math.pow(10, precision);
        return Math.round(x * temp) / temp;
    }
    exports.round = round;
    function roundForEach(array) {
        return Arrays.forEachInPlace(array, function (value, index, arr) {
            array[index] = round(value);
        });
    }
    exports.roundForEach = roundForEach;
    function roundArray(array) {
        var result = array.slice();
        return roundForEach(result);
    }
    exports.roundArray = roundArray;
    function randomChance(chance) {
        return Math.random() <= chance;
    }
    exports.randomChance = randomChance;
    function random(from, to) {
        return Math.random() * (to - from) + from;
    }
    exports.random = random;
    function tanh(x) {
        var exp = Math.exp(2 * x);
        return x == Infinity ? 1 : x == -Infinity ? -1 : (exp - 1) / (exp + 1);
    }
    exports.tanh = tanh;
    var Epsilon = 3; // decimal place
    var AbsError = Math.pow(10, (-Epsilon));
});
define("util/TransformMatrix", ["require", "exports", "util/Matrix2", "util/Math", "util/Vec2"], function (require, exports, Matrix2_1, MathUtil, Vec2_1) {
    "use strict";
    function defaultCloneOperator(y, x, InArray, OutArray) {
        OutArray[y][x] = InArray[y][x];
    }
    var TransformMatrix = (function (_super) {
        __extends(TransformMatrix, _super);
        function TransformMatrix(x11, x12, x13, x21, x22, x23) {
            if (x11 === void 0) { x11 = 1; }
            if (x12 === void 0) { x12 = 0; }
            if (x13 === void 0) { x13 = 0; }
            if (x21 === void 0) { x21 = 0; }
            if (x22 === void 0) { x22 = 1; }
            if (x23 === void 0) { x23 = 0; }
            _super.call(this, TransformMatrix.h);
            for (var y = 0; y < TransformMatrix.h; ++y) {
                this[y] = new Array(TransformMatrix.w);
            }
            this[0][0] = x11;
            this[0][1] = x12;
            this[0][2] = x13;
            this[1][0] = x21;
            this[1][1] = x22;
            this[1][2] = x23;
        }
        TransformMatrix.prototype.mul = function (rhs) {
            return new TransformMatrix(this[0][0] * rhs[0][0] + this[0][1] * rhs[1][0], this[0][0] * rhs[0][1] + this[0][1] * rhs[1][1], this[0][0] * rhs[0][2] + this[0][1] * rhs[1][2] + this[0][2], this[1][0] * rhs[0][0] + this[1][1] * rhs[1][0], this[1][0] * rhs[0][1] + this[1][1] * rhs[1][1], this[1][0] * rhs[0][2] + this[1][1] * rhs[1][2] + this[1][2]);
        };
        TransformMatrix.prototype.apply = function (rhs) {
            return new Vec2_1["default"](this[0][0] * rhs.x + this[0][1] * rhs.y + this[0][2], this[1][0] * rhs.x + this[1][1] * rhs.y + this[1][2]);
        };
        TransformMatrix.prototype.set = function (y, x, value) {
            if (x < 0 || x >= TransformMatrix.w || y < 0 || y >= TransformMatrix.h) {
                throw 'Out of range';
            }
            this[y][x] = value;
            return this;
        };
        TransformMatrix.prototype.get = function (x, y) {
            if (x < 0 || x >= TransformMatrix.w || y < 0 || y >= TransformMatrix.h) {
                throw 'Out of range';
            }
            return this[y][x];
        };
        TransformMatrix.prototype.toMatrix = function () {
            var result = new Matrix2_1["default"](3, 3, 0);
            for (var y = 0; y < TransformMatrix.h; ++y) {
                for (var x = 0; x < TransformMatrix.w; ++x) {
                    result[y][x] = this[y][x];
                }
            }
            result[2][2] = 1;
            return result;
        };
        TransformMatrix.prototype.print = function () {
            for (var y = 0; y < TransformMatrix.h; ++y) {
                console.log(MathUtil.roundArray(this[y]));
            }
            console.log('-');
        };
        TransformMatrix.prototype.clone = function (op) {
            if (op === void 0) { op = defaultCloneOperator; }
            var result = new TransformMatrix();
            for (var y = 0; y < TransformMatrix.h; ++y) {
                for (var x = 0; x < TransformMatrix.w; ++x) {
                    op(y, x, this, result);
                }
            }
            return result;
        };
        TransformMatrix.translate = function (x, y) {
            return new TransformMatrix(1, 0, x, 0, 1, y);
        };
        TransformMatrix.scale = function (x, y) {
            return new TransformMatrix(x, 0, 0, 0, y, 0);
        };
        TransformMatrix.rotate = function (angle) {
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            return new TransformMatrix(c, -s, 0, s, c, 0);
        };
        TransformMatrix.skew = function (xAngle, yAngle) {
            return new TransformMatrix(1, Math.tan(xAngle), 0, Math.tan(yAngle), 1, 0);
        };
        TransformMatrix.w = 3;
        TransformMatrix.h = 2;
        return TransformMatrix;
    }(Array));
    exports.__esModule = true;
    exports["default"] = TransformMatrix;
});
define("util/Matrix2", ["require", "exports", "util/TransformMatrix", "util/Math"], function (require, exports, TransformMatrix_1, MathUtil) {
    "use strict";
    function defaultCloneOperator(y, x, InArray, OutArray) {
        OutArray[y][x] = InArray[y][x];
    }
    var Matrix2 = (function (_super) {
        __extends(Matrix2, _super);
        function Matrix2(h, w, value) {
            if (h === void 0) { h = 0; }
            if (w === void 0) { w = 0; }
            if (value === void 0) { value = 0; }
            _super.call(this, h);
            this.h = h;
            this.w = w;
            for (var y = 0; y < h; ++y) {
                this[y] = new Array(w);
                for (var x = 0; x < w; ++x) {
                    this[y][x] = value;
                }
            }
        }
        Matrix2.prototype.mul = function (rhs) {
            if (this.getWidth() != rhs.getHeight()) {
                throw "Invalid matrix multiplication";
            }
            var result = Matrix2.zeros(rhs.getWidth(), this.getHeight());
            for (var y = 0; y < this.getHeight(); ++y) {
                for (var x = 0; x < rhs.getWidth(); ++x) {
                    for (var l = 0; l < this.getWidth(); ++l) {
                        result[y][x] += this[y][l] * rhs[l][x];
                    }
                }
            }
            return result;
        };
        Matrix2.prototype.clone = function (op) {
            if (op === void 0) { op = defaultCloneOperator; }
            var result = new Matrix2(this.getHeight(), this.getWidth());
            for (var y = 0; y < this.h; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    op(y, x, this, result);
                }
            }
            return result;
        };
        Matrix2.prototype.apply = function (op) {
            for (var y = 0; y < this.h; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    op(y, x, this);
                }
            }
        };
        Matrix2.prototype.toTransformMatrix = function () {
            if (this.getWidth() != 3 || this.getHeight() != 3) {
                throw "Invalid matrix size";
            }
            else if (this[2][0] != 0 || this[2][1] != 0) {
                throw "Invalid last row";
            }
            else if (this[2][2] == 0) {
                throw 'Invalid scale';
            }
            var result = new TransformMatrix_1["default"]();
            for (var y = 0; y < this.h - 1; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    result[y][x] = this[y][x] / this[2][2];
                }
            }
            return result;
        };
        Matrix2.eye = function (size) {
            var result = new Matrix2(size, size);
            for (var i = 0; i < size; ++i) {
                result[i][i] = 1;
            }
            return result;
        };
        Matrix2.zeros = function (h, w) {
            return new Matrix2(h, w, 0);
        };
        Matrix2.ones = function (h, w) {
            return new Matrix2(h, w, 1);
        };
        Matrix2.prototype.fill = function (value) {
            if (value === void 0) { value = 0; }
            for (var y = 0; y < this.h; ++y) {
                for (var x = 0; x < this.w; ++x) {
                    this[y][x] = value;
                }
            }
            return this;
        };
        Matrix2.prototype.set = function (y, x, value) {
            if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
                throw "Out of range";
            }
            this[y][x] = value;
            return this;
        };
        Matrix2.prototype.get = function (x, y) {
            if (x < 0 || x >= this.w || y < 0 || y >= this.h) {
                throw "Out of range";
            }
            return this[y][x];
        };
        Matrix2.prototype.pow = function (exponent) {
            if (exponent < 0) {
                throw "Invalid exponent";
            }
            else if (exponent == 0) {
                return this.getWidth() != this.getHeight() ? new Matrix2() : Matrix2.eye(this.getWidth());
            }
            else if (exponent == 1) {
                return this;
            }
            var temp = this.pow(Math.floor(exponent / 2));
            return exponent % 2 == 0 ? temp.mul(temp) : temp.mul(temp).mul(this);
        };
        Matrix2.prototype.print = function () {
            for (var y = 0; y < this.h; ++y) {
                console.log(MathUtil.roundArray(this[y]));
            }
            console.log('-');
        };
        Matrix2.prototype.getTotal = function () {
            return this.getWidth() * this.getHeight();
        };
        Matrix2.prototype.getWidth = function () {
            return this.w;
        };
        Matrix2.prototype.getHeight = function () {
            return this.h;
        };
        return Matrix2;
    }(Array));
    exports.__esModule = true;
    exports["default"] = Matrix2;
});
define("util/Vec2", ["require", "exports", "util/Math", "util/Matrix2"], function (require, exports, MathUtil, Matrix2_2) {
    "use strict";
    var Vec2 = (function () {
        function Vec2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        Vec2.prototype.add = function (rhs) {
            return new Vec2(this.x + rhs.x, this.y + rhs.y);
        };
        Vec2.prototype.sub = function (rhs) {
            return new Vec2(this.x - rhs.x, this.y - rhs.y);
        };
        Vec2.prototype.mul = function (rhs) {
            return new Vec2(this.x * rhs, this.y * rhs);
        };
        Vec2.prototype.div = function (rhs) {
            return new Vec2(this.x / rhs, this.y / rhs);
        };
        Vec2.prototype.length = function (l) {
            if (l == undefined) {
                return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
            }
            else {
                var len = this.length();
                if (len == 0) {
                    throw "Vec2 must have length for this operation";
                }
                return this.scale(l / len);
            }
        };
        Vec2.prototype.distance = function (rhs) {
            return Math.sqrt(Math.pow((this.x - rhs.x), 2) + Math.pow((this.y - rhs.y), 2));
        };
        Vec2.prototype.sin = function (rhs) {
            return this.cross(rhs) / this.length() / rhs.length();
        };
        Vec2.prototype.cos = function (rhs) {
            return this.dot(rhs) / this.length() / rhs.length();
        };
        Vec2.prototype.projection = function (rhs) {
            return rhs.normal().mul(this.dot(rhs) / rhs.length());
        };
        Vec2.prototype.dot = function (rhs) {
            return this.x * rhs.x + this.y * rhs.y;
        };
        Vec2.prototype.cross = function (rhs) {
            return this.x * rhs.y - this.y * rhs.x;
        };
        Vec2.prototype.normal = function () {
            return this.div(this.length());
        };
        Vec2.prototype.print = function () {
            console.log([MathUtil.round(this.x), MathUtil.round(this.y)]);
            console.log('-');
        };
        Vec2.prototype.toMatrix = function () {
            return new Matrix2_2["default"](2, 1).set(0, 0, this.x).set(1, 0, this.y);
        };
        Vec2.prototype.scale = function (s) {
            this.x *= s;
            this.y *= s;
            return this;
        };
        Vec2.prototype.perpendicular = function () {
            return [
                new Vec2(-this.y, this.x),
                new Vec2(this.y, -this.x)
            ];
        };
        return Vec2;
    }());
    exports.__esModule = true;
    exports["default"] = Vec2;
});
define("util/Strings", ["require", "exports"], function (require, exports) {
    "use strict";
    // Split string and ignore empty elements
    function fields(str, separator) {
        return str.split(separator).filter(function (elem) {
            return elem.length != 0;
        });
    }
    exports.fields = fields;
    function startsWith(str, prefix) {
        return str.indexOf(prefix) == 0;
    }
    exports.startsWith = startsWith;
    function endsWith(str, suffix) {
        return str.lastIndexOf(suffix) == (str.length - suffix.length);
    }
    exports.endsWith = endsWith;
});
define("util/Font", ["require", "exports", "util/Strings"], function (require, exports, Strings) {
    "use strict";
    var FontWeight;
    (function (FontWeight) {
        FontWeight.Lighter = 300;
        FontWeight.Normal = 400;
        FontWeight.Bold = 700;
        FontWeight.Bolder = 900;
        function fromString(text) {
            var weight = parseInt(text);
            if (!isNaN(weight)) {
                return weight;
            }
            switch (text.toLowerCase()) {
                case "lighter": return FontWeight.Lighter;
                case "normal": return FontWeight.Normal;
                case "bold": return FontWeight.Bold;
                case "bolder": return FontWeight.Bolder;
            }
            throw undefined;
        }
        FontWeight.fromString = fromString;
    })(FontWeight = exports.FontWeight || (exports.FontWeight = {}));
    var Font = (function () {
        function Font(family, size, style, weight, variant) {
            if (family === void 0) { family = "Arial"; }
            if (size === void 0) { size = 12; }
            if (style === void 0) { style = "normal"; }
            if (weight === void 0) { weight = FontWeight.Normal; }
            if (variant === void 0) { variant = "normal"; }
            this.family = family;
            this.size = size;
            this.style = style;
            this.weight = weight;
            this.variant = variant;
        }
        Font.prototype.toString = function () {
            return this.style + " " + this.weight + " " + this.variant + " " + this.size + "px '" + this.family + "'";
        };
        // font-style font-weight font-variant font-size font-family
        // italic     bold        small-caps   13px      "Times New Roman"
        Font.fromString = function (str) {
            var fields = Strings.fields(str, " ");
            var font = new Font();
            var state = 0;
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i].toLowerCase();
                if (state == 0) {
                    state = 1;
                    if (field == "normal" || field == "italic" || field == "oblique") {
                        font.style = field;
                        continue;
                    }
                }
                if (state == 1) {
                    state = 2;
                    var weight = FontWeight.fromString(field);
                    if (weight) {
                        font.weight = weight;
                        continue;
                    }
                }
                if (state == 2) {
                    state = 3;
                    if (field == "normal" || field == "small-caps") {
                        font.variant = field;
                        continue;
                    }
                }
                if (state == 3) {
                    state = 4;
                    var size = parseInt(field);
                    if (Strings.endsWith(field, "px") && !isNaN(size)) {
                        font.size = size;
                        continue;
                    }
                }
                font.family = fields.slice(i).join(" ").replace("\"", "").replace("'", "");
            }
            return font;
        };
        return Font;
    }());
    exports.Font = Font;
});
define("graphics/Image", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("graphics/Gradient", ["require", "exports", "util/Vec2"], function (require, exports, Vec2_2) {
    "use strict";
    var GradientColorStop = (function () {
        function GradientColorStop(offset, color) {
            this.offset = offset;
            this.color = color;
        }
        return GradientColorStop;
    }());
    exports.GradientColorStop = GradientColorStop;
    var Gradient = (function () {
        function Gradient(stops) {
            if (stops === void 0) { stops = new Array(); }
            this.stops = stops;
        }
        Gradient.prototype.add = function (offset, color) {
            this.stops.push(new GradientColorStop(offset, color));
            return this;
        };
        return Gradient;
    }());
    exports.Gradient = Gradient;
    var LinearGradient = (function (_super) {
        __extends(LinearGradient, _super);
        function LinearGradient(x1, y1, x2, y2, stops) {
            _super.call(this, stops);
            this.startPoint = new Vec2_2["default"](x1, y1);
            this.endPoint = new Vec2_2["default"](x2, y2);
        }
        return LinearGradient;
    }(Gradient));
    exports.LinearGradient = LinearGradient;
    var RadialGradient = (function (_super) {
        __extends(RadialGradient, _super);
        function RadialGradient(x1, y1, startRadius, x2, y2, endRadius, stops) {
            _super.call(this, stops);
            this.startRadius = startRadius;
            this.endRadius = endRadius;
            this.startCenter = new Vec2_2["default"](x1, y1);
            this.endCenter = new Vec2_2["default"](x2, y2);
        }
        return RadialGradient;
    }(Gradient));
    exports.RadialGradient = RadialGradient;
});
define("graphics/Context2D", ["require", "exports", "util/Color", "util/TransformMatrix"], function (require, exports, Color_1, TransformMatrix_2) {
    "use strict";
    (function (EventType) {
        EventType[EventType["Click"] = 0] = "Click";
        EventType[EventType["MouseDown"] = 1] = "MouseDown";
        EventType[EventType["MouseUp"] = 2] = "MouseUp";
        EventType[EventType["MouseMove"] = 3] = "MouseMove";
        EventType[EventType["MouseEnter"] = 4] = "MouseEnter";
        EventType[EventType["MouseLeave"] = 5] = "MouseLeave";
    })(exports.EventType || (exports.EventType = {}));
    var EventType = exports.EventType;
    ;
    var Context2D = (function () {
        function Context2D() {
        }
        Context2D.prototype.reset = function () {
            return this.resetTransform().clearRect(0, 0, this.width(), this.height());
        };
        Context2D.prototype.resetTransform = function () {
            return this.transformMatrix(new TransformMatrix_2["default"]());
        };
        Context2D.prototype.translate = function (x, y) {
            return this.transform(TransformMatrix_2["default"].translate(x, y));
        };
        Context2D.prototype.scale = function (x, y) {
            return this.transform(TransformMatrix_2["default"].scale(x, y));
        };
        Context2D.prototype.rotate = function (angle) {
            return this.transform(TransformMatrix_2["default"].rotate(angle));
        };
        Context2D.prototype.skew = function (x, y) {
            return this.transform(TransformMatrix_2["default"].skew(x, y));
        };
        Context2D.prototype.fillRGBA = function (r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 255; }
            return this.fillColor(new Color_1["default"](r, g, b, a));
        };
        Context2D.prototype.strokeRGBA = function (r, g, b, a) {
            if (r === void 0) { r = 0; }
            if (g === void 0) { g = 0; }
            if (b === void 0) { b = 0; }
            if (a === void 0) { a = 255; }
            return this.strokeColor(new Color_1["default"](r, g, b, a));
        };
        Context2D.prototype.drawCircle = function (centerX, centerY, radius, fill, stroke) {
            return this.beginPath().pathArc(centerX, centerY, radius, 0, Math.PI * 2).drawPath(fill, stroke);
        };
        Context2D.prototype.drawLine = function (x1, y1, x2, y2, fill, stroke) {
            return this.beginPath(x1, y1).pathLine(x2, y2).drawPath(fill, stroke);
        };
        Context2D.prototype.bindEvent = function (type, callback) { return this; };
        Context2D.prototype.popEvent = function (count) { return this; };
        Context2D.prototype.callEvent = function (type, x, y, data) { return this; };
        return Context2D;
    }());
    exports.Context2D = Context2D;
});
define("graphics/Renderable", ["require", "exports"], function (require, exports) {
    "use strict";
    var RenderTransform = (function () {
        function RenderTransform(transform, item) {
            this.transform = transform;
            this.item = item;
        }
        RenderTransform.prototype.render = function (ctx) {
            ctx.save();
            ctx.transform(this.transform);
            this.item.render(ctx);
            ctx.restore();
        };
        return RenderTransform;
    }());
    exports.RenderTransform = RenderTransform;
    var RenderGroup = (function () {
        function RenderGroup() {
            this.items = new Array();
        }
        RenderGroup.prototype.render = function (ctx) {
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                item.render(ctx);
            }
        };
        return RenderGroup;
    }());
    exports.RenderGroup = RenderGroup;
});
define("physics/Intersections", ["require", "exports", "util/Vec2"], function (require, exports, Vec2_3) {
    "use strict";
    var Bounding = (function () {
        function Bounding() {
        }
        return Bounding;
    }());
    exports.Bounding = Bounding;
    var Circle = (function (_super) {
        __extends(Circle, _super);
        function Circle(position, radius) {
            _super.call(this);
            this.position = position;
            this.radius = radius;
        }
        return Circle;
    }(Bounding));
    exports.Circle = Circle;
    var AABB = (function (_super) {
        __extends(AABB, _super);
        function AABB(min, max) {
            _super.call(this);
            this.min = min;
            this.max = max;
        }
        return AABB;
    }(Bounding));
    exports.AABB = AABB;
    function areIntersecting(lhs, rhs) {
        if (lhs == undefined || rhs == undefined) {
            return false;
        }
        else if ((lhs instanceof Circle) && (rhs instanceof Circle)) {
            return circleVsCircle(lhs, rhs);
        }
        else if (lhs instanceof Circle && rhs instanceof AABB) {
            return circleVsAABB(lhs, rhs);
        }
        else if (lhs instanceof AABB && rhs instanceof Circle) {
            return circleVsAABB(rhs, lhs);
        }
        else if (lhs instanceof AABB && rhs instanceof AABB) {
            return AABBVsAABB(lhs, rhs);
        }
        else {
            throw "Can't check intersections between these objects.";
        }
    }
    exports.areIntersecting = areIntersecting;
    function circleVsAABB(lhs, rhs) {
        var CircleAABB = {
            min: lhs.position.sub(new Vec2_3["default"](lhs.radius, lhs.radius)),
            max: lhs.position.add(new Vec2_3["default"](lhs.radius, lhs.radius))
        };
        return AABBVsAABB(CircleAABB, rhs);
    }
    function circleVsCircle(lhs, rhs) {
        return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
    }
    function AABBVsAABB(lhs, rhs) {
        if (lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x) {
            return false;
        }
        else if (lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y) {
            return false;
        }
        return true;
    }
    function interpenetrationVector(lhs, rhs) {
        if (lhs instanceof Circle && rhs instanceof AABB) {
            return new Vec2_3["default"](0, lhs.radius - lhs.position.y + rhs.max.y);
        }
        if (lhs instanceof AABB && rhs instanceof Circle) {
            return interpenetrationVector(rhs, lhs);
        }
        if (lhs instanceof Circle && rhs instanceof Circle) {
            return lhs.position.sub(rhs.position).normal().mul(lhs.radius + rhs.radius - lhs.position.distance(rhs.position));
        }
        return new Vec2_3["default"](0, 0);
    }
    exports.interpenetrationVector = interpenetrationVector;
});
define("physics/Interface", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("core/Consts", ["require", "exports"], function (require, exports) {
    "use strict";
    /* ================ Mutation ================ */
    exports.MUTATION_CHANCE = 0.01;
    exports.MUTATION_RELATIVE_FRICTION_DIFF = 0.3;
    exports.MUTATION_BONE_FRICTION_CHANCE = 0.4;
    exports.MUTATION_ELASTICITY_FRICTION_DIFF = 0.3;
    exports.MUTATION_ELASTICITY_FRICTION_CHANCE = 0.4;
    exports.MUTATION_RELATIVE_STRENGTH_DIFF = 0.3;
    exports.MUTATION_MUSCLE_STRENGTH_CHANCE = 0.4;
    exports.MUTATION_MUSCLE_MIN_LEN_CHANCE = 0.3;
    exports.MUTATION_MUSCLE_MAX_LEN_CHANGE = 0.3;
    exports.MUTATION_MUSCLE_REALTIVE_LEN_DIFF = 0.1;
    exports.MUTATION_DELETE_BONE_CHANCE = 0.1;
    exports.MUTATION_ADD_BONE_CHANCE = 0.2;
    exports.MUTATION_CONNECTION_CHANCE = 0.66;
    exports.MUTATION_CHANGE_BONE_POS_CHANCE = 0.2;
    exports.MUTATION_CHANGE_BONE_POS_MIN = -20;
    exports.MUTATION_CHANGE_BONE_POS_MAX = 20;
    /* ================ Generator ================ */
    exports.GENERATOR_BONE_MIN_RADIUS = 25;
    exports.GENERATOR_BONE_MAX_RADIUS = 40;
    exports.GENERATOR_MUSCLE_MIN_LENGTH_DIST_FACTOR = 0.3;
    exports.GENERATOR_MUSCLE_MAX_LENGTH_DIST_FACTOR = 0.9;
    exports.GENERATOR_MUSCLE_MIN_LENGTH_CONST = 0;
    exports.GENERATOR_MUSCLE_MAX_LENGTH_CONST = 500;
    exports.GENERATOR_MUSCLE_MIN_RELATIVE_LENGTH_DIFF = 0.1;
    exports.GENERATOR_MUSCLE_MAX_RELATIVE_LENGTH_DIFF = 0.8;
    exports.GENERATOR_MUSCLE_MIN_STRENGTH = 10;
    exports.GENERATOR_MUSCLE_MAX_STRENGTH = 80;
    exports.GENERATOR_MUSCLE_MIN_INTERVAL = 0.5;
    exports.GENERATOR_MUSCLE_MAX_INTERVAL = 8;
    exports.GENERATOR_MUSCLE_MIN_EXPAND_FACTOR = 0.16;
    exports.GENERATOR_MUSCLE_MAX_EXPAND_FACTOR = 0.80;
    exports.GENERATOR_BONE_MIN_AMOUNT = 4;
    exports.GENERATOR_BONE_MAX_AMOUNT = 4;
    /* ================ CreatureDiff ================ */
    exports.CREATUREDIFF_BONE_ELASTICITY_DIFF_THRESHOLD = 0.1; // Jeżeli różnica elastyczności dwóch kości będzie większa niż ta zmienna to licznik punktów zwiększy się o CREATUREDIFF_BONE_DIFF_POINTS
    exports.CREATUREDIFF_BONE_FRICTION_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_MASS_DIFF_THRESHOLD = 5; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_POS_DIFF_THRESHOLD = 10; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_RADIUS_DIFF_THRESHOLD = 2; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_ELASTICITY_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej z różnicą że chodzi o średnią arytmetyczną
    exports.CREATUREDIFF_BONE_FRICTION_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_MASS_AVG_DIFF_THRESHOLD = 5; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_POS_AVG_DIFF_THRESHOLD = 10; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_RADIUS_AVG_DIFF_THRESHOLD = 2; // Analogicznie jak wyżej
    exports.CREATUREDIFF_BONE_DIFF_POINTS = 1337; // Ilość punktów dodawanych do licznika
    exports.CREATUREDIFF_MUSCLE_EXP_FACTOR_DIFF_THRESHOLD = 0.1; // Jeżeli różnica expandFactor dwóch mięśni będzie większa niż ta zmienna to licznik punktów zwiększy się o CREATUREDIFF_MUSCLE_DIFF_POINTS
    exports.CREATUREDIFF_MUSCLE_INTERVAL_TIME_DIFF_THRESHOLD = 0.3; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_MAX_LEN_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_MIN_LEN_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_STR_DIFF_THRESHOLD = 5; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_EXP_FACTOR_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie Jak wyżej z różnicą że chodzi o średnią arytmetyczną
    exports.CREATUREDIFF_MUSCLE_INTERVAL_TIME_AVG_DIFF_THRESHOLD = 0.3; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_MAX_LEN_AVG_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_MIN_LEN_AVG_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_STR_AVG_DIFF_THRESHOLD = 5; // Analogicznie Jak wyżej
    exports.CREATUREDIFF_MUSCLE_BONES_DIFF_POINTS = 200; // Ilość punktów dodawanych do licznika gdy dwa mięśnie łączą różne kości muscle1.bone1 != muscle2.bone1 || muscle1.bone2 != muscle2.bone2
    exports.CREATUREDIFF_MUSCLE_DIFF_POINTS = 100; // Ilość punktów dodawanych za różnicę w właściwościach mięśni, gdy mięśnie łączą te same kości
    exports.CREATUREDIFF_MULTIPLIER = 2000000; // Ilość karnych punktów jest liczona ze wzoru 1/(diff + 1) * CREATUREDIFF_MULTIPLIER
    exports.CREATUREDIFF_THRESHOLD = 5e5; // Jeżeli ilość punktów będzie większa niż ta zmienna to funckja zwróci infinity
    /* ================ PHYSICS ================ */
    exports.ARE_BALLS_COLLIDABLE = true;
    exports.PHYSICS_GRAVITY = 981;
    exports.GROUND_ELASTICITY = 0.5;
    exports.GROUND_FRICTION = 0.5;
    exports.AIR_RESISTANCE = 0.5;
    /* ================ POPULATION ================ */
    exports.POPULATION_SIZE = 200;
    exports.FRACTION_OF_BREEDED_POPULATION = 0.7;
    exports.ENABLE_MASS_DESTRUCTION = true;
    exports.MASS_DESTRUCTION_FACTOR = 0.99;
    exports.MASS_DESTRUCTION_INTERVAL = 200;
    exports.HOW_MANY_COMPARISONS = 5;
    exports.COMPARE_EVERYONE_INTERVAL = 10;
    exports.NO_HOPE_VALUE = -1e4;
    exports.KILLING_CHANCE_FACTOR = 1.4;
    /* ================ SIMULATION ================ */
    exports.RUN_DURATION = 20;
    exports.SIMULATION_RESOLUTION = 30;
});
define("core/Entity", ["require", "exports", "util/Vec2", "util/Color", "util/Font", "physics/Intersections", "core/Consts"], function (require, exports, Vec2_4, Color_2, Font_1, Intersections, Consts) {
    "use strict";
    var Entity = (function () {
        function Entity(position, mass, elasticity, friction) {
            if (position === void 0) { position = new Vec2_4["default"](0, 0); }
            if (mass === void 0) { mass = 0; }
            if (elasticity === void 0) { elasticity = 0; }
            if (friction === void 0) { friction = 0; }
            this.position = position;
            this.mass = mass;
            this.elasticity = elasticity;
            this.friction = friction;
            this.velocity = new Vec2_4["default"](0, 0);
            this.acceleration = new Vec2_4["default"](0, 0);
        }
        Entity.prototype.bounding = function () { return undefined; };
        Entity.prototype.movable = function () { return this.mass != Infinity; };
        Entity.prototype.forEachSimulable = function (callback) {
            callback(this);
        };
        Entity.prototype.render = function (context) { };
        Entity.prototype.update = function (timeDelta) { };
        Entity.prototype.affect = function (physical) { };
        return Entity;
    }());
    exports.Entity = Entity;
    var Ground = (function (_super) {
        __extends(Ground, _super);
        function Ground(image, _elasticity) {
            if (image === void 0) { image = undefined; }
            if (_elasticity === void 0) { _elasticity = Consts.GROUND_ELASTICITY; }
            _super.call(this, new Vec2_4["default"](0, 0), Infinity, _elasticity, Consts.GROUND_FRICTION);
            this.image = image;
        }
        Ground.prototype.bounding = function () {
            return new Intersections.AABB(new Vec2_4["default"](-Infinity, -Infinity), new Vec2_4["default"](Infinity, 0));
        };
        Ground.prototype.affect = function (affectedObjects) {
            for (var _i = 0, affectedObjects_1 = affectedObjects; _i < affectedObjects_1.length; _i++) {
                var affectedObject = affectedObjects_1[_i];
                if (affectedObject.movable()) {
                    affectedObject.acceleration = affectedObject.acceleration.add(new Vec2_4["default"](0, -Consts.PHYSICS_GRAVITY));
                }
            }
        };
        Ground.prototype.render = function (context) {
            var matrix = context.transformMatrix(); // hacky calculations of visible area
            var minX = -matrix[0][2] / matrix[0][0];
            var maxX = minX + context.width() / matrix[0][0];
            var minI = Math.floor(minX / 200) - 1;
            var maxI = Math.ceil(maxX / 200) + 1;
            if (this.image) {
                for (var i = minI; i <= maxI; i++) {
                    context.save().translate(i * 200 - 1, 0).scale(1, -1);
                    context.drawImage(this.image, 0, 0, 200, 200);
                    context.restore();
                }
            }
            else {
                context.fillRGBA(0, 127, 0).drawRect(-100000, -100000, 200000, 100000, true, false);
            }
            for (var i = minI; i <= maxI; i++) {
                context.fillColor(Color_2["default"].Black).drawRect(i * 200 - 1, -100000, 2, 100000, true, false);
                context.save().translate(i * 200 - 1, 0).scale(1, -1);
                context.fillColor(Color_2["default"].White).strokeColor(Color_2["default"].Black).lineWidth(2);
                context.font(new Font_1.Font("Arial", 40, "normal", Font_1.FontWeight.Bold));
                context.drawText(12, 12, (i * 200).toString(), "hanging", true, true);
                context.restore();
            }
        };
        return Ground;
    }(Entity));
    exports.Ground = Ground;
    var Air = (function (_super) {
        __extends(Air, _super);
        function Air(image, resistance) {
            if (image === void 0) { image = undefined; }
            if (resistance === void 0) { resistance = Consts.AIR_RESISTANCE; }
            _super.call(this);
            this.image = image;
            this.resistance = resistance;
        }
        Air.prototype.affect = function (objects) {
            for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
                var obj = objects_1[_i];
                if (obj.movable()) {
                    obj.acceleration = obj.acceleration.sub(obj.velocity.mul(this.resistance));
                }
            }
        };
        Air.prototype.render = function (context) {
            if (this.image) {
                context.save().resetTransform();
                context.drawImage(this.image, 0, 0, context.width(), context.height());
                context.restore();
            }
        };
        return Air;
    }(Entity));
    exports.Air = Air;
});
define("physics/Collisions", ["require", "exports", "util/Vec2", "physics/Intersections", "core/Consts"], function (require, exports, Vec2_5, Intersections, Consts) {
    "use strict";
    function Collide(lhs, rhs) {
        if (lhs.mass == Infinity && rhs.mass != Infinity) {
            _a = [rhs, lhs], lhs = _a[0], rhs = _a[1];
        }
        if (lhs.mass != Infinity && rhs.mass != Infinity && !Consts.ARE_BALLS_COLLIDABLE) {
            return;
        }
        var lBounds = lhs.bounding();
        var rBounds = rhs.bounding();
        if (Intersections.areIntersecting(lBounds, rBounds)) {
            if (lhs.mass == Infinity && rhs.mass == Infinity) {
                return;
            }
            var coefficientOfRestitution = (lhs.elasticity + rhs.elasticity) / 2;
            var coefficientOfDynamicFriction = (lhs.friction + rhs.friction) / 2;
            var coefficientOfStaticFriction = Math.sqrt(Math.pow(lhs.friction, 2) + Math.pow(rhs.friction, 2));
            var normal = normalVector(lBounds, rBounds);
            if (lhs.mass != Infinity && rhs.mass != Infinity) {
                var lhsVelocityOrthogontal = rhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * rhs.mass).add(lhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution * rhs.mass)).mul(1 / (lhs.mass + rhs.mass));
                var lhsVelocityTangent = lhs.velocity.projection(new Vec2_5["default"](-normal.y, normal.x));
                var rhsVelocityOrthogontal = lhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * lhs.mass).sub(rhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution * rhs.mass)).mul(1 / (lhs.mass + rhs.mass));
                var rhsVelocityTangent = rhs.velocity.projection(new Vec2_5["default"](-normal.y, normal.x));
                var interpenetration = Intersections.interpenetrationVector(lBounds, rBounds);
                lhs.position = lhs.position.add(interpenetration.mul(rhs.mass / (lhs.mass + rhs.mass)));
                rhs.position = rhs.position.sub(interpenetration.mul(lhs.mass / (lhs.mass + rhs.mass)));
                lhs.acceleration = lhs.acceleration.sub(rhs.acceleration.projection(normal));
                rhs.acceleration = rhs.acceleration.sub(lhs.acceleration.projection(normal));
                lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
                rhs.velocity = rhsVelocityOrthogontal.add(rhsVelocityTangent);
            }
            else if (lhs.mass != Infinity && rhs.mass == Infinity) {
                var lhsAccelerationOrthogontal = lhs.acceleration.projection(normal);
                var lhsAccelerationTangent = lhs.acceleration.projection(new Vec2_5["default"](-normal.y, normal.x));
                lhs.position = lhs.position.add(Intersections.interpenetrationVector(lBounds, rBounds));
                var lhsVelocityOrthogontal = rhs.velocity.projection(normal).mul(coefficientOfRestitution + 1).sub(lhs.velocity.projection(normal).mul(coefficientOfRestitution));
                var lhsVelocityTangent = lhs.velocity.projection(new Vec2_5["default"](-normal.y, normal.x));
                if (lhsVelocityTangent.length() > 10 * lhs.mass * lhs.friction) {
                    lhs.acceleration = lhs.acceleration.add(lhsVelocityTangent.normal().mul(-lhsAccelerationOrthogontal.mul(lhs.mass * coefficientOfDynamicFriction).length()));
                }
                else {
                    lhsVelocityTangent = new Vec2_5["default"](0, 0);
                    if (lhsAccelerationTangent.length() <= lhsVelocityOrthogontal.length() * coefficientOfStaticFriction * lhs.mass) {
                        lhs.acceleration = lhs.acceleration.sub(lhsAccelerationTangent);
                    }
                }
                lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
            }
        }
        var _a;
    }
    exports.__esModule = true;
    exports["default"] = Collide;
    function normalVector(lhs, rhs) {
        if (lhs instanceof Intersections.Circle && rhs instanceof Intersections.Circle) {
            var orthogontal = lhs.position.sub(rhs.position).normal();
            return orthogontal;
        }
        else {
            return new Vec2_5["default"](0, 1);
        }
    }
    exports.normalVector = normalVector;
});
define("physics/Simulate", ["require", "exports", "physics/Collisions", "util/Vec2"], function (require, exports, Collisions_1, Vec2_6) {
    "use strict";
    function Simulate(simulables, timeDelta) {
        for (var _i = 0, simulables_1 = simulables; _i < simulables_1.length; _i++) {
            var physical = simulables_1[_i];
            physical.affect(simulables);
        }
        for (var i = 0; i < simulables.length; i++) {
            for (var j = i + 1; j < simulables.length; ++j) {
                Collisions_1["default"](simulables[i], simulables[j]);
            }
        }
        for (var _a = 0, simulables_2 = simulables; _a < simulables_2.length; _a++) {
            var physical = simulables_2[_a];
            physical.velocity = physical.velocity.add(physical.acceleration.mul(timeDelta));
            physical.acceleration = new Vec2_6["default"](0, 0);
            physical.position = physical.position.add(physical.velocity.mul(timeDelta));
        }
    }
    exports.__esModule = true;
    exports["default"] = Simulate;
});
define("core/Scene", ["require", "exports", "util/Arrays", "physics/Simulate"], function (require, exports, Arrays, Simulate_1) {
    "use strict";
    var Scene = (function () {
        function Scene() {
            this.entities = new Array();
            this.physical = new Array();
        }
        Scene.prototype.addEntity = function (entity) {
            var _this = this;
            this.entities.push(entity);
            entity.forEachSimulable(function (obj) { return _this.addSimulable(obj); });
        };
        Scene.prototype.removeEntity = function (entity) {
            var _this = this;
            Arrays.remove(this.entities, entity);
            entity.forEachSimulable(function (obj) { return _this.removeSimulable(obj); });
        };
        Scene.prototype.addSimulable = function (object) {
            this.physical.push(object);
        };
        Scene.prototype.removeSimulable = function (object) {
            Arrays.remove(this.physical, object);
        };
        Scene.prototype.update = function (timeDelta) {
            for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                entity.update(timeDelta);
            }
            Simulate_1["default"](this.physical, timeDelta);
        };
        Scene.prototype.render = function (context) {
            context.save().scale(1, -1); // flip Y coordinate
            for (var _i = 0, _a = this.entities; _i < _a.length; _i++) {
                var entity = _a[_i];
                entity.render(context);
            }
            context.restore();
        };
        return Scene;
    }());
    exports.Scene = Scene;
});
define("util/DisjointSet", ["require", "exports"], function (require, exports) {
    "use strict";
    var DisjointNode = (function () {
        function DisjointNode(parent, size, rank) {
            if (parent === void 0) { parent = null; }
            if (size === void 0) { size = 1; }
            if (rank === void 0) { rank = 0; }
            this.parent = parent;
            this.size = size;
            this.rank = rank;
        }
        DisjointNode.prototype.getParent = function () {
            if (this.parent == null) {
                return this;
            }
            var parent = this.parent.getParent();
            this.parent = parent;
            return parent;
        };
        DisjointNode.prototype.union = function (rhs) {
            var lhsParent = this.getParent();
            var rhsParent = rhs.getParent();
            if (lhsParent == rhsParent) {
                return;
            }
            if (lhsParent.rank < rhsParent.rank) {
                lhsParent.parent = rhsParent;
                rhsParent.size += lhsParent.size;
            }
            else if (lhsParent.rank > rhsParent.rank) {
                rhsParent.parent = lhsParent;
                lhsParent.size += rhsParent.size;
            }
            else {
                lhsParent.parent = rhsParent;
                rhsParent.size += lhsParent.size;
                rhsParent.rank++;
            }
        };
        DisjointNode.prototype.isSameSet = function (rhs) {
            return (this.getParent() == rhs.getParent() ? true : false);
        };
        DisjointNode.prototype.getSize = function () {
            return this.getParent().size;
        };
        return DisjointNode;
    }());
    exports.__esModule = true;
    exports["default"] = DisjointNode;
});
define("core/Generator", ["require", "exports", "core/Creature", "core/Creature", "util/Vec2", "core/Creature", "physics/Collisions", "util/Math", "core/Consts"], function (require, exports, Creature_1, Creature_2, Vec2_7, Creature_3, Collisions_2, MathUtil, Consts) {
    "use strict";
    function generateCreature() {
        while (true) {
            var generated = new Creature_1.Creature();
            var numberOfBones = Math.floor(MathUtil.random(Consts.GENERATOR_BONE_MIN_AMOUNT, Consts.GENERATOR_BONE_MAX_AMOUNT + 1));
            for (var i = 0; i < numberOfBones; ++i) {
                generated.bones.push(generateCreatureBone());
            }
            for (var i = 0; i < numberOfBones; ++i) {
                for (var j = i + 1; j < numberOfBones; ++j) {
                    Collisions_2["default"](generated.bones[i], generated.bones[j]);
                    if (Math.random() >= 0.5) {
                        generated.muscles.push(generateCreatureMuscle(generated.bones[i], generated.bones[j]));
                    }
                }
            }
            if (generated.isStronglyConnected()) {
                return generated;
            }
        }
    }
    exports.generateCreature = generateCreature;
    function generateCreatureBone() {
        var newBone = new Creature_2.CreatureBone(new Vec2_7["default"](Math.random() * 500 - 1000, Math.random() * 500 - 1000 + 1500), MathUtil.random(Consts.GENERATOR_BONE_MIN_RADIUS, Consts.GENERATOR_BONE_MAX_RADIUS), 0, // Mass will be calculated later
        Math.random(), Math.random());
        newBone.mass = Math.PI * newBone.radius / 20;
        return newBone;
    }
    exports.generateCreatureBone = generateCreatureBone;
    function generateCreatureMuscle(lhs, rhs) {
        var dist = lhs.position.distance(rhs.position);
        var len1 = dist * MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_LENGTH_DIST_FACTOR, Consts.GENERATOR_MUSCLE_MAX_LENGTH_DIST_FACTOR) +
            MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_LENGTH_CONST, Consts.GENERATOR_MUSCLE_MAX_LENGTH_CONST);
        var len2 = len1 * (1 + MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_RELATIVE_LENGTH_DIFF, Consts.GENERATOR_MUSCLE_MAX_RELATIVE_LENGTH_DIFF));
        var str = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_STRENGTH, Consts.GENERATOR_MUSCLE_MAX_STRENGTH);
        var interval = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_INTERVAL, Consts.GENERATOR_MUSCLE_MAX_INTERVAL);
        var expandFactor = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_EXPAND_FACTOR, Consts.GENERATOR_MUSCLE_MAX_EXPAND_FACTOR);
        return new Creature_3.CreatureMuscle(lhs, rhs, len1, len2, str, interval, expandFactor);
    }
    exports.generateCreatureMuscle = generateCreatureMuscle;
});
define("core/Breed", ["require", "exports", "core/Creature", "core/Creature", "util/Vec2", "core/Creature"], function (require, exports, Creature_4, Creature_5, Vec2_8, Creature_6) {
    "use strict";
    function breed(lhs, rhs) {
        if (lhs.bones.length != rhs.bones.length) {
            throw "Not implemented";
        }
        while (true) {
            var compBones = function (lhs, rhs) {
                if (lhs.position == rhs.position) {
                    return 0;
                }
                else if (lhs.position.x < rhs.position.x) {
                    return -1;
                }
                else if (lhs.position.x == rhs.position.x && lhs.position.y < rhs.position.y) {
                    return -1;
                }
                else {
                    return 1;
                }
            };
            lhs.bones.sort(compBones);
            rhs.bones.sort(compBones);
            var kid = new Creature_4.Creature();
            for (var i = 0; i < lhs.bones.length; ++i) {
                kid.bones.push(new Creature_5.CreatureBone(new Vec2_8["default"]((lhs.bones[i].position.x + rhs.bones[i].position.x) / 2, (lhs.bones[i].position.y + rhs.bones[i].position.y) / 2), (lhs.bones[i].radius + rhs.bones[i].radius) / 2, (lhs.bones[i].mass + rhs.bones[i].mass) / 2, (lhs.bones[i].elasticity + rhs.bones[i].elasticity) / 2, (lhs.bones[i].friction + rhs.bones[i].friction) / 2));
            }
            var getMuscleIn = function (lhs, rhs, muscles) {
                for (var i = 0; i < muscles.length; ++i) {
                    if ((muscles[i].bone1 == lhs && muscles[i].bone2 == rhs) || (muscles[i].bone1 == rhs && muscles[i].bone2 == lhs)) {
                        return muscles[i];
                    }
                }
                return undefined;
            };
            for (var i = 0; i < lhs.bones.length; ++i) {
                for (var j = i + 1; j < lhs.bones.length; ++j) {
                    var lhsMuscle = getMuscleIn(lhs.bones[i], lhs.bones[j], lhs.muscles);
                    var rhsMuscle = getMuscleIn(rhs.bones[i], rhs.bones[j], rhs.muscles);
                    if (lhsMuscle != undefined && rhsMuscle != undefined) {
                        kid.muscles.push(new Creature_6.CreatureMuscle(kid.bones[i], kid.bones[j], (lhsMuscle.minLength + rhsMuscle.minLength) / 2, (lhsMuscle.maxLength + rhsMuscle.maxLength) / 2, (lhsMuscle.strength + rhsMuscle.strength) / 2, (lhsMuscle.timerInterval + rhsMuscle.timerInterval) / 2, (lhsMuscle.expandFactor + rhsMuscle.expandFactor) / 2));
                    }
                    else if (lhsMuscle != undefined && Math.random() >= 0.5) {
                        kid.muscles.push(new Creature_6.CreatureMuscle(kid.bones[i], kid.bones[j], lhsMuscle.minLength, lhsMuscle.maxLength, lhsMuscle.strength, lhsMuscle.timerInterval, lhsMuscle.expandFactor));
                    }
                    else if (rhsMuscle != undefined && Math.random() >= 0.5) {
                        kid.muscles.push(new Creature_6.CreatureMuscle(kid.bones[i], kid.bones[j], rhsMuscle.minLength, rhsMuscle.maxLength, rhsMuscle.strength, rhsMuscle.timerInterval, rhsMuscle.expandFactor));
                    }
                }
            }
            if (kid.isStronglyConnected()) {
                return kid;
            }
        }
    }
    exports.__esModule = true;
    exports["default"] = breed;
});
define("core/Util", ["require", "exports", "core/Entity", "core/Scene"], function (require, exports, Entity_1, Scene_1) {
    "use strict";
    var SkyImage;
    var GroundImage;
    function setResources(skyImage, groundImage) {
        SkyImage = skyImage;
        GroundImage = groundImage;
    }
    exports.setResources = setResources;
    function creatureScene(creature) {
        var scene = new Scene_1.Scene();
        scene.addEntity(new Entity_1.Air(SkyImage));
        scene.addEntity(new Entity_1.Ground(GroundImage));
        if (creature) {
            scene.addEntity(creature);
        }
        return scene;
    }
    exports.creatureScene = creatureScene;
});
define("core/Population", ["require", "exports", "core/Creature", "core/Generator", "util/Vec2", "core/Breed", "core/Consts", "core/Util", "util/Math", "core/Compress"], function (require, exports, Creature_7, Generator, Vec2_9, Breed_1, Consts, Util, MathUtil, Compress) {
    "use strict";
    var Population = (function () {
        function Population(size) {
            if (size === void 0) { size = 1000; }
            this.population = new Array();
            this.generation = 0;
            this.scene = Util.creatureScene();
            this.addRandomlyGeneratedCreatures(size);
            this.moveAllToStartingPosition();
        }
        Population.prototype.sortCreatures = function () {
            this.population.sort(function (lhs, rhs) {
                if (lhs.result == rhs.result) {
                    return 0;
                }
                else if (lhs.result < rhs.result) {
                    return 1;
                }
                else {
                    return -1;
                }
            });
        };
        Population.prototype.push = function (newCreature) {
            this.population.push(newCreature);
        };
        Population.prototype.removeSlowest = function (amount) {
            if (amount === void 0) { amount = this.population.length / 2; }
            this.sortCreatures();
            for (var i = 0; i < this.population.length; i++) {
                if (this.population[i].result < Consts.NO_HOPE_VALUE || MathUtil.randomChance(MathUtil.tanh(Consts.KILLING_CHANCE_FACTOR * i / this.population.length))) {
                    this.population.splice(i, 1);
                    amount--;
                    i--;
                }
            }
            console.log(amount);
            while (amount > 0) {
                this.population.pop();
                amount--;
            }
        };
        Population.prototype.addRandomlyGeneratedCreatures = function (amount) {
            if (amount === void 0) { amount = 1; }
            for (var i = 0; i < amount; ++i) {
                this.push(Generator.generateCreature());
            }
        };
        Population.prototype.moveAllToStartingPosition = function () {
            for (var _i = 0, _a = this.population; _i < _a.length; _i++) {
                var creature = _a[_i];
                // creature.result = -Infinity;
                var center = creature.center();
                for (var _b = 0, _c = creature.bones; _b < _c.length; _b++) {
                    var bone = _c[_b];
                    bone.position = bone.position.sub(center);
                    bone.position.y = bone.position.y + 300;
                }
            }
        };
        Population.prototype.rate = function () {
            for (var _i = 0, _a = this.population; _i < _a.length; _i++) {
                var creature = _a[_i];
                if (creature.result != -Infinity) {
                    continue;
                }
                var clone = creature.clone();
                this.scene.addEntity(clone);
                for (var i = 0; i < Consts.RUN_DURATION * Consts.SIMULATION_RESOLUTION; i++) {
                    this.scene.update(1 / Consts.SIMULATION_RESOLUTION);
                }
                creature.result = clone.currentResult();
                creature.resultWithoutPenalties = clone.currentResult();
                this.scene.removeEntity(clone);
            }
            this.sortCreatures();
            var howManyComparisons = Consts.HOW_MANY_COMPARISONS;
            if ((this.generation + 1) % Consts.COMPARE_EVERYONE_INTERVAL == 0) {
                howManyComparisons = this.population.length;
            }
            for (var i = 0; i < this.population.length; ++i) {
                var lhs = this.population[i];
                var delta = 0;
                for (var j = 0; j < Math.min(howManyComparisons, i); ++j) {
                    if (j == i) {
                        continue;
                    }
                    var rhs = this.population[j];
                    delta += Consts.CREATUREDIFF_MULTIPLIER / (lhs.diff(rhs) + 1); //Math.max(Consts.CREATUREDIFF_MULTIPLIER/(lhs.diff(rhs) + 1), delta);
                }
                // console.log(delta)
                delta *= 50 / lhs.bones.length;
                lhs.result -= delta;
                lhs.minusPoints = delta;
            }
            this.sortCreatures();
            console.log("Best: ", this.population[0].result);
        };
        Population.prototype.eugenics = function () {
            if (Consts.ENABLE_MASS_DESTRUCTION && (this.generation + 1) % Consts.MASS_DESTRUCTION_INTERVAL == 0) {
                this.removeSlowest(Math.floor(this.population.length * Consts.MASS_DESTRUCTION_FACTOR));
                while (this.population.length < Consts.POPULATION_SIZE) {
                    this.push(Generator.generateCreature());
                }
            }
            else {
                this.removeSlowest();
            }
            var oldPopulationSize = this.population.length;
            while (this.population.length < Consts.FRACTION_OF_BREEDED_POPULATION * Consts.POPULATION_SIZE) {
                var fatherIndex = 0;
                var motherIndex = 0;
                while (fatherIndex == motherIndex && oldPopulationSize != 1) {
                    fatherIndex = Math.floor(Math.random() * oldPopulationSize);
                    motherIndex = Math.floor(Math.random() * oldPopulationSize);
                }
                var father = this.population[fatherIndex];
                var mother = this.population[motherIndex];
                var kid = undefined;
                try {
                    kid = Breed_1["default"](mother, father).mutate();
                }
                catch (e) {
                    continue;
                }
                this.push(kid);
            }
            while (this.population.length < Consts.POPULATION_SIZE) {
                this.push(Generator.generateCreature());
            }
            this.moveAllToStartingPosition();
            this.generation++;
        };
        Population.prototype.save = function () {
            return JSON.stringify(Compress.compressPopulation(this));
        };
        Population.prototype.load = function (json) {
            var packed = JSON.parse(json);
            this.population = new Array(packed.population.length);
            this.generation = packed.generation;
            for (var i = 0; i < packed.population.length; i++) {
                var packedCreature = packed.population[i];
                var creature = new Creature_7.Creature(new Array(packedCreature.bones.length), new Array(packedCreature.muscles.length));
                this.population[i] = creature;
                for (var j = 0; j < creature.bones.length; j++) {
                    var packedBone = packedCreature.bones[j];
                    creature.bones[j] = new Creature_7.CreatureBone(new Vec2_9["default"](packedBone.position[0], packedBone.position[1]), packedBone.radius, packedBone.mass, packedBone.elasticity, packedBone.friction);
                }
                for (var j = 0; j < creature.muscles.length; j++) {
                    var packedMuscle = packedCreature.muscles[j];
                    creature.muscles[j] = new Creature_7.CreatureMuscle(creature.bones[packedMuscle.bone1], creature.bones[packedMuscle.bone2], packedMuscle.minLength, packedMuscle.maxLength, packedMuscle.strength, packedMuscle.timerInterval, packedMuscle.expandFactor);
                }
            }
        };
        return Population;
    }());
    exports.__esModule = true;
    exports["default"] = Population;
});
define("core/Compress", ["require", "exports"], function (require, exports) {
    "use strict";
    var PopulationPacked = (function () {
        function PopulationPacked() {
        }
        return PopulationPacked;
    }());
    exports.PopulationPacked = PopulationPacked;
    var CreaturePacked = (function () {
        function CreaturePacked() {
        }
        return CreaturePacked;
    }());
    exports.CreaturePacked = CreaturePacked;
    var CreatureBonePacked = (function () {
        function CreatureBonePacked() {
            this.radius = 1;
            this.mass = 1;
            this.elasticity = 0.75;
            this.friction = 0;
        }
        return CreatureBonePacked;
    }());
    exports.CreatureBonePacked = CreatureBonePacked;
    var CreatureMusclePacked = (function () {
        function CreatureMusclePacked() {
        }
        return CreatureMusclePacked;
    }());
    exports.CreatureMusclePacked = CreatureMusclePacked;
    function compressCreatureBone(bone) {
        var packedBone = new CreatureBonePacked();
        packedBone.position = [bone.position.x, bone.position.y];
        packedBone.radius = bone.radius;
        packedBone.mass = bone.mass;
        packedBone.elasticity = bone.elasticity;
        packedBone.friction = bone.friction;
        return packedBone;
    }
    exports.compressCreatureBone = compressCreatureBone;
    function compressCreatureMuscle(muscle, creature) {
        var packedMuscle = new CreatureMusclePacked();
        packedMuscle.bone1 = creature.bones.indexOf(muscle.bone1);
        packedMuscle.bone2 = creature.bones.indexOf(muscle.bone2);
        packedMuscle.minLength = muscle.minLength;
        packedMuscle.maxLength = muscle.maxLength;
        packedMuscle.strength = muscle.strength;
        packedMuscle.timerInterval = muscle.timerInterval;
        packedMuscle.expandFactor = muscle.expandFactor;
        return packedMuscle;
    }
    exports.compressCreatureMuscle = compressCreatureMuscle;
    function compressCreature(creature) {
        var packedCreature = new CreaturePacked();
        packedCreature.bones = new Array(creature.bones.length);
        packedCreature.muscles = new Array(creature.muscles.length);
        for (var i = 0; i < creature.bones.length; ++i) {
            var bone = creature.bones[i];
            packedCreature.bones[i] = compressCreatureBone(bone);
        }
        for (var i = 0; i < creature.muscles.length; ++i) {
            var muscle = creature.muscles[i];
            packedCreature.muscles[i] = compressCreatureMuscle(muscle, creature);
        }
        return packedCreature;
    }
    exports.compressCreature = compressCreature;
    function compressPopulation(population) {
        var packed = new PopulationPacked();
        packed.population = new Array(population.population.length);
        packed.generation = population.generation;
        for (var i = 0; i < population.population.length; ++i) {
            var creature = population.population[i];
            packed.population[i] = compressCreature(creature);
        }
        return packed;
    }
    exports.compressPopulation = compressPopulation;
});
define("util/PseudoGradient", ["require", "exports", "util/Color"], function (require, exports, Color_3) {
    "use strict";
    var PseudoGradientElement = (function () {
        function PseudoGradientElement() {
        }
        return PseudoGradientElement;
    }());
    var PseudoGradient = (function () {
        function PseudoGradient(vec) {
            if (vec === void 0) { vec = new Array(); }
            this.vec = vec;
        }
        PseudoGradient.prototype.get = function (value) {
            if (this.vec.length == 0) {
                return Color_3["default"].Transparent;
            }
            if (value < this.vec[0].value) {
                return this.vec[0].color;
            }
            else if (value >= this.vec[this.vec.length - 1].value) {
                return this.vec[this.vec.length - 1].color;
            }
            for (var i = 0; i < this.vec.length - 1; ++i) {
                if (this.vec[i].value <= value && this.vec[i + 1].value > value) {
                    var relative = (value - this.vec[i].value) / (this.vec[i + 1].value - this.vec[i].value);
                    return new Color_3["default"](Math.round(this.vec[i].color.r * (1 - relative) + this.vec[i + 1].color.r * relative), Math.round(this.vec[i].color.g * (1 - relative) + this.vec[i + 1].color.g * relative), Math.round(this.vec[i].color.b * (1 - relative) + this.vec[i + 1].color.b * relative), Math.round(this.vec[i].color.a * (1 - relative) + this.vec[i + 1].color.a * relative));
                }
            }
            return Color_3["default"].Transparent;
        };
        PseudoGradient.prototype.insert = function (elem) {
            this.vec.push(elem);
        };
        PseudoGradient.prototype.prepare = function () {
            this.vec.sort(function (lhs, rhs) {
                if (lhs.value < rhs.value) {
                    return -1;
                }
                else if (lhs.value > rhs.value) {
                    return 1;
                }
                else {
                    return 0;
                }
            });
        };
        return PseudoGradient;
    }());
    exports.__esModule = true;
    exports["default"] = PseudoGradient;
});
define("core/Creature", ["require", "exports", "util/Vec2", "core/Entity", "util/Color", "physics/Intersections", "util/Math", "core/Consts", "util/DisjointSet", "core/Generator", "util/PseudoGradient"], function (require, exports, Vec2_10, Entity_2, Color_4, Intersections, utilMath, Consts, DisjointSet_1, Generator, PseudoGradient_1) {
    "use strict";
    var bonePseudoGradient = new PseudoGradient_1["default"]();
    bonePseudoGradient.insert({ value: 0.00, color: Color_4["default"].White }); // low friction
    bonePseudoGradient.insert({ value: 0.33, color: Color_4["default"].Yellow });
    bonePseudoGradient.insert({ value: 0.66, color: Color_4["default"].Red });
    bonePseudoGradient.insert({ value: 1.00, color: Color_4["default"].Black }); // high friction
    bonePseudoGradient.prepare();
    var Creature = (function (_super) {
        __extends(Creature, _super);
        function Creature(bones, muscles, result, resultWithoutPenalties) {
            if (bones === void 0) { bones = new Array(); }
            if (muscles === void 0) { muscles = new Array(); }
            if (result === void 0) { result = -Infinity; }
            if (resultWithoutPenalties === void 0) { resultWithoutPenalties = -Infinity; }
            _super.call(this);
            this.bones = bones;
            this.muscles = muscles;
            this.result = result;
            this.resultWithoutPenalties = resultWithoutPenalties;
            this.minusPoints = 0;
        }
        Creature.prototype.movable = function () { return false; }; // movable are its parts, creature is just group
        Creature.prototype.forEachSimulable = function (callback) {
            for (var _i = 0, _a = this.muscles; _i < _a.length; _i++) {
                var muscle = _a[_i];
                callback(muscle);
            }
            for (var _b = 0, _c = this.bones; _b < _c.length; _b++) {
                var bone = _c[_b];
                callback(bone);
            }
        };
        Creature.prototype.render = function (context) {
            for (var _i = 0, _a = this.muscles; _i < _a.length; _i++) {
                var muscle = _a[_i];
                muscle.render(context);
            }
            for (var _b = 0, _c = this.bones; _b < _c.length; _b++) {
                var bone = _c[_b];
                bone.render(context);
            }
        };
        Creature.prototype.currentResult = function () {
            var fitness = Infinity;
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone = _a[_i];
                fitness = Math.min(fitness, bone.position.x);
            }
            return fitness;
        };
        Creature.prototype.extremes = function () {
            var aabb = new Intersections.AABB(new Vec2_10["default"](Infinity, Infinity), new Vec2_10["default"](-Infinity, -Infinity));
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone = _a[_i];
                aabb.min.x = Math.min(aabb.min.x, bone.position.x - bone.radius);
                aabb.min.y = Math.min(aabb.min.y, bone.position.y - bone.radius);
                aabb.max.x = Math.max(aabb.max.x, bone.position.x + bone.radius);
                aabb.max.y = Math.max(aabb.max.y, bone.position.y + bone.radius);
            }
            return aabb;
        };
        Creature.prototype.center = function () {
            var avg = new Vec2_10["default"]();
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone = _a[_i];
                avg = avg.add(bone.position);
            }
            return avg.div(this.bones.length);
        };
        Creature.prototype.update = function (timeDelta) {
            for (var i = 0; i < this.bones.length; ++i) {
                this.bones[i].update(timeDelta);
            }
            for (var i = 0; i < this.muscles.length; ++i) {
                this.muscles[i].update(timeDelta);
            }
        };
        Creature.prototype.makeDisjointSet = function () {
            var disjoint = new Array(this.bones.length);
            for (var i = 0; i < this.bones.length; ++i) {
                disjoint[i] = new DisjointSet_1["default"]();
            }
            for (var i = 0; i < this.muscles.length; ++i) {
                var lhsId = this.bones.indexOf(this.muscles[i].bone1);
                var rhsId = this.bones.indexOf(this.muscles[i].bone2);
                disjoint[lhsId].union(disjoint[rhsId]);
            }
            return disjoint;
        };
        Creature.prototype.isStronglyConnected = function () {
            return (this.bones.length <= 1 ? true : this.makeDisjointSet()[0].getSize() == this.bones.length);
        };
        Creature.prototype.makeStronglyConnected = function () {
            if (this.isStronglyConnected()) {
                return this;
            }
            var disjoint = this.makeDisjointSet();
            for (var i = 1; i < disjoint.length; ++i) {
                if (disjoint[0].isSameSet(disjoint[i]) == false) {
                    this.muscles.push(Generator.generateCreatureMuscle(this.bones[0], this.bones[i]));
                    disjoint[0].union(disjoint[i]);
                }
            }
            return this;
        };
        Creature.prototype.clone = function () {
            var myClone = new Creature();
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone = _a[_i];
                myClone.bones.push(new CreatureBone(bone.position, bone.radius, bone.mass, bone.elasticity, bone.friction));
            }
            var getMuscleIn = function (lhs, rhs, muscles) {
                for (var i = 0; i < muscles.length; ++i) {
                    if ((muscles[i].bone1 == lhs && muscles[i].bone2 == rhs) || (muscles[i].bone1 == rhs && muscles[i].bone2 == lhs)) {
                        return muscles[i];
                    }
                }
                return undefined;
            };
            for (var i = 0; i < this.bones.length; ++i) {
                for (var j = i + 1; j < this.bones.length; ++j) {
                    var muscle = getMuscleIn(this.bones[i], this.bones[j], this.muscles);
                    if (muscle != undefined) {
                        myClone.muscles.push(new CreatureMuscle(myClone.bones[i], myClone.bones[j], muscle.minLength, muscle.maxLength, muscle.strength, muscle.timerInterval, muscle.expandFactor));
                    }
                }
            }
            return myClone;
        };
        Creature.prototype.mutate = function () {
            if (!utilMath.randomChance(Consts.MUTATION_CHANCE)) {
                return this;
            }
            // Remove nodes
            for (var i = this.bones.length - 1; i >= 0; --i) {
                if (this.bones.length > 1 && utilMath.randomChance(Consts.MUTATION_DELETE_BONE_CHANCE)) {
                    for (var j = this.muscles.length - 1; j >= 0; --j) {
                        if (this.muscles[j].bone1 == this.bones[i] || this.muscles[j].bone2 == this.bones[i]) {
                            this.muscles.splice(j, 1);
                        }
                    }
                    this.bones.splice(i, 1);
                }
            }
            this.makeStronglyConnected();
            // Add random node
            if (utilMath.randomChance(Consts.MUTATION_ADD_BONE_CHANCE)) {
                this.bones.push(Generator.generateCreatureBone());
                var edges = 0;
                for (var i = 0; i < this.bones.length - 1; ++i) {
                    if (utilMath.randomChance(Consts.MUTATION_CONNECTION_CHANCE)) {
                        this.muscles.push(Generator.generateCreatureMuscle(this.bones[i], this.bones[this.bones.length - 1]));
                        edges++;
                    }
                }
                if (edges == 0) {
                    this.bones.pop();
                }
            }
            // Random bone friction
            for (var i = 0; i < this.bones.length; ++i) {
                if (utilMath.randomChance(Consts.MUTATION_BONE_FRICTION_CHANCE)) {
                    var diff = this.bones[i].friction * (Consts.MUTATION_RELATIVE_FRICTION_DIFF / 2) * Math.random();
                    diff *= (utilMath.randomChance(0.5) ? -1 : 1);
                    var newFriction = this.bones[i].friction + diff;
                    newFriction = Math.min(newFriction, 1);
                    newFriction = Math.max(newFriction, 0);
                    this.bones[i].friction = newFriction;
                }
            }
            // Random bone elasticity
            for (var i = 0; i < this.bones.length; ++i) {
                if (utilMath.randomChance(Consts.MUTATION_ELASTICITY_FRICTION_CHANCE)) {
                    var diff = this.bones[i].friction * (Consts.MUTATION_ELASTICITY_FRICTION_DIFF / 2) * Math.random();
                    diff *= (utilMath.randomChance(0.5) ? -1 : 1);
                    var newElasticity = this.bones[i].friction + diff;
                    newElasticity = Math.min(newElasticity, 1);
                    newElasticity = Math.max(newElasticity, 0);
                    this.bones[i].elasticity = newElasticity;
                }
            }
            // Random bone position
            for (var _i = 0, _a = this.bones; _i < _a.length; _i++) {
                var bone = _a[_i];
                if (utilMath.randomChance(Consts.MUTATION_CHANGE_BONE_POS_CHANCE)) {
                    this.position.x += utilMath.random(Consts.MUTATION_CHANGE_BONE_POS_MIN, Consts.MUTATION_CHANGE_BONE_POS_MAX);
                    this.position.y += utilMath.random(Consts.MUTATION_CHANGE_BONE_POS_MIN, Consts.MUTATION_CHANGE_BONE_POS_MAX);
                }
            }
            // Random musscle strength
            for (var i = 0; i < this.muscles.length; ++i) {
                if (utilMath.randomChance(Consts.MUTATION_MUSCLE_STRENGTH_CHANCE)) {
                    var diff = this.muscles[i].strength * (Consts.MUTATION_RELATIVE_STRENGTH_DIFF / 2) * Math.random();
                    diff *= (utilMath.randomChance(0.5) ? -1 : 1);
                    var newStrength = this.muscles[i].strength + diff;
                    newStrength = Math.max(newStrength, 0);
                    this.muscles[i].strength = newStrength;
                }
            }
            // Random muscle min len
            for (var i = 0; i < this.muscles.length; ++i) {
                if (utilMath.randomChance(Consts.MUTATION_MUSCLE_MIN_LEN_CHANCE)) {
                    var diff = this.muscles[i].minLength * (Consts.MUTATION_MUSCLE_REALTIVE_LEN_DIFF / 2) * Math.random();
                    diff *= (utilMath.randomChance(0.5) ? -1 : 1);
                    var newMinLen = this.muscles[i].minLength + diff;
                    newMinLen = Math.max(newMinLen, 0);
                    this.muscles[i].minLength = newMinLen;
                    if (this.muscles[i].minLength > this.muscles[i].maxLength) {
                        _b = [this.muscles[i].maxLength, this.muscles[i].minLength], this.muscles[i].minLength = _b[0], this.muscles[i].maxLength = _b[1];
                    }
                }
            }
            // Random muscle max len
            for (var i = 0; i < this.muscles.length; ++i) {
                if (utilMath.randomChance(Consts.MUTATION_MUSCLE_MAX_LEN_CHANGE)) {
                    var diff = this.muscles[i].maxLength * (Consts.MUTATION_MUSCLE_REALTIVE_LEN_DIFF / 2) * Math.random();
                    diff *= (utilMath.randomChance(0.5) ? -1 : 1);
                    var newMaxLen = this.muscles[i].maxLength + diff;
                    newMaxLen = Math.max(0, newMaxLen);
                    this.muscles[i].maxLength = newMaxLen;
                    if (this.muscles[i].minLength > this.muscles[i].maxLength) {
                        _c = [this.muscles[i].maxLength, this.muscles[i].minLength], this.muscles[i].minLength = _c[0], this.muscles[i].maxLength = _c[1];
                    }
                }
            }
            return this;
            var _b, _c;
        };
        Creature.prototype.diff = function (creature) {
            if (this.bones.length != creature.bones.length || this.muscles.length != creature.muscles.length) {
                return Infinity;
            }
            var lhs = this.clone();
            var rhs = creature.clone();
            var boneComp = function (lhs, rhs) {
                if (lhs.position.x != rhs.position.x) {
                    return lhs.position.x < rhs.position.x ? -1 : lhs.position.x > rhs.position.x ? 1 : 0;
                }
                else {
                    return lhs.position.y < rhs.position.y ? -1 : lhs.position.y > rhs.position.y ? 1 : 0;
                }
            };
            var muscleComp = function (lhsMuscle, rhsMuscle) {
                var lhsIdx = [lhs.bones.indexOf(lhsMuscle.bone1), lhs.bones.indexOf(lhsMuscle.bone2)];
                var rhsIdx = [rhs.bones.indexOf(rhsMuscle.bone1), rhs.bones.indexOf(rhsMuscle.bone2)];
                if (lhsIdx[0] > lhsIdx[1]) {
                    _a = [lhsIdx[1], lhsIdx[0]], lhsIdx[0] = _a[0], lhsIdx[1] = _a[1];
                }
                if (rhsIdx[0] > rhsIdx[1]) {
                    _b = [rhsIdx[1], rhsIdx[0]], rhsIdx[0] = _b[0], rhsIdx[1] = _b[1];
                }
                if (lhsIdx[0] != rhsIdx[0]) {
                    return lhsIdx[0] < rhsIdx[0] ? -1 : lhsIdx[0] > rhsIdx[0] ? 1 : 0;
                }
                else {
                    return lhsIdx[1] < rhsIdx[1] ? -1 : lhsIdx[1] > rhsIdx[1] ? 1 : 0;
                }
                var _a, _b;
            };
            lhs.bones.sort(boneComp);
            rhs.bones.sort(boneComp);
            lhs.muscles.sort(muscleComp);
            rhs.muscles.sort(muscleComp);
            var boneElasticityDiffAvg = 0;
            var boneFrictionDiffAvg = 0;
            var boneMassDiffAvg = 0;
            var bonePosDiffAvg = 0;
            var boneRadiusDiffAvg = 0;
            var diff = 0;
            var muscleExpFactorAvgDiff = 0;
            var muscleIntervalTimeAvgDiff = 0;
            var muscleMaxLenAvgDiff = 0;
            var muscleMinLenAvgDiff = 0;
            var muscleStrAvgDiff = 0;
            for (var i = 0; i < lhs.bones.length; ++i) {
                var bone1 = lhs.bones[i];
                var bone2 = rhs.bones[i];
                var boneElasticityDiff = Math.abs(bone1.elasticity - bone2.elasticity);
                var boneFrictionDiff = Math.abs(bone1.friction - bone2.friction);
                var boneMassDiff = Math.abs(bone1.mass - bone2.mass);
                var bonePosDiff = new Vec2_10["default"](bone1.position.x, bone1.position.y).distance(new Vec2_10["default"](bone2.position.x, bone2.position.y));
                var boneRadiusDiff = Math.abs(bone1.radius - bone2.radius);
                if (boneElasticityDiff > Consts.CREATUREDIFF_BONE_ELASTICITY_DIFF_THRESHOLD) {
                    diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;
                }
                if (boneFrictionDiff > Consts.CREATUREDIFF_BONE_FRICTION_DIFF_THRESHOLD) {
                    diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;
                }
                if (boneMassDiff > Consts.CREATUREDIFF_BONE_MASS_DIFF_THRESHOLD) {
                    diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;
                }
                if (bonePosDiff > Consts.CREATUREDIFF_BONE_POS_DIFF_THRESHOLD) {
                    diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;
                }
                if (boneRadiusDiff > Consts.CREATUREDIFF_BONE_RADIUS_DIFF_THRESHOLD) {
                    diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;
                }
                boneElasticityDiffAvg += boneElasticityDiff / lhs.bones.length;
                boneFrictionDiffAvg += boneFrictionDiff / lhs.bones.length;
                boneMassDiffAvg += boneMassDiff / lhs.bones.length;
                bonePosDiffAvg += bonePosDiff / lhs.bones.length;
                boneRadiusDiffAvg += boneRadiusDiff / lhs.bones.length;
            }
            for (var i = 0; i < lhs.muscles.length; ++i) {
                var muscle1 = lhs.muscles[i];
                var muscle2 = rhs.muscles[i];
                var muscle1Idx = [lhs.bones.indexOf(muscle1.bone1), lhs.bones.indexOf(muscle1.bone2)];
                var muscle2Idx = [rhs.bones.indexOf(muscle2.bone1), rhs.bones.indexOf(muscle2.bone2)];
                if (muscle1Idx[0] > muscle1Idx[1]) {
                    _a = [muscle1Idx[1], muscle1Idx[0]], muscle1Idx[0] = _a[0], muscle1Idx[1] = _a[1];
                }
                if (muscle2Idx[0] > muscle2Idx[1]) {
                    _b = [muscle2Idx[1], muscle2Idx[0]], muscle2Idx[0] = _b[0], muscle2Idx[1] = _b[1];
                }
                if (muscle1Idx[0] != muscle2Idx[0] || muscle1Idx[1] != muscle2Idx[1]) {
                    diff += Consts.CREATUREDIFF_MUSCLE_BONES_DIFF_POINTS;
                    continue;
                }
                var muscleExpFactorDiff = Math.abs(muscle1.expandFactor - muscle2.expandFactor);
                var muscleIntervalTimeDiff = Math.abs(muscle1.timerInterval - muscle2.timerInterval);
                var muscleMaxLenDiff = Math.abs(muscle1.maxLength - muscle2.maxLength);
                var muscleMinLenDiff = Math.abs(muscle1.minLength - muscle2.minLength);
                var muscleStrDiff = Math.abs(muscle1.strength - muscle2.strength);
                if (muscleExpFactorDiff > Consts.CREATUREDIFF_MUSCLE_EXP_FACTOR_DIFF_THRESHOLD) {
                    diff += muscleExpFactorDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
                }
                if (muscleIntervalTimeDiff > Consts.CREATUREDIFF_MUSCLE_INTERVAL_TIME_DIFF_THRESHOLD) {
                    diff += muscleIntervalTimeDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
                }
                if (muscleMaxLenDiff > Consts.CREATUREDIFF_MUSCLE_MAX_LEN_DIFF_THRESHOLD) {
                    diff += muscleMaxLenDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
                }
                if (muscleMinLenDiff > Consts.CREATUREDIFF_MUSCLE_MIN_LEN_DIFF_THRESHOLD) {
                    diff += muscleMinLenDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
                }
                if (muscleStrDiff > Consts.CREATUREDIFF_MUSCLE_STR_DIFF_THRESHOLD) {
                    diff += muscleStrDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
                }
                muscleExpFactorAvgDiff += muscleExpFactorDiff / lhs.muscles.length;
                muscleIntervalTimeAvgDiff += muscleIntervalTimeDiff / lhs.muscles.length;
                muscleMaxLenAvgDiff += muscleMaxLenDiff / lhs.muscles.length;
                muscleMinLenAvgDiff += muscleMinLenDiff / lhs.muscles.length;
                muscleStrAvgDiff += muscleStrDiff / lhs.muscles.length;
            }
            if (boneElasticityDiffAvg > Consts.CREATUREDIFF_BONE_ELASTICITY_AVG_DIFF_THRESHOLD) {
                diff += boneElasticityDiffAvg /*Consts.CREATUREDIFF_BONE_DIFF_POINTS*/;
            }
            if (boneFrictionDiffAvg > Consts.CREATUREDIFF_BONE_FRICTION_AVG_DIFF_THRESHOLD) {
                diff += boneFrictionDiffAvg /*Consts.CREATUREDIFF_BONE_DIFF_POINTS*/;
            }
            if (boneMassDiffAvg > Consts.CREATUREDIFF_BONE_MASS_AVG_DIFF_THRESHOLD) {
                diff += boneMassDiffAvg /*Consts.CREATUREDIFF_BONE_DIFF_POINTS*/;
            }
            if (bonePosDiffAvg > Consts.CREATUREDIFF_BONE_POS_AVG_DIFF_THRESHOLD) {
                diff += bonePosDiffAvg /*Consts.CREATUREDIFF_BONE_DIFF_POINTS*/;
            }
            if (boneRadiusDiffAvg > Consts.CREATUREDIFF_BONE_RADIUS_AVG_DIFF_THRESHOLD) {
                diff += boneRadiusDiffAvg /*Consts.CREATUREDIFF_BONE_DIFF_POINTS*/;
            }
            if (muscleExpFactorAvgDiff > Consts.CREATUREDIFF_MUSCLE_EXP_FACTOR_AVG_DIFF_THRESHOLD) {
                diff += muscleExpFactorAvgDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
            }
            if (muscleIntervalTimeAvgDiff > Consts.CREATUREDIFF_MUSCLE_INTERVAL_TIME_AVG_DIFF_THRESHOLD) {
                diff += muscleIntervalTimeAvgDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
            }
            if (muscleMaxLenAvgDiff > Consts.CREATUREDIFF_MUSCLE_MAX_LEN_AVG_DIFF_THRESHOLD) {
                diff += muscleMaxLenAvgDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
            }
            if (muscleMinLenAvgDiff > Consts.CREATUREDIFF_MUSCLE_MIN_LEN_AVG_DIFF_THRESHOLD) {
                diff += muscleMinLenAvgDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
            }
            if (muscleStrAvgDiff > Consts.CREATUREDIFF_MUSCLE_STR_AVG_DIFF_THRESHOLD) {
                diff += muscleStrAvgDiff /*Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS*/;
            }
            // console.log(minusPoints);
            diff *= lhs.bones.length;
            return diff > Consts.CREATUREDIFF_THRESHOLD ? Infinity : diff;
            var _a, _b;
        };
        return Creature;
    }(Entity_2.Entity));
    exports.Creature = Creature;
    var CreatureBone = (function (_super) {
        __extends(CreatureBone, _super);
        function CreatureBone(position, radius, _mass, _elasticity, _friction) {
            if (position === void 0) { position = new Vec2_10["default"](0, 0); }
            if (radius === void 0) { radius = 1; }
            if (_mass === void 0) { _mass = 1; }
            if (_elasticity === void 0) { _elasticity = 0.75; }
            if (_friction === void 0) { _friction = 0; }
            _super.call(this, position, _mass, _elasticity, _friction);
            this.radius = radius;
        }
        CreatureBone.prototype.bounding = function () {
            return new Intersections.Circle(this.position, this.radius); // Circle
        };
        CreatureBone.prototype.render = function (context) {
            var color = bonePseudoGradient.get(this.friction);
            context.fillColor(color).strokeColor(Color_4["default"].Black).lineWidth(4).drawCircle(this.position.x, this.position.y, this.radius, true, false);
        };
        return CreatureBone;
    }(Entity_2.Entity));
    exports.CreatureBone = CreatureBone;
    var CreatureMuscle = (function (_super) {
        __extends(CreatureMuscle, _super);
        function CreatureMuscle(bone1, bone2, minLength, maxLength, strength, timerInterval, expandFactor) {
            if (strength === void 0) { strength = 1; }
            if (timerInterval === void 0) { timerInterval = 0.5; }
            if (expandFactor === void 0) { expandFactor = 0.5; }
            _super.call(this);
            this.bone1 = bone1;
            this.bone2 = bone2;
            this.minLength = minLength;
            this.maxLength = maxLength;
            this.strength = strength;
            this.timerInterval = timerInterval;
            this.expandFactor = expandFactor;
            this.timer = 0;
            this.targetLength = maxLength;
        }
        CreatureMuscle.prototype.movable = function () { return false; };
        CreatureMuscle.prototype.bonesDistance = function () {
            return this.bone1.position.distance(this.bone2.position);
        };
        CreatureMuscle.prototype.affect = function (affectedObjects) {
            var forceDirection = this.bone1.position.sub(this.bone2.position).normal();
            this.bone1.acceleration = this.bone1.acceleration.add(forceDirection.mul(this.strength * (this.targetLength - this.bonesDistance()) / this.bone1.mass));
            this.bone2.acceleration = this.bone2.acceleration.add(forceDirection.mul(this.strength * (this.bonesDistance() - this.targetLength) / this.bone2.mass));
        };
        CreatureMuscle.prototype.render = function (context) {
            context.strokeColor(Color_4["default"].Black).lineWidth(15).drawLine(this.bone1.position.x, this.bone1.position.y, this.bone2.position.x, this.bone2.position.y, false, true);
        };
        CreatureMuscle.prototype.update = function (timeDelta) {
            this.timer += timeDelta;
            this.timer %= this.timerInterval;
            this.targetLength = (this.timer > this.timerInterval * this.expandFactor ? this.minLength : this.maxLength);
        };
        return CreatureMuscle;
    }(Entity_2.Entity));
    exports.CreatureMuscle = CreatureMuscle;
});
define("graphics/browser/WebImage", ["require", "exports"], function (require, exports) {
    "use strict";
    var WebImage = (function () {
        function WebImage(source, onLoad) {
            var _this = this;
            this.source = source;
            this.image = document.createElement("img");
            this._loaded = false;
            this.image.addEventListener("load", function () {
                _this._loaded = true;
                if (onLoad) {
                    onLoad(_this);
                }
            });
            this.image.src = source;
        }
        WebImage.prototype.isLoaded = function () {
            return this._loaded;
        };
        WebImage.prototype.width = function () {
            return this.image.naturalWidth;
        };
        WebImage.prototype.height = function () {
            return this.image.naturalHeight;
        };
        return WebImage;
    }());
    exports.__esModule = true;
    exports["default"] = WebImage;
});
define("graphics/browser/CanvasContext2D", ["require", "exports", "util/Color", "util/Vec2", "util/Font", "util/TransformMatrix", "graphics/Context2D", "graphics/browser/WebImage", "graphics/Gradient"], function (require, exports, Color_5, Vec2_11, Font_2, TransformMatrix_3, Context2D_1, WebImage_1, Gradient_1) {
    "use strict";
    var CanvasContext2D = (function (_super) {
        __extends(CanvasContext2D, _super);
        function CanvasContext2D(ctx) {
            _super.call(this);
            this.ctx = ctx;
            this.currentTransform = new TransformMatrix_3["default"](1, 0, 0, 0, 1, 0);
            this.transformHistory = new Array();
        }
        CanvasContext2D.prototype.width = function () {
            return this.ctx.canvas.width;
        };
        CanvasContext2D.prototype.height = function () {
            return this.ctx.canvas.height;
        };
        CanvasContext2D.prototype.getPixel = function (x, y) {
            var d = this.ctx.getImageData(x, y, 1, 1);
            return new Color_5["default"](d.data[0], d.data[1], d.data[2], d.data[3]);
        };
        CanvasContext2D.prototype.clearRect = function (x, y, width, height) {
            this.ctx.clearRect(x, y, width, height);
            return this;
        };
        CanvasContext2D.prototype.drawRect = function (x, y, width, height, fill, stroke) {
            if (fill) {
                this.ctx.fillRect(x, y, width, height);
            }
            if (stroke) {
                this.ctx.strokeRect(x, y, width, height);
            }
            return this;
        };
        CanvasContext2D.prototype.drawPath = function (fill, stroke) {
            if (fill) {
                this.ctx.fill();
            }
            if (stroke) {
                this.ctx.stroke();
            }
            return this;
        };
        CanvasContext2D.prototype.drawText = function (x, y, text, baseline, fill, stroke) {
            this.ctx.textBaseline = baseline;
            if (fill) {
                this.ctx.fillText(text, x, y);
            }
            if (stroke) {
                this.ctx.strokeText(text, x, y);
            }
            return this;
        };
        CanvasContext2D.prototype.drawImage = function (img, x, y, width, height, sx, sy, sourceWidth, sourceHeight) {
            if (img instanceof WebImage_1["default"]) {
                if (sx && sy && sourceWidth && sourceHeight) {
                    this.ctx.drawImage(img.image, sx, sy, sourceWidth, sourceHeight, x, y, width, height);
                }
                else if (width && height) {
                    this.ctx.drawImage(img.image, x, y, width, height);
                }
                else {
                    this.ctx.drawImage(img.image, x, y);
                }
            }
            else {
                throw "Unsupported image";
            }
            return this;
        };
        CanvasContext2D.prototype.beginPath = function (startX, startY) {
            this.ctx.beginPath();
            if (startX !== undefined && startY !== undefined) {
                this.ctx.moveTo(startX, startY);
            }
            return this;
        };
        CanvasContext2D.prototype.closePath = function () {
            this.ctx.closePath();
            return this;
        };
        CanvasContext2D.prototype.movePath = function (startX, startY) {
            this.ctx.moveTo(startX, startY);
            return this;
        };
        CanvasContext2D.prototype.pathLine = function (endX, endY) {
            this.ctx.lineTo(endX, endY);
            return this;
        };
        CanvasContext2D.prototype.pathBezier = function (cp1X, cp1Y, cp2X, cp2Y, endX, endY) {
            this.ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
            return this;
        };
        CanvasContext2D.prototype.pathQuadratic = function (cpX, cpY, endX, endY) {
            this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            return this;
        };
        CanvasContext2D.prototype.pathArc = function (centerX, centerY, radius, startAngle, endAngle, antiClockwise) {
            if (antiClockwise === void 0) { antiClockwise = false; }
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
            return this;
        };
        CanvasContext2D.prototype.pathArcByControlPoints = function (x1, y1, x2, y2, radius) {
            this.ctx.arcTo(x1, y1, x2, y2, radius);
            return this;
        };
        CanvasContext2D.prototype.lineWidth = function (val) {
            if (val) {
                this.ctx.lineWidth = val;
                return this;
            }
            return this.ctx.lineWidth;
        };
        CanvasContext2D.prototype.lineCap = function (val) {
            if (val) {
                this.ctx.lineCap = val;
                return this;
            }
            return this.ctx.lineCap;
        };
        CanvasContext2D.prototype.lineJoin = function (val) {
            if (val) {
                this.ctx.lineJoin = val;
                return this;
            }
            return this.ctx.lineJoin;
        };
        CanvasContext2D.prototype.fillColor = function (color) {
            if (color) {
                this.ctx.fillStyle = color.toString();
                return this;
            }
            if (typeof this.ctx.fillStyle === "string") {
                return Color_5["default"].fromString(this.ctx.fillStyle);
            }
            return undefined;
        };
        CanvasContext2D.prototype.strokeColor = function (color) {
            if (color) {
                this.ctx.strokeStyle = color.toString();
                return this;
            }
            if (typeof this.ctx.strokeStyle === "string") {
                return Color_5["default"].fromString(this.ctx.strokeStyle);
            }
            return undefined;
        };
        CanvasContext2D.prototype.fillGradient = function (val) {
            this.ctx.fillStyle = this.toCanvasGradient(val);
            return this;
        };
        CanvasContext2D.prototype.strokeGradient = function (val) {
            this.ctx.strokeStyle = this.toCanvasGradient(val);
            return this;
        };
        CanvasContext2D.prototype.toCanvasGradient = function (val) {
            var gradient;
            if (val instanceof Gradient_1.LinearGradient) {
                gradient = this.ctx.createLinearGradient(val.startPoint.x, val.startPoint.y, val.endPoint.x, val.endPoint.y);
            }
            else if (val instanceof Gradient_1.RadialGradient) {
                gradient = this.ctx.createRadialGradient(val.startCenter.x, val.startCenter.y, val.startRadius, val.endCenter.x, val.endCenter.y, val.endRadius);
            }
            else {
                throw "Unsupported gradient type";
            }
            for (var _i = 0, _a = val.stops; _i < _a.length; _i++) {
                var stop = _a[_i];
                gradient.addColorStop(stop.offset, stop.color.toString());
            }
            return gradient;
        };
        CanvasContext2D.prototype.shadowBlur = function (level) {
            if (level) {
                this.ctx.shadowBlur = level;
                return this;
            }
            return this.ctx.shadowBlur;
        };
        CanvasContext2D.prototype.shadowColor = function (color) {
            if (color) {
                this.ctx.shadowColor = color.toString();
                return this;
            }
            return Color_5["default"].fromString(this.ctx.shadowColor);
        };
        CanvasContext2D.prototype.shadowOffset = function (x, y) {
            if (x && y) {
                this.ctx.shadowOffsetX = x;
                this.ctx.shadowOffsetY = y;
                return this;
            }
            return new Vec2_11["default"](this.ctx.shadowOffsetX, this.ctx.shadowOffsetY);
        };
        CanvasContext2D.prototype.font = function (font) {
            if (font) {
                this.ctx.font = font.toString();
                return this;
            }
            return Font_2.Font.fromString(this.ctx.font);
        };
        CanvasContext2D.prototype.alpha = function (val) {
            if (val) {
                this.ctx.globalAlpha = val;
                return this;
            }
            return this.ctx.globalAlpha;
        };
        CanvasContext2D.prototype.onTransformChanged = function () {
            var m = this.currentTransform;
            this.ctx.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
        };
        CanvasContext2D.prototype.transformMatrix = function (val) {
            if (val) {
                this.currentTransform = val.clone();
                this.onTransformChanged();
                return this;
            }
            return this.currentTransform.clone();
        };
        CanvasContext2D.prototype.transform = function (val) {
            this.currentTransform = this.currentTransform.mul(val);
            this.onTransformChanged();
            return this;
        };
        CanvasContext2D.prototype.save = function () {
            this.transformHistory.push(this.currentTransform);
            this.ctx.save();
            return this;
        };
        CanvasContext2D.prototype.restore = function () {
            this.ctx.restore();
            this.transformMatrix(this.transformHistory.pop());
            return this;
        };
        return CanvasContext2D;
    }(Context2D_1.Context2D));
    exports.__esModule = true;
    exports["default"] = CanvasContext2D;
});
define("graphics/InteractiveContext2D", ["require", "exports", "graphics/Context2D", "util/Color"], function (require, exports, Context2D_2, Color_6) {
    "use strict";
    var EventListEntry = (function () {
        function EventListEntry(upper, type, callback) {
            this.upper = upper;
            this.type = type;
            this.callback = callback;
        }
        return EventListEntry;
    }());
    ;
    var InteractiveContext2D = (function (_super) {
        __extends(InteractiveContext2D, _super);
        function InteractiveContext2D(drawCtx, eventCtx) {
            _super.call(this);
            this.drawCtx = drawCtx;
            this.eventCtx = eventCtx;
            this.maxEventIndex = 15 + 15 * 16 + 15 * 256;
            this.eventList = new Array();
            this.topEvent = this.maxEventIndex;
            this.eventCount = 0;
            this.lastMouseOverIndex = this.maxEventIndex;
            this.lastMouseDownIndex = this.maxEventIndex;
            this.topEventHistory = new Array();
            this.updateEventColor();
        }
        InteractiveContext2D.prototype.updateEventColor = function () {
            var col = this.indexToColor(this.topEvent);
            this.eventCtx.fillColor(col).strokeColor(col);
        };
        InteractiveContext2D.prototype.indexToColor = function (index) {
            var r = ((index & 0xF) << 4) + 8;
            var g = (((index >> 4) & 0xF) << 4) + 8;
            var b = (((index >> 8) & 0xF) << 4) + 8;
            return new Color_6["default"](r, g, b);
        };
        InteractiveContext2D.prototype.indexFromColor = function (color) {
            return (color.r >> 4) + ((color.g >> 4) << 4) + ((color.b >> 4) << 8);
        };
        InteractiveContext2D.prototype.bindEvent = function (type, callback) {
            this.eventList[this.eventCount++] = new EventListEntry(this.topEvent, type, callback);
            if (this.eventCount >= this.maxEventIndex) {
                throw "Event index overflow";
            }
            this.topEvent = this.eventCount - 1;
            this.updateEventColor();
            return this;
        };
        InteractiveContext2D.prototype.popEvent = function (count) {
            if (typeof count == "undefined") {
                count = 1;
            }
            for (var i = 0; i < count; i++) {
                this.topEvent = this.eventList[this.topEvent].upper;
                this.updateEventColor();
            }
            return this;
        };
        InteractiveContext2D.prototype.reset = function () {
            this.eventCount = 0;
            this.topEvent = this.maxEventIndex;
            this.topEventHistory = new Array();
            this.drawCtx.reset();
            this.updateEventColor();
            this.eventCtx.resetTransform().drawRect(0, 0, this.width(), this.height(), true, false);
            return this;
        };
        InteractiveContext2D.prototype.callEvent = function (type, x, y, data) {
            var index = this.indexFromColor(this.eventCtx.getPixel(x, y));
            if (type == Context2D_2.EventType.MouseMove) {
                var lastIndex = this.lastMouseOverIndex;
                this.lastMouseOverIndex = index;
                if (lastIndex != index) {
                    this.callEventIndex(Context2D_2.EventType.MouseLeave, lastIndex, data);
                    this.callEventIndex(Context2D_2.EventType.MouseEnter, index, data);
                }
            }
            else if (type == Context2D_2.EventType.MouseUp) {
                if (this.lastMouseDownIndex == index) {
                    this.callEventIndex(Context2D_2.EventType.Click, index, data);
                }
            }
            else if (type == Context2D_2.EventType.MouseDown) {
                this.lastMouseDownIndex = index;
            }
            this.callEventIndex(type, index, data);
            return this;
        };
        InteractiveContext2D.prototype.callEventIndex = function (type, index, data) {
            while (index >= 0 && index < this.eventCount) {
                var cur = this.eventList[index];
                if (cur.type == type) {
                    cur.callback(data);
                }
                index = cur.upper;
            }
        };
        InteractiveContext2D.prototype.width = function () {
            return this.drawCtx.width();
        };
        InteractiveContext2D.prototype.height = function () {
            return this.drawCtx.height();
        };
        InteractiveContext2D.prototype.getPixel = function (x, y) {
            return this.drawCtx.getPixel(x, y);
        };
        InteractiveContext2D.prototype.clearRect = function (x, y, width, height) {
            this.drawCtx.clearRect(x, y, width, height);
            this.eventCtx.drawRect(x, y, width, height, true, false);
            return this;
        };
        InteractiveContext2D.prototype.drawRect = function (x, y, width, height, fill, stroke) {
            this.drawCtx.drawRect(x, y, width, height, fill, stroke);
            this.eventCtx.drawRect(x, y, width, height, fill, stroke);
            return this;
        };
        InteractiveContext2D.prototype.drawPath = function (fill, stroke) {
            this.drawCtx.drawPath(fill, stroke);
            this.eventCtx.drawPath(fill, stroke);
            return this;
        };
        InteractiveContext2D.prototype.drawText = function (x, y, text, baseline, fill, stroke) {
            this.drawCtx.drawText(x, y, text, baseline, fill, stroke);
            this.eventCtx.drawText(x, y, text, baseline, true, false);
            return this;
        };
        InteractiveContext2D.prototype.drawImage = function (img, x, y, width, height, sx, sy, sourceWidth, sourceHeight) {
            this.drawCtx.drawImage(img, x, y, width, height, sx, sy, sourceWidth, sourceHeight);
            if (!width) {
                width = img.width();
            }
            if (!height) {
                height = img.height();
            }
            this.eventCtx.drawRect(x, y, width, height, true, false);
            return this;
        };
        InteractiveContext2D.prototype.beginPath = function (startX, startY) {
            this.drawCtx.beginPath(startX, startY);
            this.eventCtx.beginPath(startX, startY);
            return this;
        };
        InteractiveContext2D.prototype.closePath = function () {
            this.drawCtx.closePath();
            this.eventCtx.closePath();
            return this;
        };
        InteractiveContext2D.prototype.movePath = function (startX, startY) {
            this.drawCtx.movePath(startX, startY);
            this.eventCtx.movePath(startX, startY);
            return this;
        };
        InteractiveContext2D.prototype.pathLine = function (endX, endY) {
            this.drawCtx.pathLine(endX, endY);
            this.eventCtx.pathLine(endX, endY);
            return this;
        };
        InteractiveContext2D.prototype.pathBezier = function (cp1X, cp1Y, cp2X, cp2Y, endX, endY) {
            this.drawCtx.pathBezier(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
            this.eventCtx.pathBezier(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
            return this;
        };
        InteractiveContext2D.prototype.pathQuadratic = function (cpX, cpY, endX, endY) {
            this.drawCtx.pathQuadratic(cpX, cpY, endX, endY);
            this.eventCtx.pathQuadratic(cpX, cpY, endX, endY);
            return this;
        };
        InteractiveContext2D.prototype.pathArc = function (centerX, centerY, radius, startAngle, endAngle, antiClockwise) {
            if (antiClockwise === void 0) { antiClockwise = false; }
            this.drawCtx.pathArc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
            this.eventCtx.pathArc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
            return this;
        };
        InteractiveContext2D.prototype.pathArcByControlPoints = function (x1, y1, x2, y2, radius) {
            this.drawCtx.pathArcByControlPoints(x1, y1, x2, y2, radius);
            this.eventCtx.pathArcByControlPoints(x1, y1, x2, y2, radius);
            return this;
        };
        InteractiveContext2D.prototype.lineWidth = function (val) {
            if (val) {
                this.drawCtx.lineWidth(val);
                this.eventCtx.lineWidth(val);
                return this;
            }
            return this.drawCtx.lineWidth();
        };
        InteractiveContext2D.prototype.lineCap = function (val) {
            if (val) {
                this.drawCtx.lineCap(val);
                this.eventCtx.lineCap(val);
                return this;
            }
            return this.drawCtx.lineCap();
        };
        InteractiveContext2D.prototype.lineJoin = function (val) {
            if (val) {
                this.drawCtx.lineJoin(val);
                this.eventCtx.lineJoin(val);
                return this;
            }
            return this.drawCtx.lineJoin();
        };
        InteractiveContext2D.prototype.fillColor = function (val) {
            if (val) {
                this.drawCtx.fillColor(val);
                return this;
            }
            return this.drawCtx.fillColor();
        };
        InteractiveContext2D.prototype.strokeColor = function (val) {
            if (val) {
                this.drawCtx.strokeColor(val);
                return this;
            }
            return this.drawCtx.strokeColor();
        };
        InteractiveContext2D.prototype.fillGradient = function (val) {
            this.drawCtx.fillGradient(val);
            return this;
        };
        InteractiveContext2D.prototype.strokeGradient = function (val) {
            this.drawCtx.strokeGradient(val);
            return this;
        };
        InteractiveContext2D.prototype.shadowBlur = function (val) {
            if (val) {
                this.drawCtx.shadowBlur(val);
                return this;
            }
            return this.drawCtx.shadowBlur();
        };
        InteractiveContext2D.prototype.shadowColor = function (val) {
            if (val) {
                this.drawCtx.shadowColor(val);
                return this;
            }
            return this.drawCtx.shadowColor();
        };
        InteractiveContext2D.prototype.shadowOffset = function (x, y) {
            if (x && y) {
                this.drawCtx.shadowOffset(x, y);
                return this;
            }
            return this.drawCtx.shadowOffset();
        };
        InteractiveContext2D.prototype.font = function (val) {
            if (val) {
                this.drawCtx.font(val);
                this.eventCtx.font(val);
                return this;
            }
            return this.drawCtx.font();
        };
        InteractiveContext2D.prototype.alpha = function (val) {
            if (val) {
                this.drawCtx.alpha(val);
                return this;
            }
            return this.drawCtx.alpha();
        };
        InteractiveContext2D.prototype.transformMatrix = function (val) {
            if (val) {
                this.drawCtx.transformMatrix(val);
                this.eventCtx.transformMatrix(val);
                return this;
            }
            return this.drawCtx.transformMatrix();
        };
        InteractiveContext2D.prototype.transform = function (val) {
            this.drawCtx.transform(val);
            this.eventCtx.transform(val);
            return this;
        };
        InteractiveContext2D.prototype.save = function () {
            this.topEventHistory.push(this.topEvent);
            this.drawCtx.save();
            this.eventCtx.save();
            return this;
        };
        InteractiveContext2D.prototype.restore = function () {
            this.topEvent = this.topEventHistory.pop();
            this.updateEventColor();
            this.drawCtx.restore();
            this.eventCtx.restore();
            return this;
        };
        return InteractiveContext2D;
    }(Context2D_2.Context2D));
    exports.InteractiveContext2D = InteractiveContext2D;
});
define("graphics/browser/CanvasWindow", ["require", "exports", "graphics/Context2D", "graphics/browser/CanvasContext2D", "graphics/InteractiveContext2D"], function (require, exports, Context2D_3, CanvasContext2D_1, InteractiveContext2D_1) {
    "use strict";
    function makeFullCanvas(wnd, zIndex) {
        if (zIndex === void 0) { zIndex = "10"; }
        var canvas = wnd.document.createElement("canvas");
        wnd.document.body.appendChild(canvas);
        canvas.style.position = "fixed";
        canvas.style.left = "0px";
        canvas.style.top = "0px";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.zIndex = zIndex;
        return canvas;
    }
    var CanvasWindow = (function () {
        function CanvasWindow(hostWindow, resolution) {
            var _this = this;
            if (hostWindow === void 0) { hostWindow = window; }
            if (resolution === void 0) { resolution = 1; }
            this.hostWindow = hostWindow;
            this.resolution = resolution;
            this.canvas = makeFullCanvas(this.hostWindow);
            this.hostWindow.addEventListener("resize", function () { return _this.onResize(); });
            this.onResize();
            this.context = new CanvasContext2D_1["default"](this.canvas.getContext("2d"));
        }
        CanvasWindow.prototype.onResize = function () {
            this.canvas.width = this.hostWindow.innerWidth * this.resolution;
            this.canvas.height = this.hostWindow.innerHeight * this.resolution;
        };
        CanvasWindow.prototype.width = function () { return this.canvas.width; };
        CanvasWindow.prototype.height = function () { return this.canvas.height; };
        return CanvasWindow;
    }());
    exports.CanvasWindow = CanvasWindow;
    var InteractiveCanvasWindow = (function () {
        function InteractiveCanvasWindow(hostWindow, resolution, debugClickmap) {
            var _this = this;
            if (hostWindow === void 0) { hostWindow = window; }
            if (resolution === void 0) { resolution = 1; }
            if (debugClickmap === void 0) { debugClickmap = false; }
            this.hostWindow = hostWindow;
            this.resolution = resolution;
            if (debugClickmap) {
                this.drawCanvas = hostWindow.document.createElement("canvas");
                this.eventCanvas = makeFullCanvas(this.hostWindow, "10");
            }
            else {
                this.eventCanvas = hostWindow.document.createElement("canvas");
                this.drawCanvas = makeFullCanvas(this.hostWindow, "10");
            }
            this.hostWindow.addEventListener("resize", function () { return _this.onResize(); });
            this.hostWindow.addEventListener("mousedown", function (evt) { return _this.onMouseDown(evt); });
            this.hostWindow.addEventListener("mouseup", function (evt) { return _this.onMouseUp(evt); });
            this.hostWindow.addEventListener("mousemove", function (evt) { return _this.onMouseMove(evt); });
            this.onResize();
            this.context = new InteractiveContext2D_1.InteractiveContext2D(new CanvasContext2D_1["default"](this.drawCanvas.getContext("2d")), new CanvasContext2D_1["default"](this.eventCanvas.getContext("2d")));
        }
        InteractiveCanvasWindow.prototype.onResize = function () {
            this.drawCanvas.width = this.eventCanvas.width = this.hostWindow.innerWidth * this.resolution;
            this.drawCanvas.height = this.eventCanvas.height = this.hostWindow.innerHeight * this.resolution;
        };
        InteractiveCanvasWindow.prototype.onMouseDown = function (evt) {
            this.callEvent(Context2D_3.EventType.MouseDown, evt.clientX, evt.clientY, evt);
        };
        InteractiveCanvasWindow.prototype.onMouseUp = function (evt) {
            this.callEvent(Context2D_3.EventType.MouseUp, evt.clientX, evt.clientY, evt);
        };
        InteractiveCanvasWindow.prototype.onMouseMove = function (evt) {
            this.callEvent(Context2D_3.EventType.MouseMove, evt.clientX, evt.clientY, evt);
        };
        InteractiveCanvasWindow.prototype.callEvent = function (type, x, y, data) {
            this.context.callEvent(type, x * this.resolution, y * this.resolution, data);
        };
        InteractiveCanvasWindow.prototype.width = function () { return this.drawCanvas.width; };
        InteractiveCanvasWindow.prototype.height = function () { return this.drawCanvas.height; };
        return InteractiveCanvasWindow;
    }());
    exports.InteractiveCanvasWindow = InteractiveCanvasWindow;
});
define("graphics/Renderer", ["require", "exports", "util/Color", "util/Font", "util/Arrays"], function (require, exports, Color_7, Font_3, Arrays) {
    "use strict";
    var Renderer = (function () {
        function Renderer(context, item, drawFps) {
            if (drawFps === void 0) { drawFps = false; }
            this.context = context;
            this.item = item;
            this.drawFps = drawFps;
            this.fpsCounter = new FpsCounter(10);
        }
        Renderer.prototype.renderLoop = function () {
            this.context.reset();
            if (this.item) {
                this.context.save();
                this.item.render(this.context);
                this.context.restore();
            }
            this.fpsCounter.countTick();
            if (this.drawFps) {
                this.context.fillColor(Color_7["default"].Black).font(new Font_3.Font("Courier New", 14));
                this.context.drawText(5, 5, this.averageFps() + " fps", "hanging", true, false);
            }
            this.start(); // request next frame
        };
        Renderer.prototype.start = function () {
            var _this = this;
            this.frameRequestID = requestAnimationFrame(function () { return _this.renderLoop(); });
        };
        Renderer.prototype.stop = function () {
            cancelAnimationFrame(this.frameRequestID);
        };
        Renderer.prototype.averageFps = function () {
            return this.fpsCounter.fps();
        };
        return Renderer;
    }());
    exports.__esModule = true;
    exports["default"] = Renderer;
    var FpsCounter = (function () {
        function FpsCounter(samples) {
            this.pos = 0;
            this.sum = 0;
            this.lastTime = Date.now();
            this.times = Arrays.fillArray(new Array(samples), 0, samples, 0);
        }
        FpsCounter.prototype.countTick = function () {
            var now = Date.now();
            var diff = now - this.lastTime;
            this.lastTime = now;
            this.sum += diff - this.times[this.pos];
            this.times[this.pos] = diff;
            this.pos = (this.pos + 1) % this.times.length;
        };
        FpsCounter.prototype.fps = function () {
            return Math.round(this.times.length * 1000 / this.sum);
        };
        return FpsCounter;
    }());
});
define("ui/View", ["require", "exports"], function (require, exports) {
    "use strict";
});
define("graphics/gui/Util", ["require", "exports", "util/Vec2"], function (require, exports, Vec2_12) {
    "use strict";
    function alignTranslate(ctx, x, y, width, height) {
        if (width < 0) {
            width += ctx.width();
        }
        if (height < 0) {
            height += ctx.height();
        }
        if (x < 0) {
            x += ctx.width() - width;
        }
        if (y < 0) {
            y += ctx.height() - height;
        }
        ctx.translate(x, y);
        return new Vec2_12["default"](width, height);
    }
    exports.alignTranslate = alignTranslate;
});
define("graphics/gui/Button", ["require", "exports", "graphics/Context2D", "util/Color", "util/Font", "graphics/gui/Util"], function (require, exports, Context2D_4, Color_8, Font_4, GuiUtil) {
    "use strict";
    var Button = (function () {
        function Button(text, callback, x, y, width, height, font, fill, stroke, fillOver, strokeOver, fillDown, strokeDown) {
            if (width === void 0) { width = 100; }
            if (height === void 0) { height = 25; }
            if (font === void 0) { font = new Font_4.Font("Arial", 25); }
            if (fill === void 0) { fill = new Color_8["default"](0x34, 0x98, 0xdb); }
            if (stroke === void 0) { stroke = new Color_8["default"](0x29, 0x80, 0xb9); }
            if (fillOver === void 0) { fillOver = new Color_8["default"](0x3c, 0xa0, 0xe6); }
            if (strokeOver === void 0) { strokeOver = new Color_8["default"](0x29, 0x80, 0xb9); }
            if (fillDown === void 0) { fillDown = new Color_8["default"](0x29, 0x80, 0xb9); }
            if (strokeDown === void 0) { strokeDown = new Color_8["default"](0x34, 0x98, 0xdb); }
            this.text = text;
            this.callback = callback;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.font = font;
            this.fill = fill;
            this.stroke = stroke;
            this.fillOver = fillOver;
            this.strokeOver = strokeOver;
            this.fillDown = fillDown;
            this.strokeDown = strokeDown;
        }
        Button.prototype.render = function (ctx) {
            var _this = this;
            ctx.save();
            if (this.callback) {
                ctx.bindEvent(Context2D_4.EventType.Click, this.callback);
            }
            ctx.bindEvent(Context2D_4.EventType.MouseDown, function () { return _this.down = true; });
            ctx.bindEvent(Context2D_4.EventType.MouseUp, function () { return _this.down = false; });
            ctx.bindEvent(Context2D_4.EventType.MouseEnter, function () { return _this.over = true; });
            ctx.bindEvent(Context2D_4.EventType.MouseLeave, function () { return _this.over = _this.down = false; });
            if (this.down) {
                ctx.fillColor(this.fillDown).strokeColor(this.strokeDown);
            }
            else if (this.over) {
                ctx.fillColor(this.fillOver).strokeColor(this.strokeOver);
            }
            else {
                ctx.fillColor(this.fill).strokeColor(this.stroke);
            }
            var bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);
            ctx.lineWidth(2);
            ctx.drawRect(0, 0, bounds.x, bounds.y, true, true);
            ctx.fillColor(Color_8["default"].White).strokeColor(Color_8["default"].Black).font(this.font);
            ctx.drawText(15, bounds.y / 2, this.text, "middle", true, false);
            ctx.restore();
        };
        return Button;
    }());
    exports.__esModule = true;
    exports["default"] = Button;
});
define("graphics/gui/Text", ["require", "exports", "util/Color", "util/Font", "graphics/gui/Util"], function (require, exports, Color_9, Font_5, GuiUtil) {
    "use strict";
    var Text = (function () {
        function Text(text, x, y, baseline, font, fill, stroke) {
            if (font === void 0) { font = new Font_5.Font("Arial", 30); }
            if (fill === void 0) { fill = Color_9["default"].White; }
            if (stroke === void 0) { stroke = Color_9["default"].Black; }
            this.text = text;
            this.x = x;
            this.y = y;
            this.baseline = baseline;
            this.font = font;
            this.fill = fill;
            this.stroke = stroke;
        }
        Text.prototype.render = function (ctx) {
            ctx.save();
            GuiUtil.alignTranslate(ctx, this.x, this.y, 0, 0);
            ctx.fillColor(this.fill).strokeColor(this.stroke).lineWidth(2).font(this.font);
            ctx.drawText(0, 0, this.text, this.baseline, true, true);
            ctx.restore();
        };
        return Text;
    }());
    exports.__esModule = true;
    exports["default"] = Text;
});
define("ui/SimulationView", ["require", "exports", "graphics/Renderable", "graphics/gui/Button", "graphics/gui/Text", "util/TransformMatrix", "util/Font", "core/Consts", "core/Util"], function (require, exports, Renderable_1, Button_1, Text_1, TransformMatrix_4, Font_6, Consts, CoreUtil) {
    "use strict";
    var SimulationView = (function (_super) {
        __extends(SimulationView, _super);
        function SimulationView(mainView) {
            var _this = this;
            _super.call(this);
            this.mainView = mainView;
            this.goBackBtn = new Button_1["default"]("x", function () { return _this.mainView.show(_this.mainView.populationView); }, -579, -7, 45, 50);
            this.prevCreatureBtn = new Button_1["default"]("<", function () { return _this.prevCreature(); }, -527, -7, 45, 50);
            this.nextCreatureBtn = new Button_1["default"](">", function () { return _this.nextCreature(); }, -475, -7, 45, 50);
            this.skipPopulationBtn = new Button_1["default"]("Next generation", function () { return _this.skipGenerations(1); }, -265, -7, 202, 50);
            this.skip10PopulationsBtn = new Button_1["default"]("Skip 10 generations", function () { return _this.skipGenerations(10); }, -7, -7, 250, 50);
            this.populationTxt = new Text_1["default"]("", 15, -30, "middle", new Font_6.Font("Arial", 30, "normal", Font_6.FontWeight.Bold));
            this.creatureTxt = new Text_1["default"]("", 290, -30, "middle", new Font_6.Font("Arial", 30, "normal", Font_6.FontWeight.Bold));
            this.resultTxt = new Text_1["default"]("", 500, -30, "middle", new Font_6.Font("Arial", 30, "normal", Font_6.FontWeight.Bold));
            this.scene = CoreUtil.creatureScene();
            this.creatureId = 0;
            this.ticks = 0;
            this.speed = 1;
            this.camera = new Renderable_1.RenderTransform(new TransformMatrix_4["default"](), this.scene);
            this.items.push(this.camera);
            this.items.push(this.populationTxt);
            this.items.push(this.creatureTxt);
            this.items.push(this.resultTxt);
            this.items.push(this.skipPopulationBtn);
            this.items.push(this.skip10PopulationsBtn);
            this.items.push(this.goBackBtn);
            this.items.push(this.prevCreatureBtn);
            this.items.push(this.nextCreatureBtn);
            this.creatureClone = this.mainView.population.population[this.creatureId].clone();
            this.scene.addEntity(this.creatureClone);
        }
        SimulationView.prototype.onShow = function () {
            var _this = this;
            this.intervalId = setInterval(function () { return _this.updateNext(); }, 1000 / Consts.SIMULATION_RESOLUTION);
        };
        SimulationView.prototype.onHide = function () {
            clearInterval(this.intervalId);
        };
        SimulationView.prototype.render = function (ctx) {
            var creature = this.creatureClone;
            var trans = TransformMatrix_4["default"].translate(ctx.width() / 2, ctx.height() - 90);
            trans = trans.mul(TransformMatrix_4["default"].scale(0.5, 0.5));
            trans = trans.mul(TransformMatrix_4["default"].translate(-creature.center().x, 0));
            this.camera.transform = trans;
            this.populationTxt.text = "Generation: " + (this.mainView.population.generation + 1);
            this.creatureTxt.text = "Creature: " + (this.creatureId + 1);
            this.resultTxt.text = "Result: " + this.creatureClone.currentResult().toFixed(0);
            _super.prototype.render.call(this, ctx);
        };
        SimulationView.prototype.showCreature = function (id) {
            this.scene.removeEntity(this.creatureClone);
            this.creatureId = id;
            this.ticks = 0;
            this.creatureClone = this.mainView.population.population[this.creatureId].clone();
            this.scene.addEntity(this.creatureClone);
        };
        SimulationView.prototype.nextCreature = function () {
            // if (++this.creatureId >= this.mainView.population.population.length) {
            // 	this.mainView.population.eugenics();
            // 	this.mainView.population.rate();
            // 	this.creatureId = 0;
            // }
            this.showCreature((this.creatureId + 1) % this.mainView.population.population.length);
        };
        SimulationView.prototype.prevCreature = function () {
            var total = this.mainView.population.population.length;
            this.showCreature((total + this.creatureId - 1) % total);
        };
        SimulationView.prototype.updateNext = function () {
            for (var i = 0; i < this.speed; i++) {
                if (this.ticks++ >= Consts.RUN_DURATION * Consts.SIMULATION_RESOLUTION) {
                    this.nextCreature();
                }
                this.scene.update(1 / Consts.SIMULATION_RESOLUTION);
            }
        };
        SimulationView.prototype.skipGenerations = function (amount) {
            for (var i = 0; i < amount; i++) {
                this.mainView.population.eugenics();
                this.mainView.population.rate();
            }
            this.creatureId = -1;
            this.nextCreature();
        };
        return SimulationView;
    }(Renderable_1.RenderGroup));
    exports.__esModule = true;
    exports["default"] = SimulationView;
});
define("graphics/gui/Chart", ["require", "exports", "util/Color", "util/Font", "graphics/gui/Util", "util/Vec2"], function (require, exports, Color_10, Font_7, GuiUtil, Vec2_13) {
    "use strict";
    var Chart = (function () {
        function Chart(
            // public text: string,
            // public callback: () => void,
            x, y, width, height, font, fill, stroke, fillOver, strokeOver, fillDown, strokeDown) {
            if (width === void 0) { width = 200; }
            if (height === void 0) { height = 200; }
            if (font === void 0) { font = new Font_7.Font("Arial", 25); }
            if (fill === void 0) { fill = new Color_10["default"](0xff, 0xff, 0xff); }
            if (stroke === void 0) { stroke = new Color_10["default"](0x00, 0x00, 0x00); }
            if (fillOver === void 0) { fillOver = new Color_10["default"](0x3c, 0xa0, 0xe6); }
            if (strokeOver === void 0) { strokeOver = new Color_10["default"](0x29, 0x80, 0xb9); }
            if (fillDown === void 0) { fillDown = new Color_10["default"](0x29, 0x80, 0xb9); }
            if (strokeDown === void 0) { strokeDown = new Color_10["default"](0x34, 0x98, 0xdb); }
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.font = font;
            this.fill = fill;
            this.stroke = stroke;
            this.fillOver = fillOver;
            this.strokeOver = strokeOver;
            this.fillDown = fillDown;
            this.strokeDown = strokeDown;
            this.minX = 0;
            this.maxX = 1;
            this.minY = -100;
            this.maxY = 100;
            this.points = new Array();
            this.addPoint(0, 0);
            // this.addPoint(1,10);
            // this.addPoint(2,-20);
            // this.addPoint(3,30);
            // this.addPoint(4,50);
        }
        Chart.prototype.addPoint = function (x, y) {
            this.minX = Math.min(this.minX, x);
            this.maxX = Math.max(this.maxX, x + 10);
            this.minY = Math.min(this.minY, y - 10);
            this.maxY = Math.max(this.maxY, y + 100);
            this.points.push(new Vec2_13["default"](x, y));
        };
        Chart.prototype.getRealPointCoords = function (x, y, bounds) {
            (y - this.maxY) * (bounds.y) / (this.maxY - this.minY);
            return new Vec2_13["default"](bounds.y - (x - this.maxX) * (bounds.x) / (this.minX - this.maxX), (y - this.maxY) * (bounds.y) / (this.minY - this.maxY));
        };
        Chart.prototype.drawLine = function (ctx, lhs, rhs, bounds) {
            var pointa = this.getRealPointCoords(lhs.x, lhs.y, bounds);
            var pointb = this.getRealPointCoords(rhs.x, rhs.y, bounds);
            ctx.drawLine(pointa.x, pointa.y, pointb.x, pointb.y, true, true);
        };
        Chart.prototype.render = function (ctx) {
            ctx.save();
            var bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);
            ctx.fillColor(this.fill).strokeColor(this.stroke);
            ctx.lineWidth(2);
            ctx.drawRect(0, 0, bounds.x, bounds.y, true, true);
            //Draw X line
            ctx.fillColor(new Color_10["default"](0xff, 0x00, 0x00)).strokeColor(new Color_10["default"](0xff, 0x00, 0x00));
            this.drawLine(ctx, new Vec2_13["default"](this.minX, 0), new Vec2_13["default"](this.maxX, 0), bounds);
            ctx.fillColor(new Color_10["default"](0x00, 0x00, 0x00)).strokeColor(new Color_10["default"](0x00, 0x00, 0x00));
            var equation = function (x) { return Math.pow(x, (2)); };
            for (var x = 1; x < this.points.length; x += 1) {
                this.drawLine(ctx, this.points[x - 1], this.points[x], bounds);
            }
            ctx.fillColor(Color_10["default"].White).strokeColor(Color_10["default"].Black).font(this.font);
            ctx.restore();
        };
        return Chart;
    }());
    exports.__esModule = true;
    exports["default"] = Chart;
});
define("ui/PopulationView", ["require", "exports", "graphics/Renderable", "graphics/gui/Button", "graphics/gui/Chart", "graphics/gui/Text", "graphics/Context2D", "util/Font", "util/Color", "core/Consts", "core/Util", "graphics/gui/Util"], function (require, exports, Renderable_2, Button_2, Chart_1, Text_2, Context2D_5, Font_8, Color_11, Consts, CoreUtil, GuiUtil) {
    "use strict";
    var PopulationView = (function (_super) {
        __extends(PopulationView, _super);
        function PopulationView(mainView) {
            var _this = this;
            _super.call(this);
            this.mainView = mainView;
            this.loadBtn = new Button_2["default"]("Load", function () { return _this.load(); }, -569, -7, 87, 50);
            this.saveBtn = new Button_2["default"]("Save", function () { return _this.save(); }, -475, -7, 87, 50);
            this.skipPopulationBtn = new Button_2["default"]("Skip generation", function () { return _this.skipGenerations(1); }, -265, -7, 202, 50);
            this.skip10PopulationsBtn = new Button_2["default"]("Skip 10 generations", function () { return _this.skipGenerations(10); }, -7, -7, 250, 50);
            this.bestOfChart = new Chart_1["default"](40, -100);
            this.populationTxt = new Text_2["default"]("", 15, -30, "middle", new Font_8.Font("Arial", 30, "normal", Font_8.FontWeight.Bold));
            this.resultTxt = new Text_2["default"]("", 290, -30, "middle", new Font_8.Font("Arial", 30, "normal", Font_8.FontWeight.Bold));
            this.populationBox = new PopulationBox(mainView.population, 10, 10, -20, -100, 55, function (target) { return _this.onCreatureClick(target); });
            this.bestOfChart.addPoint(this.mainView.population.generation + 1, this.bestCreature().resultWithoutPenalties);
            this.items.push(this.populationBox);
            this.items.push(this.populationTxt);
            this.items.push(this.resultTxt);
            this.items.push(this.bestOfChart);
            // this.items.push(this.loadBtn);
            // this.items.push(this.saveBtn);
            this.items.push(this.skipPopulationBtn);
            this.items.push(this.skip10PopulationsBtn);
        }
        PopulationView.prototype.onShow = function () { };
        PopulationView.prototype.onHide = function () { };
        PopulationView.prototype.render = function (ctx) {
            this.populationTxt.text = "Generation: " + (this.mainView.population.generation + 1);
            this.resultTxt.text = "Best result: " + this.bestCreature().resultWithoutPenalties.toFixed(0);
            _super.prototype.render.call(this, ctx);
        };
        PopulationView.prototype.bestCreature = function () {
            return this.mainView.population.population[0];
        };
        PopulationView.prototype.skipGenerations = function (amount) {
            var timer = "skipGenerations(" + amount + ")";
            console.time(timer);
            for (var i = 0; i < amount; i++) {
                this.mainView.population.eugenics();
                this.mainView.population.rate();
                this.bestOfChart.addPoint(this.mainView.population.generation + 1, this.bestCreature().resultWithoutPenalties);
            }
            console.timeEnd(timer);
        };
        PopulationView.prototype.onCreatureClick = function (id) {
            this.mainView.simulationView.showCreature(id);
            this.mainView.show(this.mainView.simulationView);
        };
        PopulationView.prototype.load = function () { }; // TODO
        PopulationView.prototype.save = function () { };
        return PopulationView;
    }(Renderable_2.RenderGroup));
    exports.PopulationView = PopulationView;
    var PopulationBox = (function () {
        function PopulationBox(population, x, y, width, height, elemSize, callback) {
            this.population = population;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.elemSize = elemSize;
            this.callback = callback;
            this.creatureOver = null;
            this.creatureClone = null;
            this.scene = null;
        }
        PopulationBox.prototype.render = function (ctx) {
            ctx.save();
            var bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);
            for (var i = 0; i < this.population.population.length; i++) {
                this.renderCreaturePreview(ctx, bounds, i);
            }
            ctx.restore();
        };
        PopulationBox.prototype.renderCreaturePreview = function (ctx, bounds, id) {
            var _this = this;
            var boxSize = this.elemSize;
            var boxGap = 4;
            var creature = this.population.population[id];
            var mouseOver = (creature == this.creatureOver);
            if (mouseOver) {
                this.scene.update(1 / Consts.SIMULATION_RESOLUTION);
                this.creatureClone.result = creature.result;
                creature = this.creatureClone;
            }
            ctx.save();
            // Bind events
            if (this.callback) {
                ctx.bindEvent(Context2D_5.EventType.Click, function () { return _this.callback(id); });
            }
            ctx.bindEvent(Context2D_5.EventType.MouseEnter, function () {
                _this.creatureOver = creature;
                _this.creatureClone = creature.clone();
                _this.scene = CoreUtil.creatureScene(_this.creatureClone);
            });
            ctx.bindEvent(Context2D_5.EventType.MouseLeave, function () {
                _this.creatureOver = _this.creatureClone = _this.scene = null;
            });
            // Calculate position and draw box
            var columnCount = Math.floor((bounds.x - boxGap) / (boxSize + boxGap));
            var column = id % columnCount;
            var row = Math.floor(id / columnCount);
            var offsetX = (bounds.x - (columnCount * (boxSize + boxGap) - boxGap)) / 2;
            var x = (boxSize + boxGap) * column + offsetX;
            var y = (boxSize + boxGap) * row;
            ctx.translate(x, y).strokeColor(Color_11["default"].Black).lineWidth(1);
            ctx.fillColor(mouseOver ? new Color_11["default"](206, 229, 253) : new Color_11["default"](228, 241, 254));
            ctx.drawRect(0, 0, boxSize, boxSize, true, true);
            // Draw rescaled creature
            var creatureBounds = creature.extremes();
            var scaleX = (boxSize - 10) / (creatureBounds.max.x - creatureBounds.min.x);
            var scaleY = (boxSize - 22) / (creatureBounds.max.y - creatureBounds.min.y);
            var scale = Math.min(scaleX, scaleY);
            var avgX = (creatureBounds.min.x + creatureBounds.max.x) / 2;
            var minY = creatureBounds.min.y;
            ctx.save();
            ctx.translate(boxSize / 2, boxSize - 15).scale(scale, -scale).translate(-avgX, -minY);
            creature.render(ctx);
            ctx.restore();
            // Draw fitness value
            var fitness = creature.result.toFixed(0);
            ctx.font(new Font_8.Font("Arial", 10));
            ctx.fillColor(mouseOver ? new Color_11["default"](70, 70, 70) : new Color_11["default"](100, 100, 100));
            ctx.drawRect(0, boxSize - 11, boxSize, 11, true, false);
            ctx.fillColor(Color_11["default"].White).drawText(2, boxSize - 5, fitness, "middle", true, false);
            ctx.restore();
        };
        return PopulationBox;
    }());
    exports.PopulationBox = PopulationBox;
});
define("ui/MainView", ["require", "exports", "core/Population", "core/Consts", "ui/SimulationView", "ui/PopulationView"], function (require, exports, Population_1, Consts, SimulationView_1, PopulationView_1) {
    "use strict";
    var MainView = (function () {
        function MainView() {
            this.population = new Population_1["default"](Consts.POPULATION_SIZE);
            this.population.rate();
            this.populationView = new PopulationView_1.PopulationView(this);
            this.simulationView = new SimulationView_1["default"](this);
            this.currentView = this.populationView;
        }
        MainView.prototype.render = function (ctx) {
            this.currentView.render(ctx);
        };
        MainView.prototype.show = function (view) {
            this.currentView.onHide();
            this.currentView = view;
            this.currentView.onShow();
        };
        MainView.prototype.onShow = function () {
            this.currentView.onShow();
        };
        MainView.prototype.onHide = function () {
            this.currentView.onHide();
        };
        return MainView;
    }());
    exports.__esModule = true;
    exports["default"] = MainView;
});
define("platform/browser/app", ["require", "exports", "graphics/browser/CanvasWindow", "graphics/Renderer", "graphics/browser/WebImage", "ui/MainView", "core/Util"], function (require, exports, CanvasWindow_1, Renderer_1, WebImage_2, MainView_1, CoreUtil) {
    "use strict";
    CoreUtil.setResources(new WebImage_2["default"]("sky.png"), new WebImage_2["default"]("ground.jpg"));
    exports.mainView = new MainView_1["default"]();
    exports.view = new CanvasWindow_1.InteractiveCanvasWindow(window, 1);
    exports.renderer = new Renderer_1["default"](exports.view.context, exports.mainView, false);
    exports.renderer.start();
});
//# sourceMappingURL=app.js.map