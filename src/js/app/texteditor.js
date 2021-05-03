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
	console.log(words);
	renderWords();
}
function tokenize(str) {
	const words = [];
	const re = /^([^ \t\n]+)([ \t\n]*)/;
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
	for(let index = 0; index < words.length; index++) {
		const word = words[index];
		const elem = document.createElement('span');
		word.elem = elem;
		word.index = index;
		elem.className = 'word';
		elem.innerText = word.word;
		elem.onclick = () => {
			setActiveWord(index);
		};
		textbox.appendChild(elem);
		const ws = document.createTextNode(word.space);
		word.wsElem = ws;
		textbox.appendChild(ws);
	}
	if(words.length > 0) {
		setActiveWord(0);
	}
}
let activeWord = null;
function setActiveWord(index) {
	if(activeWord) {
		activeWord.elem.classList.remove('active');
		activeWord.elem.contentEditable = false;
		activeWord.editing = false;
		activeWord = null;
	}
	const word = words[index];
	word.elem.classList.add('active');
	activeWord = word;
}

function renderWord(word) {
	word.elem.innerText = word.word;
	word.wsElem.innerText = word.space;
}

function editWordImmediately(fn, spaceFn) {
	if(activeWord) {
		activeWord.word = fn(activeWord.word);
		if(spaceFn) {
			activeWord.space = spaceFn(activeWord.space);
		}
		renderWord(activeWord);
	}
}

function nextWord() {
			if(activeWord && activeWord.index < words.length - 1) {
				setActiveWord(activeWord.index + 1);
			}
}

function editWord() {
	if(!activeWord) {
		return;
	}
	activeWord.editing = true;
	activeWord.elem.contentEditable = true;

	// https://stackoverflow.com/questions/6139107/programmatically-select-text-in-a-contenteditable-html-element#6150060
	    const range = document.createRange();
	    range.selectNodeContents(activeWord.elem);
	    const sel = window.getSelection();
	    sel.removeAllRanges();
	    sel.addRange(range);
}

function finishEditing() {
	activeWord.word = activeWord.elem.innerText;
		activeWord.elem.contentEditable = false;
		activeWord.editing = false;
}

document.addEventListener('keydown', event => {
	console.log('key event', event);
	if(activeWord && activeWord.editing) {
		switch(event.key) {
			case 'Enter':
				event.preventDefault();
				finishEditing();
				nextWord();
				break;
		}
		return;
	}
	switch(event.key) {
		case 'ArrowLeft':
			if(activeWord && activeWord.index > 0) {
				setActiveWord(activeWord.index - 1);
			}
			break;
		case 'ArrowRight':
			nextWord();
			break;
		case ',':
			editWordImmediately(w => w.replaceAll(/[-,:.[\]]/g, '') + ',');
			nextWord();
			break;
		case '.':
			editWordImmediately(w => w.replaceAll(/[-,:.[\]]/g, '') + '.');
			nextWord();
			break;
		case 'c':
			event.preventDefault();
			editWord();
			break;
	}
});

/*
document.addEventListener('load', () => {
	loadText1("Ala ma kota, a kot\nma jakieś ale");
});
*/

export {
    initWatchFormatting as watchFormatting,
    initWordCount as watchWordCount,
    setEditorContents as setEditorContents,
    initAutoscroll as initAutoscroll
};
