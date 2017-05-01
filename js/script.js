
var canvas = document.getElementById("field-canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", clickListener);
canvas.addEventListener("mousemove", moveEventListener);
canvas.addEventListener("contextmenu", testing);
var isGetColor = false;
function print(arr, size) {
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, 400, 600);
	for(var i = 0; i <= arr.length - 1; i++) {
		for(var j = 0; j <= arr[i].length - 1; j++) {
			ctx.shadowOffsetX = 0;
			ctx.shadowOffsetY = 0;
			ctx.shadowBlur = 0;
			ctx.fillStyle = arr[i][j]["color"];
			ctx.fillRect(j * size, i * size, size, size);
		}
	}
}
function createSquare(color, x, y, width, height) {
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 10;
	ctx.shadowColor = "rgba(0, 0, 0, 0.5)";

	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

Array.prototype.shuffle = function() {
    for (var i = this.length - 2; i > 1; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = this[num];
        this[num] = this[i];
        this[i] = d;
    }
    return this;
}

function arrCopy(arr) {
	var copy = new Array();
	for(var i = 0; i <= arr.length - 1; i++) {
		copy[i] = new Array();
		copy[i] = arr[i].slice(0);
	}

	return copy;
}

function getPositionOnArr(x, y, size) {
	resultX = Math.floor(x / size);
	resultY = Math.floor(y / size);
	return {x: resultX, y: resultY};
}

function Palette() { //Конструктор палитры цветов
	this.palette = new Array(); //Переменная с палитрой
	this.lastColor = null; //Зачение последнего измененного цвета
	this.lastIndex = null; //Индекс последнего измененного цвета
	this.lastX = null; //Координата Х последнего измененного цвета
	this.lastY = null; //Координата У последнего измененного цвета

	var that = this;

	this.create = function(width, height, red, green, blue) { //Создание поалитры на основе ширины, высоты, параметров значения цвета, интенсивность и типа его градиента
		var cellId = 1;
		for(var i = 0; i <= height - 1; i++) {
			that.palette[i] = new Array();
			for(var j = 0; j <= width - 1; j++) {
				that.palette[i][j] = new Array()
				that.palette[i][j]["color"] = "rgb(" + colorGrade(red["value"], red["intensity"], red["type"], width, height, i, j) + "," + colorGrade(green["value"], green["intensity"], green["type"], width, height, i, j) + ", " + colorGrade(blue["value"], blue["intensity"], blue["type"], width, height, i, j) + ")";

				that.palette[i][j]["index"] = cellId++;
			}
		}
	};

	function test11(){
		this.test0 = function(x, y) {
			return x + y;
		};
		this.test1 = function(x, y) {
			return x - y;
		}
	}
var test2 = new test11();
	console.log(new test11()["test0"](1,1));

	var colorGrade = function(startValue, intensity,  type, fieldWidth, fieldHeight, incrementI, incrementJ) { // Создание градиента цвета
		var x = 0;
		switch (type){
			case "diagonalUpLeft":
				x = (incrementI + incrementJ) / 2;
				break;
			case "diagonalUpRight":
				x = (incrementI + (fieldWidth - 1 - incrementJ)) / 2;
				break;
			case "diagonalDownLeft":
				x = ((fieldHeight - 1 - incrementI) + incrementJ) / 2;
				break;
			case "diagonalDownRight":
				x = ((fieldHeight - 1 - incrementI) + (fieldWidth - 1 - incrementJ)) / 2;
				break;
			case "upDown":
				x = incrementI;
				break;
			case "downUp":
				x = fieldHeight - 1 - incrementI;
				break;
			case "leftRight":
				x = incrementJ;
				break;
			case "rightLeft":
				x = fieldWidth - 1 - incrementJ;
				break;
			default:
				x = (incrementI + incrementJ) / 2;
		}
		return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * x)))));
	}.bind(this);

	// this.shuffle = function(arr) {
	// 	for(var i = 0; i <= that.palette.length - 1; i++) {
	// 		that.palette.shuffle();
	// 		for(var j = 0; j <= that.palette[i].length - 1; j++) {
	// 			that.palette[i].shuffle();
	// 			that.palette.shuffle();
	// 		}
	// 	}
	// };
	this.setColor = function(x, y, color, index) {
		that.lastX = x;
		that.lastY = y;
		that.lastColor = that.palette[y][x]["color"];
		that.lastIndex = that.palette[y][x]["index"];

		that.palette[y][x]["color"] = color;
		that.palette[y][x]["index"] = index;
	};
	this.setNum = function(x, y, num) {
		that.lastIndex = that.palette[y][x]["index"];

		that.palette[y][x]["index"] = num;
	}
	this.getColor= function(x, y) {
		return that.palette[y][x]["color"];
	}
	this.getNum = function(x, y) {
		return that.palette[y][x]["index"];
	}
}

pal = new Palette();

var types = ["diagonalUpLeft", "diagonalUpRight", "diagonalDownLeft", "diagonalDownRight", "leftRight", "rightLeft"];
pal.create2(8, 10, {value: Math.round(Math.random() * 255), intensity: Math.round(Math.random() * 3), type: types[Math.round(Math.random() * (types.length - 1))]}, {value: Math.round(Math.random() * 255), intensity: Math.round(Math.random() * 3), type: types[Math.round(Math.random() * (types.length - 1))]}, {value: Math.round(Math.random() * 255), intensity: Math.round(Math.random() * 3), type: types[Math.round(Math.random() * (types.length - 1))]});

print(pal.palette, 35);

function clickListener(e) {
	arr = getPositionOnArr(e.layerX, e.layerY, 35);
	if(!isGetColor) {
		pal.setColor(arr.x, arr.y, "rgb(255, 255, 255)", -1);
		print(pal.palette, 35);
		isGetColor = true;
	}else{
		x = pal.lastX;
		y = pal.lastY;
		if (x == arr.x && y == arr.y) {
			pal.setColor(arr.x, arr.y, pal.lastColor, pal.lastIndex);
		}else{
			pal.setColor(arr.x, arr.y, pal.lastColor, pal.lastIndex);
			pal.setColor(x, y, pal.lastColor, pal.lastIndex);
		}

		var trig = true;

		for(var i = 0; i <= pal.palette.length - 2; i++) {
			for(var j = 0; j <= pal.palette[i].length - 2; j++) {
				console.log(i + "---" + j);
				if((pal.getNum(j, i) + 1) == pal.getNum(j + 1, i) && (pal.getNum(j, i) + pal.palette[i].length) == pal.getNum(j, i + 1)) {
					continue;
				} else {
					console.log((pal.getNum(j, i) + pal.palette[i].length) + "--" + pal.getNum(j, i + 1));
					trig = false;
					break;
				}
			}
		}

		if(!trig) console.log("Not finish!");
		else alert("Finished!");

		isGetColor = false;
	}
}

function moveEventListener(e) {
	print(pal.palette, 35);
	if(isGetColor) {
		createSquare(pal.lastColor, e.layerX - 20, e.layerY - 20, 35, 35);
	}
}

function testing(e) {
	e.preventDefault();
	e.stopPropagation();
	arr = getPositionOnArr(e.layerX, e.layerY, 35);

	console.log(pal.getColor(arr.x, arr.y) + "----" + pal.getNum(arr.x,arr.y));
	console.log("last num--" + pal.lastIndex);
	$("#next-block").css("background-color", pal.getColor(arr.x, arr.y));
}

var arr_type = {red: "diagonaUpRight", green: "diagonalUpLeft", blue: "downUp"};
var arr2 = {red: 100, green: 100, blue: 100, iRed: 2, iGreen: 2, iBlue: 0};
$(".type-select").on("change", function() {
	arr_type[$(this).attr("data-color")] = $(this).val();
	pal = new Palette();
	pal.create2(8, 8, {value: arr2.red, intensity: arr2.iRed, type: arr_type.red}, {value: arr2.green, intensity: arr2.iGreen, type: arr_type.green}, {value: arr2.blue, intensity: arr2.iBlue, type: arr_type.blue});
	print(pal.palette, 35);
});

$("input[type=range").on("change", function(e) {
	arr2["red"] =  Math.round(255 * parseFloat($("#red").val()));
	arr2["green"] = Math.round(255 * parseFloat($("#green").val()));
	arr2["blue"] = Math.round(255 * parseFloat($("#blue").val()));
	arr2["iRed"] = parseFloat($("#intensity-red").val());
	arr2["iGreen"] = parseFloat($("#intensity-green").val());
	arr2["iBlue"] = parseFloat($("#intensity-blue").val());
	console.log(red + "---" + green + "---" + blue);
	pal = new Palette();
	pal.create2(8, 8, {value: arr2.red, intensity: arr2.iRed, type: arr_type.red}, {value: arr2.green, intensity: arr2.iGreen, type: arr_type.green}, {value: arr2.blue, intensity: arr2.iBlue, type: arr_type.blue});
	print(pal.palette, 35);

})
