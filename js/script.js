var canvas = document.getElementById("field-canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

canvas.addEventListener("click", clickListener);
canvas.addEventListener("mousemove", moveEventListener);
canvas.addEventListener("contextmenu", rightButton);

dot = new Image();
dot.src = "dot.png";
dot.addEventListener("load", function(e) {
});
var isGetColor = false;

function createSquare(color, x, y, width, height) { //Отрисовка квадрата выбранного цвета
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 8;
	ctx.shadowColor = "rgba(0, 0, 0, 0.6)";

	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
	
	ctx.shadowOffsetX = 0;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 0;
	
};

Array.prototype.shuffle = function() { // Перемешивание массива палитры (удалить)
    for (var i = this.length - 2; i > 1; i--) {
        var num = Math.floor(Math.random() * (i + 1));
        var d = this[num];
        this[num] = this[i];
        this[i] = d;
    }
    return this;
};

var Palette = function() { //Конструктор палитры цветов
	var that = this;
	var palette = null; //Переменная с палитрой
	this.lastColor = null; //Зачение последнего измененного цвета
	this.lastIndex = null; //Индекс последнего измененного цвета
	this.lastX = null; //Координата Х последнего измененного цвета
	this.lastY = null; //Координата У последнего измененного цвета
	this.width = null; // Ширина Палитры
	this.height = null; // Высота палитры
	this.cellWidth = null; // Ширина одной ячейки
	this.cellHeight = null; // Высота одной ячейки
	
	var colorShade = { // Создание градиента цвета
		diagonalUpLeft: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * ((incrementI + incrementJ) / 2))))));
		},
		diagonalUpRight: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * ((incrementI + (fieldWidth - 1 - incrementJ)) / 2))))));
		},
		diagonalDownLeft: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * (((fieldHeight - 1 - incrementI) + incrementJ) / 2))))));
		},
		diagonalDownRight: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * (((fieldHeight - 1 - incrementI) + (fieldWidth - 1 - incrementJ)) / 2))))));
		},
		upDown: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * incrementI)))));
		},
		downUp: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * (fieldHeight - 1 - incrementI))))));
		},
		leftRight: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * (incrementJ))))));
		},
		rightLeft: function(startValue, intensity, fieldWidth, fieldHeight, incrementI, incrementJ) {
			return (startValue - (Math.round(startValue * (((1 / ((fieldWidth + fieldHeight) / intensity)) * (fieldWidth - 1 - incrementJ))))));
		}
	};
	this.create = function(width, height, colorsRGB) { // Создае массив цветовой палитры по входящим параметрам
		
		/*
		[colorRGB][red][green][blue]:
		value: Значение цвета 0 - 255
		intensity: Интенсивность цвета на палитре 0(max) - 3(min)
		shadeType: тип градиента
		*/
		
		palette = {};
		
		
		that.width = width;
		that.height = height;
		that.cellWidth = canvasWidth / that.width;
		that.cellHeight = canvasHeight / that.height;
		var cellId = 1;
		for(var i = 0; i <= height - 1; i++) {
			palette[i] = {};
			for(var j = 0; j <= width - 1; j++) {
				palette[i][j] = {};
				palette[i][j].draggable = true;
				that.setColor(j, i, "rgb(" + colorShade[colorsRGB.red["shadeType"]](colorsRGB.red["value"], colorsRGB.red["intensity"],  width, height, i, j) + "," + colorShade[colorsRGB.green["shadeType"]](colorsRGB.green["value"], colorsRGB.green["intensity"], width, height, i, j) + ", " + colorShade[colorsRGB.blue["shadeType"]](colorsRGB.blue["value"], colorsRGB.blue["intensity"], width, height, i, j) + ")", cellId++);
			}
		}
		return palette;
	};
	this.open = function(obj) { // Загрузка палитры с обьекта
		if(typeof obj ==  "object") {
			palette = obj;
			that.width = Object.keys(palette[0]).length;
			that.height = Object.keys(palette).length;
			that.cellWidth = canvasWidth / that.width;
			that.cellHeight = canvasHeight / that.height;
		} else {
			console.error("Invalid data!");
		} 
	};
	this.getShadesType = function() {
			return Object.keys(colorShade);
		};
	this.setColor = function(x, y, color, index, draggable) { // Устанавливает цвет в ячейке x, y
		that.lastX = x;
		that.lastY = y;
		that.lastColor = palette[y][x].color;
		that.lastIndex = palette[y][x].index;

		palette[y][x].color = color;
		palette[y][x].index = index;
	};
	this.getColor= function(x, y) { // Получаем цвет по координатамв массиве
		return palette[y][x].color;
	};
	this.getNum = function(x, y) {// Получаем индекс по координатамв массиве
		return palette[y][x].index;
	};
	this.isDraggable = function(x, y) { // Можно ли перемещать ячейку
		return palette[y][x].draggable;
	};
	this.setDraggable = function(x, y, bool) { // Установить правило для ячейки (перещаемая или нет)
		if (bool === undefined) bool = true;
		palette[y][x].draggable = bool;
	};
	this.getPalette = function() {
		return palette;
	};
};

var Level = function() {
	var that = this;
	this.palette = null;
	this.openedLevel = null;
	this.i = 0;
	this.j = 0;
	
	this.open = function(levelObject) {
		that.palette = new Palette();
		that.palette.open(levelObject["palette"]);
		that.openedLevel = levelObject["number"];
	};
	this.create = function() {
		
	};
	this.render = function(context) {
		if(that.palette != null) {
			context.clearRect(0, 0, canvasWidth, canvasHeight);
			for(var i = 0; i <= that.palette.height - 1; i++) {
				for(var j = 0; j <= that.palette.width - 1; j++) {
					that.i = i;
					that.j = j;
					/*context.fillStyle = that.palette.getColor(j, i);
					context.fillRect(j * that.palette.cellWidth, i * that.palette.cellHeight, that.palette.cellWidth, that.palette.cellHeight);*/
					
					animate({
						duration: 1000,
						timing: quad,
						draw: animateCell,
						i: i,
						j: j
					}, that);
					
					if(!that.palette.isDraggable(j, i)) {
						context.drawImage(dot, j  * that.palette.cellWidth + (that.palette.cellWidth - dot.width) / 2, i * that.palette.cellHeight + (that.palette.cellHeight - dot.height) / 2);
					}					
				}
			}
		} else {
			console.error("Palette not init!");
		}
	};
	this.getPositionOnPalette = function (x, y) { //Находит координаты ячейки в массиве палитры по координатам курсора
		resultX = Math.floor(x / that.palette.cellWidth);
		resultY = Math.floor(y / that.palette.cellHeight);
		
		return {x: resultX, y: resultY};
	};
};

var LevelsLoader = function() {
	var loadedLevels = {},
		callback = null,
		lvlNumbers = null;
	
	this.load = function(levels, callbackFunc) {
		lvlNumbers = levels;
		callback = callbackFunc;
		XHRequest();
	};
	this.getLevel = function(number) {
		if(loadedLevels[number]) return loadedLevels[number];
		else return false;
	};
	this.getLoadedLevels = function() {
		return Object.keys(loadedLevels);
	};
	var XHRequest = function() {
		if(lvlNumbers.length > 0) {
			var l = lvlNumbers.pop(); 
		} else {
			callback.call(null, loadedLevels);
			return;
		}
		var request = new XMLHttpRequest();
			request.open("GET", "levels/lvl" + l + ".json" , true);
			request.send();
			request.onreadystatechange = function() {
				if(request.readyState !== 4) return;
					if(request.status != 200) {
						console.error(request.status + ": " + request.statusText);
					} else {
						loadedLevels[l] = JSON.parse(request.responseText);
						XHRequest.call(null);
					}
			};
	}.bind(this);
};

var lvlLoader = new LevelsLoader();
var pal = null;
lvlLoader.load([1, 3, 4, 5], callback);
var lvl = new Level();

function callback(data) {
	lvl.open(lvlLoader.getLevel(4));
	//lvl.render(ctx);
	pal = lvl.palette;
	var render = new Render(ctx, lvl);
	render.rederPalette(true);
	
	selectLevels(lvlLoader.getLoadedLevels());
};

function clickListener(e) {
	arr = lvl.getPositionOnPalette(e.offsetX, e.offsetY);
	if(lvl.palette.getPalette()[arr.y][arr.x]["draggable"]) {
		if(!isGetColor) {
			lvl.palette.setColor(arr.x, arr.y, "rgb(0, 0, 0)", -1);
			lvl.render(ctx);
			isGetColor = true;
		}else{
			x = lvl.palette.lastX;
			y = lvl.palette.lastY;
			if (x == arr.x && y == arr.y) {
				lvl.palette.setColor(arr.x, arr.y, lvl.palette.lastColor, lvl.palette.lastIndex);
			}else{
				lvl.palette.setColor(arr.x, arr.y, lvl.palette.lastColor, lvl.palette.lastIndex);
				lvl.palette.setColor(x, y, lvl.palette.lastColor, lvl.palette.lastIndex);
			}

			var trig = true;

			for(var i = 0; i <= Object.keys(lvl.palette.getPalette()).length - 2; i++) {
				for(var j = 0; j <= Object.keys(lvl.palette.getPalette()[i]).length - 2; j++) {
					if((lvl.palette.getNum(j, i) + 1) == lvl.palette.getNum(j + 1, i) && (lvl.palette.getNum(j, i) + Object.keys(lvl.palette.getPalette()[i]).length) == lvl.palette.getNum(j, i + 1)) {
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
};

function moveEventListener(e) {
	//lvl.render(ctx);
	if(isGetColor) {
		createSquare(lvl.palette.lastColor, e.offsetX - (lvl.palette.cellWidth + 5) / 2, e.offsetY - (lvl.palette.cellHeight + 5) / 2, lvl.palette.cellWidth + 5, lvl.palette.cellHeight + 5);
	}
};

var arr_type = {red: "diagonalUpRight", green: "diagonalUpLeft", blue: "downUp"};
var arr2 = {
	red: {
		value: 100,
		intensity: 2,
		shadeType: arr_type.red
	},
	green: {
		value: 100,
		intensity: 2,
		shadeType: arr_type.green
	},
	blue: {
		value: 100,
		intensity: 2,
		shadeType: arr_type.blue
	}
};

var width = 8;
var height = 10;

$(".type-select").on("change", function() {
	arr2[$(this).attr("data-color")].shadeType = $(this).val();
	lvl.palette.create(width, height, arr2);
	lvl.render(ctx);
});

$("input[type=range").on("change", function(e) {
	arr2.red.value =  Math.round(255 * parseFloat($("#red").val()));
	arr2.green.value = Math.round(255 * parseFloat($("#green").val()));
	arr2.blue.value = Math.round(255 * parseFloat($("#blue").val()));
	arr2.red.intensity = parseFloat($("#intensity-red").val());
	arr2.green.intensity = parseFloat($("#intensity-green").val());
	arr2.blue.intensity = parseFloat($("#intensity-blue").val());
	lvl.palette.create(width, height, arr2);
	lvl.render(ctx);

});

function rightButton(event) {
	event.stopPropagation();
	event.preventDefault();
	arr = lvl.getPositionOnPalette(event.offsetX, event.offsetY);
	//lvl.palette.setDraggable(arr.x, arr.y, !lvl.palette.isDraggable(arr.x, arr.y));
	//lvl.render(ctx);
	animate({
		duration: 500,
		timing: circ,
		draw: animateCell,
		i: arr.y,
		j: arr.x
	});
	
	
	
};

function selectLevels(arr) {
	for(var i = 0; i <= arr.length - 1; i++) {
		$("#levels").append("<option value=" + arr[i] + ">" + arr[i] + "</option>");
	}
}

$("#levels").change(function() {
	lvl.open(lvlLoader.getLevel($(this).val()));
	lvl.render(ctx);
});

$("#width, #height").change(function() {
	width = parseInt($("#width").val());
	height = parseInt($("#height").val());
});

$("#print").click(function() {
	$("#txt-field").val(JSON.stringify({number: lvl.openedLevel, palette: lvl.palette.getPalette()}));
});

/*context.fillStyle = that.palette.getColor(j, i);
					context.fillRect(j * that.palette.cellWidth, i * that.palette.cellHeight, that.palette.cellWidth, that.palette.cellHeight);*/

/*var animateCell = function(timing, i, j) {
	var context = ctx, 
		width = this.palette.cellWidth, 
		height = this.palette.cellHeight,
		x = j * this.palette.cellWidth, 
		y = i * this.palette.cellHeight, 
		color = this.palette.getColor(j, i); 
	context.clearRect(x, y, width, height);
	context.fillStyle = color;
	context.fillRect(x + (width - width * timing) / 2, y + (height - height * timing) / 2, width * timing, height * timing);
};*/

var Render = function(canvasContext, level) {
	var that = this;
	this.level = level;
	this.palette = level.palette;
	this.context = canvasContext;
		
	this.rederPalette = function(isPlayAnimation) {
		if(that.palette != null) {
			canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
			for(var i = 0; i <= that.palette.height - 1; i++) {
				for(var j = 0; j <= that.palette.width - 1; j++) {
					if(isPlayAnimation) {
						animate({
						duration: (800 + (Math.round(3000 * (((1 / ((8 + 10))) * ((i + j) / 2)))))),
						timing: quad,
						draw: animateCell,
					}, {
							context: that.context,
							width: that.palette.cellWidth,
							height: that.palette.cellHeight,
							x: j * that.palette.cellWidth,
							y: i * that.palette.cellHeight,
							color: that.palette.getColor(j, i)
						});
					}
					
					if(!that.palette.isDraggable(j, i)) {
						canvasContext.drawImage(dot, j  * that.palette.cellWidth + (that.palette.cellWidth - dot.width) / 2, i * that.palette.cellHeight + (that.palette.cellHeight - dot.height) / 2);
					}					
				}
			}
		} else {
			console.error("Palette not init!");
		}
	};
		
	var animate = function(options, drawOptions) {
	  var start = performance.now();

	  requestAnimationFrame(function animate(time) {
		// timeFraction от 0 до 1
		var timeFraction = (time - start) / options.duration;
		if (timeFraction > 1) timeFraction = 1;

		// текущее состояние анимации
		var progress = options.timing(timeFraction)

		options.draw.call(this, progress, drawOptions);

		if (timeFraction < 1) {
		  requestAnimationFrame(animate);
		}

	  });
	};
	
	var animateCell = function(timing, options) {
		var context = options.context, 
		width = options.width, 
		height = options.height,
		x = options.x, 
		y = options.y, 
		color = options.color;
				
		context.clearRect(x, y, width, height);
		context.fillStyle = color;
		context.fillRect(x + (width - width * timing) / 2, y + (height - height * timing) / 2, width * timing, height * timing);
	};
	
};

function circ(timeFraction) {
  return 1 - timeFraction;
};

function elastic(x, timeFraction) {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.cos(20 * Math.PI * x / 3 * timeFraction)
};

function quad(progress) {
  return Math.pow(progress, 2)
}
