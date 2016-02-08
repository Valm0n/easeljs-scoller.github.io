/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


angular.module('myApp')
.directive('runner', function () {
       "use strict";
       return {
           restrict : 'EAC',
           replace : true,
           scope :{
           },
           template: "<canvas width='960' height='400'></canvas>",
           link: function (scope, element, attribute) {
               var w, h, loader, manifest, metal, sky, megaman, city, city2, column;
               drawGame();
               function drawGame() {
                   //drawing the game canvas from scratch here
                   //In future we can pass stages as param and load indexes from arrays of background elements etc
                   if (scope.stage) {
                       scope.stage.autoClear = true;
                       scope.stage.removeAllChildren();
                       scope.stage.update();
                   } else {
                       scope.stage = new createjs.Stage(element[0]);
                   }
                   w = scope.stage.canvas.width;
                   h = scope.stage.canvas.height;
                   manifest = [
                       {src: "megaman.png", id: "megaman"},
                       {src: "sky.png", id: "sky"},
                       {src: "metalblock.png", id: "metal"},
                       {src: "city1.png", id: "city"},
                       {src: "city2.png", id: "city2"},
                       {src: "column.png", id: "column"},
                   ];
                   loader = new createjs.LoadQueue(false);
                   loader.addEventListener("complete", handleComplete);
                   loader.loadManifest(manifest, true, "assets/");
               }
               function handleComplete() {
                   sky = new createjs.Shape();
                   sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);
                   var metalblockImg = loader.getResult("metal");
                   metal = new createjs.Shape();
                   metal.graphics.beginBitmapFill(metalblockImg).drawRect(0,0, w * metalblockImg.width, metalblockImg.height);
                   metal.tileW = metalblockImg.width;
                   metal.y = h - metalblockImg.height;
                   city = new createjs.Bitmap(loader.getResult("city"));
                   city.setTransform(w, h - city.image.height * 4 - metalblockImg.height, 4, 4);
                   city.alpha = 0.4;
                   city2 = new createjs.Bitmap(loader.getResult("city2"));
                   city2.setTransform( w, h - city2.image.height * 3 - metalblockImg.height, 3, 3);
				   column = new createjs.Bitmap(loader.getResult("column"));
				   column.setTransform(w, h - column.image.height * 3, 3, 3);
                   var spriteSheet = new createjs.SpriteSheet({
                       framerate: 30,
                       "images": [loader.getResult("megaman")],
                       "frames": {"regX": 0, "height": 70, "count": 6, "regY": 0, "width": 56},
                       // define two animations, run (loops, 1.5x speed) and jump (returns to run):
                       "animations": {
                           "run": [0, 5, "run", 0.4]
                       }
                   });
                   megaman = new createjs.Sprite(spriteSheet, "run");
                   megaman.scaleX = 1.5;
                   megaman.scaleY = 1.5;
                   megaman.y = 235;
				   megaman.x = -120;
                   scope.stage.addChild(sky, city, city2, metal, megaman, column);
                   //scope.stage.addEventListener("stagemousedown", handleJumpStart);
                   createjs.Ticker.timingMode = createjs.Ticker.RAF;
                   createjs.Ticker.addEventListener("tick", tick);
               }
               function handleJumpStart() {
                   megaman.gotoAndPlay("jump");
               }
               function tick(event) {
                   var deltaS = event.delta / 1000;
                   var position = megaman.x + 28 * deltaS;
                   var megamanW = megaman.getBounds().width * megaman.scaleX;
                   megaman.x = (position >= w/2) ? megaman.x : position;
                   metal.x = (metal.x - deltaS * 150) % metal.tileW;
                   city.x = (city.x - deltaS * 20);
                   if (city.x + city.image.width * city.scaleX <= 0) {
                       city.x = w;
                   }
                   city2.x = (city2.x - deltaS * 50);
                   if (city2.x + city2.image.width * city2.scaleX <= 0) {
                       city2.x = w;
                   }
				   column.x = (column.x - deltaS * 500);
				   if (column.x + column.image.width * column.scaleX <= -50){
					   column.x = w;
				   }
                   scope.stage.update(event);
               }
           }
       }
   });