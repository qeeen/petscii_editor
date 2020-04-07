var c_white;
var c_red;
var c_black;
var c_cyan;
var c_violet;
var c_green;
var c_blue;
var c_yellow;
var c_orange;
var c_brown;
var c_lred;
var c_grey1;
var c_grey2;
var c_lgreen;
var c_lblue;
var c_grey3;

var petscii_table;
var painting;

var brush_color;
var brush;

var bg_mode;

var bg_color;
var canvas_x;
var table_y;

var mouse_cell_x;
var mouse_cell_y;

var f_windowWidth;
var f_windowHeight;

function preload(){
	petscii_table = loadImage('assets/petscii.png');
}
function setup(){
	c_white = color(255, 255, 255);
	c_red = color(136, 0, 0);
	c_black = color(0, 0, 0);
	c_cyan = color(170, 255, 238);
	c_violet = color(204, 68, 204);
	c_green = color(0, 204, 85);
	c_blue = color(0, 0, 170);
	c_yellow = color(238, 238, 119);
	c_orange = color(221, 136, 85);
	c_brown = color(102, 68, 0);
	c_lred = color(255, 119, 119);
	c_grey1 = color(51, 51, 51);
	c_grey2 = color(119, 119, 119);
	c_lgreen = color(170, 255, 102);
	c_lblue = color(0, 136, 255);
	c_grey3 = color(187, 187, 187);

	painting = createImage(32*32, 32*32);

	brush_color = c_blue;
	brush = 0;

	f_windowWidth = 1920;
	f_windowHeight = 983;

	bg_color = c_black;
	bg_mode = false;

	canvas_x = f_windowWidth/2 - 32*16 + 64;
	table_y =f_windowHeight/2 - 32*8;

	createCanvas(f_windowWidth, f_windowHeight);
}

function draw(){
	noStroke();
	background(c_grey1);
	fill(bg_color);
	rect(canvas_x, 0, 32*32, 32*32);

	mouse_cell_x = ((mouseX - canvas_x) - mouseX%32);
	mouse_cell_y = (mouseY - mouseY%32);

	//brush menu
	if(mouseIsPressed && mouse_cell_x < 0 && mouseY >= table_y && mouseY <= table_y+32*16){
		let grid_x = Math.floor((mouseX - mouseX%32)/32);
		let grid_y = Math.floor(((mouseY - table_y) - (mouseY - table_y)%32)/32);

		brush = grid_x + grid_y*16;
	}

	//color menu
	for(let i = 0; i < 16; ++i){
		let color = c_cyan;
		square_x = canvas_x + 1024 + (i*64)%(4*64);
		square_y = f_windowHeight/2+Math.floor(i/4)*64 - 128;

		switch(i){
			case 0:
				color = c_black;
				break;
			case 1:
				color = c_grey1;
				break;
			case 2:
				color = c_grey2;
				break;
			case 3:
				color = c_grey3;
				break;
			case 4:
				color = c_brown;
				break;
			case 5:
				color = c_red;
				break;
			case 6:
				color = c_orange;
				break;
			case 7:
				color = c_lred;
				break;
			case 8:
				color = c_violet;
				break;
			case 9:
				color = c_blue;
				break;
			case 10:
				color = c_lblue;
				break;
			case 11:
				color = c_cyan;
				break;
			case 12:
				color = c_green;
				break;
			case 13:
				color = c_lgreen;
				break;
			case 14:
				color = c_yellow;
				break;
			case 15:
				color = c_white;
				break;
		}

		if(
		mouseIsPressed &&
			(mouseX > square_x && mouseX < square_x+64) 
			&&
			(mouseY > square_y && mouseY < square_y+64)
		){
			if(!bg_mode){
				brush_color = color;
			}
			else{
				bg_color = color;
			}
		}

		fill(color);
		noStroke();
		rect(square_x, square_y, 64, 64);
	}

	//bg color menu
	if(mouseIsPressed &&
	  (mouseX > canvas_x+1024 && mouseX < canvas_x+1024 + 256) && 
	  (mouseY > f_windowHeight/2-128-64 && mouseY < f_windowHeight/2-128)){
		if(mouseX > canvas_x+1024 + 128){
			bg_mode = true;
		}
		else{
			bg_mode = false;
		}
	}

	//save/clear button code
	if(mouseIsPressed &&
	  (mouseX > canvas_x+1024 && mouseX < canvas_x+1024 + 256) && 
	  (mouseY > f_windowHeight/2+128 && mouseY < f_windowHeight/2+128+64)){
		if(mouseX > canvas_x+1024 + 128){
			painting = createImage(32*32, 32*32);
		}
		else{
			let combined_painting = createImage(1024, 1024);
			painting.loadPixels();
			combined_painting.loadPixels();
			for(let i = 0; i < 1024*1024*4; i+=4){
				if(painting.pixels[i+3] == 0){
					combined_painting.pixels[i + 0] = red(bg_color);
					combined_painting.pixels[i + 1] = green(bg_color);
					combined_painting.pixels[i + 2] = blue(bg_color);
					combined_painting.pixels[i + 3] = 255;
				}
				else{
					combined_painting.pixels[i + 0] = painting.pixels[i + 0];
					combined_painting.pixels[i + 1] = painting.pixels[i + 1];
					combined_painting.pixels[i + 2] = painting.pixels[i + 2];
					combined_painting.pixels[i + 3] = 255;
				}
			}
			combined_painting.updatePixels();
			combined_painting.save('petscii_painting', 'png');
		}
	}

	//painting the current tile
	if(mouseIsPressed && mouse_cell_x > -1 && mouse_cell_x < 32*32){
		painting.loadPixels();
		petscii_table.loadPixels();
		for(let i = 0; i < 32*4; i+=4){
			for(let k = 0; k < 32; ++k){
				painting.pixels[(mouse_cell_x*4 + i + 0) + (mouse_cell_y + k)*(32*32*4)] = red(brush_color);
				painting.pixels[(mouse_cell_x*4 + i + 1) + (mouse_cell_y + k)*(32*32*4)] = green(brush_color);
				painting.pixels[(mouse_cell_x*4 + i + 2) + (mouse_cell_y + k)*(32*32*4)] = blue(brush_color);

				painting.pixels[(mouse_cell_x*4 + i + 3) + (mouse_cell_y + k)*(32*32*4)]
				= 
				petscii_table.pixels[((brush%16)*32*4 + i + 3) + (Math.floor(brush/16)*32 + k)*(32*16*4)];
			}
		}
		painting.updatePixels();
	}

	//draw the painting itself
	tint(c_white);
	image(painting, canvas_x, 0);

	//for drawing the brush menu
	image(petscii_table, 0, table_y)
	
	noFill();
	stroke(c_lblue);
	strokeWeight(4);
	rect((brush%16)*32 - 2, Math.floor(brush/16)*32 + table_y - 2, 34, 34);

	//drawing the bg/brush buttons
	stroke(c_black);
	strokeWeight(2);
	fill(!bg_mode ? c_grey3 : c_grey1);
	rect(canvas_x+1024, f_windowHeight/2-128-64, 128, 64);
	fill(bg_mode ? c_grey3 : c_grey1);
	rect(canvas_x+1024 + 128, f_windowHeight/2-128-64, 128, 64);

	noStroke();
	fill(c_black);
	textSize(32);
	textAlign(CENTER, CENTER);
	text('brush', canvas_x+1024 + 64, f_windowHeight/2-128-64 + 32);
	text('bg', canvas_x+1024 + 128 + 64, f_windowHeight/2-128-64 + 32);

	//drawing the save/clear buttons
	stroke(c_black);
	strokeWeight(2);
	fill(c_green);
	rect(canvas_x+1024, f_windowHeight/2+128, 128, 64);
	fill(c_red);
	rect(canvas_x+1024 + 128, f_windowHeight/2+128, 128, 64);

	noStroke();
	fill(c_black);
	textSize(32);
	textAlign(CENTER, CENTER);
	text('save', canvas_x+1024 + 64, f_windowHeight/2+128 + 32);
	text('clear', canvas_x+1024 + 128 + 64, f_windowHeight/2+128 + 32);
}

//hotkeys
function keyPressed(){
	if(key === 'e'){
		brush = 32;
	}
	if(key === 's'){
		brush += 16;
		brush = brush%256;
	}
	if(key === 'a'){
		brush = --brush < 0 ? 255 : brush;
	}
	if(key === 'w'){
		brush -= 16;
		if(brush < 0)
			brush += 256;
	}
	if(key === 'd'){
		++brush;
		brush = brush%256;
	}
	if(key === 'q'){
		brush = 160;
	}
	if(key === 'x'){
		brush += 128;
		brush = brush%256;
	}
}
