import { cleanHTML } from './clean-html';
import { activateTimestamps } from './timestamps';
const $ = require('jquery');

function countWords(str){
    var trimmedStr = $.trim(str);
    if (trimmedStr){
        return trimmedStr.match(/\S+/gi).length;
    }
    return 0;
}

function countTextbox(){
}

function initWordCount(){
}


function watchFormatting(){
}

function initWatchFormatting(){
}

function setEditorContents( dirtyText, opts = {} ) {
    
    const newText = cleanHTML(dirtyText);

    var $textbox = $("#textbox");
    
    function replaceText() {
        if (typeof newText === 'string') {
            $textbox[0].innerHTML = newText;
        } else {
            textbox[0].innerHTML = '';
            $textbox[0].appendChild(newText);    
        }
        activateTimestamps();
        $('.textbox-container').scrollTop(0);
    }
    
    if (opts.transition) {
        $textbox.fadeOut(300,function(){
            replaceText();
            $(this).fadeIn(300);
        });        
    } else {
        replaceText();
    }

}

function initAutoscroll() {
  var isScrolledToBottom = false;

  var container = document.querySelector('.textbox-container');
  var textbox = document.querySelector('#textbox');

  // update isScrolledToBottom on scroll event (true within 50px of the bottom of container)
  container.addEventListener('scroll', function() {
    isScrolledToBottom = container.scrollHeight - container.clientHeight - container.scrollTop <= 50;
  });

  // scroll to bottom on the input event, if isScrolledToBottom is true
  textbox.addEventListener('input', function() {
    if(isScrolledToBottom) {
      container.scrollTop = container.scrollHeight;
    }
  });
}

window.loadText = () => {
	$('#load-text').show();
};
window.loadTextFinish = () => {
	$('#load-text').hide();
	const text = $('#load-text textarea').val();
  var textbox = document.querySelector('#textbox');
	textbox.innerText = text;
};

export {
    initWatchFormatting as watchFormatting,
    initWordCount as watchWordCount,
    setEditorContents as setEditorContents,
    initAutoscroll as initAutoscroll
};
