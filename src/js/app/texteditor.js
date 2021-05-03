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
	loadText1(dirtyText);

}

function initAutoscroll() {

}
	let words = [];

window.loadText = () => {
	$('#load-text').show();
};
window.loadTextFinish = () => {
	$('#load-text').hide();
	const text = $('#load-text textarea').val();
	loadText1(text);
};
function loadText1(text) {
	words = tokenize(text);
	renderWords();
}
function tokenize(str) {
	const words = [];
	const re = /^([^ \t\n]+)(\s*)/;
	for(let i = 0; i < str.length;) {
		const matches = re.exec(str.substring(i));
		if(!matches) {
			break;
		}
		words.push({ word: matches[1], space: matches[2] });
		i += matches[0].length;
	}
	return words;
}
function renderWords() {
  var textbox = document.querySelector('#textbox');
	textbox.innerText = '';
	for(const word of words) {
		const elem = document.createElement('span');
		elem.className = 'word';
		elem.innerText = word.word;
		textbox.appendChild(elem);
		const ws = document.createTextNode(word.space);
		textbox.appendChild(ws);
	}
}

document.addEventListener('load', () => {
	loadText1("Ala ma kota, a kot\nma jakieś ale");
});

export {
    initWatchFormatting as watchFormatting,
    initWordCount as watchWordCount,
    setEditorContents as setEditorContents,
    initAutoscroll as initAutoscroll
};
