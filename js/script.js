var canvas = document.getElementById("field-canvas");
var ctx = canvas.getContext("2d");
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

canvas.addEventListener("mousedown", downClickListener);
canvas.addEventListener("mousemove", moveEventListener);
canvas.addEventListener("mouseup", upClickListener);
canvas.addEventListener("contextmenu", rightButton);

canvas.addEventListener("touchstart", function (e) {
        mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
	var touch = e.changedTouches[0];
  var mouseEvent = new MouseEvent("mouseup", {
	clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousemove", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
  };
}

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
		that.cellWidth = (canvasWidth - (canvasWidth % that.width)) / that.width; 
		that.cellHeight = (canvasHeight - (canvasHeight % that.height)) / that.height;
		var cellId = 1;
		console.log(that.cellWidth);
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
			that.cellWidth = (canvasWidth - (canvasWidth % that.width)) / that.width;
			that.cellHeight = (canvasHeight - (canvasHeight % that.height)) / that.height;
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
	var score = 0,
		moves = 0,
		isTakenCell = false,
		render = null;
	
	this.open = function(levelObject, render) {
		that.palette = new Palette();
		that.palette.open(levelObject["palette"]);
		that.openedLevel = levelObject["number"];
		render = render;
	};
	this.create = function() {
		
	};
	this.getPositionOnPalette = function (x, y) { //Находит координаты ячейки в массиве палитры по координатам курсора
		resultX = Math.floor(x / that.palette.cellWidth);
		resultY = Math.floor(y / that.palette.cellHeight);
		
		return {x: resultX, y: resultY};
	};
	this.checkIsWin = function() {
		var trig = true;
		for(var i = 0; i <= Object.keys(that.palette.getPalette()).length - 2; i++) {
			for(var j = 0; j <= Object.keys(that.palette.getPalette()[i]).length - 2; j++) {
				if((that.palette.getNum(j, i) + 1) == that.palette.getNum(j + 1, i) && (that.palette.getNum(j, i) + Object.keys(that.palette.getPalette()[i]).length) == that.palette.getNum(j, i + 1)) {
					continue;
				} else {
					trig = false;
					break;
				}
			}
		}
		return trig;
	};
	this.getCell = function(x, y) {
		if(that.palette.isDraggable(x, y)) {
			that.palette.setColor(x, y, "#000000", -1);
			render.rederPalette(false);
			isTakenCell = true;
			return that.palette.lastColor;
		} else {
			return false;
		}
	};
	this.placeCell = function(x, y) {
		var lastX = lvl.palette.lastX;
		var lastY = lvl.palette.lastY;
		if (that.palette.lastX == x && that.palette.lastY == y) {
			that.palette.setColor(x, y, that.palette.lastColor, that.palette.lastIndex);
		}
		else if (!that.palette.isDraggable(x, y)) {
			render.renderAnimatedCell(lastX, lastY, circ, 300,  that.palette.lastColor);
			that.palette.setColor(lastX, lastY, that.palette.lastColor, that.palette.lastIndex);
			
		}else{
			that.palette.setColor(x, y, that.palette.lastColor, that.palette.lastIndex);
			render.renderAnimatedCell(lastX, lastY, circ, 300,  that.palette.lastColor);
			that.palette.setColor(lastX, lastY, that.palette.lastColor, that.palette.lastIndex);
		}
		isTakenCell = false;
	};
	this.getIsTakenCell = function() {
		return isTakenCell;
	}
	this.makeMove = function(startX, startY, targetX, targetY) {
		
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
var pal = null,
	render = null;
lvlLoader.load([1, 3, 4, 5], callback);
var lvl = new Level();

function callback(data) {
	lvl.open(lvlLoader.getLevel(4));
	pal = lvl.palette;
	render = new Render(ctx, lvl);
	render.rederPalette(true);
	
	selectLevels(lvlLoader.getLoadedLevels());
};

function downClickListener(e) {
	arr = lvl.getPositionOnPalette(e.offsetX, e.offsetY);
	var color = lvl.getCell(arr.x, arr.y);
	if(color) createSquare(color, e.offsetX - (lvl.palette.cellWidth + 5) / 2, e.offsetY - (lvl.palette.cellHeight + 5) / 2, lvl.palette.cellWidth + 5, lvl.palette.cellHeight + 5);
};

function upClickListener(e) {
	arr = lvl.getPositionOnPalette(e.offsetX, e.offsetY);
	lvl.placeCell(arr.x, arr.y);
	if(lvl.checkIsWin()) {
		//alert("Finished!");
		render.rederPaletteReverse();
	}
	else console.log("Not finish!");
};

function moveEventListener(e) {
	if(lvl.getIsTakenCell()) {
		render.rederPalette(false);
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
	render.updateLevel(lvl);
	render.rederPalette(false);
});

$("input[type=range").on("change", function(e) {
	arr2.red.value =  Math.round(255 * parseFloat($("#red").val()));
	arr2.green.value = Math.round(255 * parseFloat($("#green").val()));
	arr2.blue.value = Math.round(255 * parseFloat($("#blue").val()));
	arr2.red.intensity = parseFloat($("#intensity-red").val());
	arr2.green.intensity = parseFloat($("#intensity-green").val());
	arr2.blue.intensity = parseFloat($("#intensity-blue").val());
	lvl.palette.create(width, height, arr2);
	render.updateLevel(lvl);
	render.rederPalette(false);

});

function rightButton(event) {
	event.stopPropagation();
	event.preventDefault();
	arr = lvl.getPositionOnPalette(event.offsetX, event.offsetY);
	lvl.palette.setDraggable(arr.x, arr.y, !lvl.palette.isDraggable(arr.x, arr.y));
	render.rederPalette(false);
};

function selectLevels(arr) {
	for(var i = 0; i <= arr.length - 1; i++) {
		$("#levels").append("<option value=" + arr[i] + ">" + arr[i] + "</option>");
	}
}

$("#levels").change(function() {
	lvl.open(lvlLoader.getLevel($(this).val()));
	render = new Render(ctx, lvl);
	render.rederPalette(true);
});

$("#width, #height").change(function() {
	width = parseInt($("#width").val());
	height = parseInt($("#height").val());
});

$("#print").click(function() {
	$("#txt-field").val(JSON.stringify({number: lvl.openedLevel, palette: lvl.palette.getPalette()}));
});

var Render = function(canvasContext, level) {
	var that = this;
	this.level = level;
	this.palette = level.palette;
	this.context = canvasContext;
	var cellWidth = that.palette.cellWidth,
		cellHeight = that.palette.cellHeight;
		backgoundColor = $("#body").css("background-color");
	
	var dot = new Image();
	dot.src = "dot.png";
	/*dot.addEventListener("load", function(e) {
	});*/
	this.updateLevel =  function(level) {
		that.level = level;
		that.palette = level.palette;
		cellWidth = that.palette.cellWidth;
		cellHeight = that.palette.cellHeight;
	};
	this.rederPalette = function(isPlayAnimation) {
		if(that.palette != null) {
			canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
			for(var i = 0; i <= that.palette.height - 1; i++) {
				for(var j = 0; j <= that.palette.width - 1; j++) {
					
					var x = j * cellWidth,
						y = i * cellHeight,
						color = that.palette.getColor(j, i),
						isDraggable = that.palette.isDraggable(j, i);
					
					if(isPlayAnimation) {
						this.renderAnimatedCell(j, i, linear, (800 + (Math.round(3000 * (((1 / ((8 + 10))) * ((i + j) / 2)))))));
					} else {
						drawCell(that.context, x, y, cellWidth, cellHeight, color);
						if(!isDraggable) drawDot(that.context, x, y, cellWidth, cellHeight);
					}	
				}
			}
		} else {
			console.error("Palette not init!");
		}
	};
	this.rederPaletteReverse = function() {
		if(that.palette != null) {
			canvasContext.fillStyle = backgoundColor;
			canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
			for(var i = that.palette.height - 1; i >= 0; i--) {
				for(var j = that.palette.width - 1; j >= 0; j--) {
					
					var x = j * cellWidth,
						y = i * cellHeight,
						color = that.palette.getColor(j, i);
						this.renderAnimatedCellReverse(j, i, linear, (800 + (Math.round(5000 * (((1 / ((8 + 10))) * ((i + j) / 2)))))));
				}
			}
		} else {
			console.error("Palette not init!");
		}
	};
	this.renderAnimatedCell = function(x, y, timing, duration, color) {
		var color = color ? color : that.palette.getColor(x, y); 
		animate({
				duration: duration,
				timing: timing,
				draw: function(timeFraction) {
					drawCell(that.context, x * cellWidth, y * cellHeight, cellWidth, cellHeight, backgoundColor);
					drawCell(that.context, x * cellWidth + (cellWidth - cellWidth * timeFraction) / 2, y * cellHeight + (cellHeight - cellHeight * timeFraction) / 2, cellWidth * timeFraction, cellHeight * timeFraction, color);
				},
				endCallback: function() {
					if(!that.palette.isDraggable(x, y)) drawDot(that.context, x * cellWidth, y * cellHeight, cellWidth, cellHeight);
				}
			});
	};
	this.renderAnimatedCellReverse = function(x, y, timing, duration, color) {
		var color = color ? color : that.palette.getColor(x, y); 
		animate({
				duration: duration,
				timing: timing,
				draw: function(timeFraction) {
					timeFraction = (1 - timeFraction);
					drawCell(that.context, x * cellWidth, y * cellHeight, cellWidth, cellHeight, backgoundColor);
					drawCell(that.context, x * cellWidth + (cellWidth - cellWidth * timeFraction) / 2, y * cellHeight + (cellHeight - cellHeight * timeFraction) / 2, cellWidth * timeFraction, cellHeight * timeFraction, color);
				}
			});
	};
	var animate = function(options) {
	  var start = performance.now();

	  requestAnimationFrame(function animate(time) {
		// timeFraction от 0 до 1
		var timeFraction = (time - start) / options.duration;
		if (timeFraction > 1) timeFraction = 1;

		// текущее состояние анимации
		var progress = options.timing(timeFraction);

		options.draw(progress);
		  
		if (timeFraction < 1) {
		  requestAnimationFrame(animate);
		} else {
			if(options.endCallback) options.endCallback();
		}

	  });
	};
	
	var drawCell = function(context, x, y, width, height, color) {
		context.fillStyle = color;
		context.fillRect(x, y, width, height);
	};
	
	var drawDot = function(context, x, y, width, height) {
		context.drawImage(dot, x + (width - dot.width) / 2, y + (height - dot.height) / 2);
	};
	
};

function circ(timeFraction) {
  return 1 - Math.sin(Math.sqrt(1 - timeFraction))
};

function linear(timeFraction) {
	return timeFraction;
};

function elastic(x, timeFraction) {
  return Math.pow(2, 10 * (timeFraction - 1)) * Math.acos(20 * Math.PI * x / 3 * timeFraction)
};

function quad(progress) {
  return Math.pow(progress, 2)
};

function bounce(timeFraction) {
  for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
    if (timeFraction >= (7 - 4 * a) / 11) {
      return -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) + Math.pow(b, 2);
    }
  }
}
