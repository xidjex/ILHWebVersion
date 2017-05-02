
var canvas = document.getElementById("field-canvas");
var ctx = canvas.getContext("2d");

canvas.addEventListener("click", clickListener);
canvas.addEventListener("mousemove", moveEventListener);
canvas.addEventListener("contextmenu", testing);

dot = new Image();
dot.src = "dot.png";
dot.addEventListener("load", function(e) {
	console.log(dot);
})
var isGetColor = false;
function print(arr, size) {
	ctx.fillStyle = "#FFF";
	ctx.fillRect(0, 0, 400, 600);
	for(var i = 0; i <= arr.length - 1; i++) {
		for(var j = 0; j <= arr[i].length - 1; j++) {
			ctx.fillStyle = arr[i][j]["color"];
			ctx.fillRect(j * size, i * size, size, size);
			ctx.drawImage(dot, j  * size, i * size, size, size);
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
	
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
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

var Palette = function(width, height, colorsRGB) { //Конструктор палитры цветов
	var that = this;
	var palette = new Array(); //Переменная с палитрой
	this.lastColor = null; //Зачение последнего измененного цвета
	this.lastIndex = null; //Индекс последнего измененного цвета
	this.lastX = null; //Координата Х последнего измененного цвета
	this.lastY = null; //Координата У последнего измененного цвета

	var colorGrade = function(startValue, intensity,  type, fieldWidth, fieldHeight, incrementI, incrementJ) { // Создание градиента цвета
		var variableValue = 0;
		switch (type){
			case "diagonalUpLeft":
				variableValue = (incrementI + incrementJ) / 2;
				break;
			case "diagonalUpRight":
				variableValue = (incrementI + (fieldWidth - 1 - incrementJ)) / 2;
				break;
			case "diagonalDownLeft":
				variableValue = ((fieldHeight - 1 - incrementI) + incrementJ) / 2;
				break;
			case "diagonalDownRight":
				variableValue = ((fieldHeight - 1 - incrementI) + (fieldWidth - 1 - incrementJ)) / 2;
				break;
			case "upDown":
				variableValue = incrementI;
				break;
			case "downUp":
				variableValue = fieldHeight - 1 - incrementI;
				break;
			case "leftRight":
				variableValue = incrementJ;
				break;
			case "rightLeft":
				variableValue = fieldWidth - 1 - incrementJ;
				break;
			default:
				variableValue = (incrementI + incrementJ) / 2;
		}
		return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * variableValue)))));
	}.bind(this);
	
	this.setColor = function(x, y, color, index, draggable) {
		that.lastX = x;
		that.lastY = y;
		that.lastColor = palette[y][x]["color"];
		that.lastIndex = palette[y][x]["index"];

		palette[y][x]["color"] = color;
		palette[y][x]["index"] = index;
	};
	this.setNum = function(x, y, num) {
		that.lastIndex = palette[y][x]["index"];

		palette[y][x]["index"] = num;
	};
	this.getColor= function(x, y) {
		return palette[y][x]["color"];
	};
	this.getNum = function(x, y) {
		return palette[y][x]["index"];
	};
	this.isDraggable = function(x, y) {
		return palette[y][x]["draggable"];
	};
	this.setDraggable = function(x, y, bool) {
		if (bool === undefined) bool = true;
		palette[y][x]["draggable"] = bool;
	};
	this.getPalette = function() {
		return palette;
	};
	
	var cellId = 1;
	for(var i = 0; i <= height - 1; i++) {
		palette[i] = new Array();
		for(var j = 0; j <= width - 1; j++) {
			palette[i][j] = new Array();
			palette[i][j]["draggable"] = true;
			that.setColor(j, i, "rgb(" + colorGrade(colorsRGB[0]["value"], colorsRGB[0]["intensity"], colorsRGB[0]["gradeType"], width, height, i, j) + "," + colorGrade(colorsRGB[1]["value"], colorsRGB[1]["intensity"], colorsRGB[1]["gradeType"], width, height, i, j) + ", " + colorGrade(colorsRGB[2]["value"], colorsRGB[2]["intensity"], colorsRGB[2]["gradeType"], width, height, i, j) + ")", cellId++);
		}
	}
	
};

var types = ["diagonalUpLeft", "diagonalUpRight", "diagonalDownLeft", "diagonalDownRight", "leftRight", "rightLeft"];

var color = [
	{
		value: Math.round(Math.random() * 255),
		intensity: Math.round(Math.random() * 3),
		gradeType: types[Math.round(Math.random() * (types.length - 1))]
	},
	{
		value: Math.round(Math.random() * 255),
		intensity: Math.round(Math.random() * 3),
		gradeType: types[Math.round(Math.random() * (types.length - 1))]
	},
	{
		value: Math.round(Math.random() * 255),
		intensity: Math.round(Math.random() * 3),
		gradeType: types[Math.round(Math.random() * (types.length - 1))]
	}
]
pal = new Palette(8, 10, color);

print(pal.getPalette(), 35);

function clickListener(e) {
	arr = getPositionOnArr(e.layerX, e.layerY, 35);
	if(!isGetColor) {
		pal.setColor(arr.x, arr.y, "rgb(255, 255, 255)", -1);
		print(pal.getPalette(), 35);
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

		for(var i = 0; i <= pal.getPalette().length - 2; i++) {
			for(var j = 0; j <= pal.getPalette()[i].length - 2; j++) {
				if((pal.getNum(j, i) + 1) == pal.getNum(j + 1, i) && (pal.getNum(j, i) + pal.getPalette()[i].length) == pal.getNum(j, i + 1)) {
					continue;
				} else {
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
	print(pal.getPalette(), 35);
	if(isGetColor) {
		createSquare(pal.lastColor, e.layerX - 20, e.layerY - 20, 40, 40);
	}
}

function testing(e) {
	e.preventDefault();
	e.stopPropagation();
	arr = getPositionOnArr(e.layerX, e.layerY, 35);
	$("#next-block").css("background-color", pal.getColor(arr.x, arr.y));
}

var arr_type = {red: "diagonaUpRight", green: "diagonalUpLeft", blue: "downUp"};
var arr2 = {red: 100, green: 100, blue: 100, iRed: 2, iGreen: 2, iBlue: 0};
$(".type-select").on("change", function() {
	arr_type[$(this).attr("data-color")] = $(this).val();
	pal = new Palette();
	pal.create(8, 8, {value: arr2.red, intensity: arr2.iRed, type: arr_type.red}, {value: arr2.green, intensity: arr2.iGreen, type: arr_type.green}, {value: arr2.blue, intensity: arr2.iBlue, type: arr_type.blue});
	print(pal.getPalette(), 35);
});

$("input[type=range").on("change", function(e) {
	arr2["red"] =  Math.round(255 * parseFloat($("#red").val()));
	arr2["green"] = Math.round(255 * parseFloat($("#green").val()));
	arr2["blue"] = Math.round(255 * parseFloat($("#blue").val()));
	arr2["iRed"] = parseFloat($("#intensity-red").val());
	arr2["iGreen"] = parseFloat($("#intensity-green").val());
	arr2["iBlue"] = parseFloat($("#intensity-blue").val());
	pal = new Palette();
	pal.create(8, 8, {value: arr2.red, intensity: arr2.iRed, type: arr_type.red}, {value: arr2.green, intensity: arr2.iGreen, type: arr_type.green}, {value: arr2.blue, intensity: arr2.iBlue, type: arr_type.blue});
	print(pal.getPalette(), 35);

})
