/** 	=========================
	Template Name 	 : Dating Kit
	Author			 : DexignZone
	Version			 : 1.0
	File Name		 : custom.js
	Author Portfolio : https://themeforest.net/user/dexignzone/portfolio

	Core script to handle the entire theme and core functions
**/


var DatingKitSwiper = function(){
	
	var animating = false;
	var dzCardCounter = 0;
	var dzCardNum = jQuery('.dzSwipe_card').length;
	var dzDecisionVal = 80;
	var dzCard_moveX = 0;
	var dzCard_moveY = 0;
	var deg = 0;
	var dzCard, dzCardReject, dzCardLike;
	
	
	var cardSwiping = function(){
		animating = true;
		deg = dzCard_moveX / 10;
		degY = dzCard_moveY / 10;
		var superlike = false;
		if(Math.abs(dzCard_moveY) > Math.abs(dzCard_moveX)){
			superlike = true;
		}
		if(superlike){
			dzCard.css("transform", "translateY(-"+ dzCard_moveY +"px)");	
		}else{
			dzCard.css("transform", "translateX("+ dzCard_moveX +"px) rotate("+ deg +"deg)");	
		}
		console.log('dzCard_moveY->'+dzCard_moveY);

		var opacity = dzCard_moveX / 100;
		var opacityY = dzCard_moveY / 100;

		console.log('opacityY->'+opacityY);

		var rejectOpacity = (opacity >= 0) ? 0 : Math.abs(opacity);
		var likeOpacity = (opacity <= 0) ? 0 : opacity;
		
		console.log('likeOpacity--'+likeOpacity);
		
		var superlikeOpacity = (opacityY <= 0) ? 0 : opacityY;
		console.log('superlikeOpacity-'+superlikeOpacity);
		dzCardReject.css("opacity", rejectOpacity);
		dzCardLike.css("opacity", likeOpacity);
		if(superlike){
			dzCardSuperLike.css("opacity", superlikeOpacity);
		}
	}
	
	var swipeRelease = function() {

		if (dzCard_moveX >= dzDecisionVal) {
		  dzCard.addClass("to-right");
		} else if (dzCard_moveX <= -dzDecisionVal) {
		  dzCard.addClass("to-left");
		}

		if (Math.abs(dzCard_moveX) >= dzDecisionVal) {
		  dzCard.addClass("inactive");

		  setTimeout(function() {
			dzCard.addClass("below").removeClass("inactive to-left to-right");
			cardsRectified();
		  }, 300);
		}

		if (Math.abs(dzCard_moveX) < dzDecisionVal) {
		  dzCard.addClass("reset");
		}

		setTimeout(function() {
		  dzCard.attr("style", "").removeClass("reset")
			.find(".dzSwipe_card__option").attr("style", "");

		  dzCard_moveX = 0;
		  animating = false;
		}, 300);
	}
	
	var deliverCard = function() {

		if (dzCard_moveY >= dzDecisionVal) {
		  dzCard.addClass("to-upside");
		} else if (dzCard_moveY <= -dzDecisionVal) {
		  dzCard.addClass("to-downside");
		}

		if (Math.abs(dzCard_moveY) >= dzDecisionVal) {
		  dzCard.addClass("inactive");

			setTimeout(function() {
				dzCard.addClass("below").removeClass("inactive to-upside to-downside");
				cardsRectified();
			}, 300);
		}

		if (Math.abs(dzCard_moveY) < dzDecisionVal) {
		  dzCard.addClass("reset");
		}

		setTimeout(function() {
		  dzCard.attr("style", "").removeClass("reset")
			.find(".dzSwipe_card__option").attr("style", "");

		  dzCard_moveY = 0;
		  animating = false;
		}, 300);
	}
	
	var cardsRectified = function(){
		dzCardCounter++;
		if (dzCardCounter === dzCardNum) {
		  dzCardCounter = 0;
		  $(".dzSwipe_card").removeClass("below");
		}
	}
	
	var handleTouchStart = function(){
		$(document).on("mousedown touchstart", ".dzSwipe_card:not(.inactive)",  function(e) {
			if (animating) return;
			dzCard = $(this);
			dzCardReject = $(".dzSwipe_card__option.dzReject", dzCard);
			dzCardLike = $(".dzSwipe_card__option.dzLike", dzCard);
			dzCardSuperLike = $(".dzSwipe_card__option.dzSuperlike", dzCard);
			var startX =  e.pageX || e.originalEvent.touches[0].pageX;
			var startY =  e.pageY || e.originalEvent.touches[0].pageY;

			$(document).on("mousemove touchmove", function(e) {
			  var x = e.pageX || e.originalEvent.touches[0].pageX;
			  var y = e.pageY || e.originalEvent.touches[0].pageY;
			  dzCard_moveX = (x - startX);
			  dzCard_moveY = (startY - y);
			  if (!dzCard_moveX && !dzCard_moveY){
				  return;
			  }
			  cardSwiping();
			});

			$(document).on("mouseup touchend", function() {
				$(document).off("mousemove touchmove mouseup touchend");
				if (Math.abs(dzCard_moveX) < Math.abs(dzCard_moveY)){
					deliverCard();
				}else if (Math.abs(dzCard_moveX) > 0){
					swipeRelease();
				}
			});
		});
	}
	
	var handleSuperLike = function(){
		jQuery('.dz-sp-like').on('click',function(){
			var elementB = jQuery(this).parents('.dzSwipe_card');
			var elementSL = elementB.find('.dzSwipe_card__option.dzSuperlike')
			elementSL.css('opacity','1');
			elementB.slideUp(300, function() {
				cardsRectified();
				setTimeout(function() {
					elementB.addClass('below').css('display','');
					elementSL.css('opacity','');
				}, 500); 
			});
		});
	}
	
	
	/* Function ============ */
	return {
		init:function(){
			handleTouchStart();
			handleSuperLike();
		},
      
		load:function(){
			
		},
       
		resize:function(){
		
		},
	}
   
}();

/* Document.ready Start */	
jQuery(document).ready(function() {
   'use strict';
   DatingKitSwiper.init();
});
/* Document.ready END */
