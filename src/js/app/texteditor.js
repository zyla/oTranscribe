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
	console.log('load ', dirtyText);
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
	updateIndices();
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
		renderWord(word);

		textbox.appendChild(word.elem);
		textbox.appendChild(word.wsElem);
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

function deleteWord() {
	if(!activeWord) {
		return;
	}
	console.log('deleteWord');
	const word = activeWord;
	nextWord();
	words.splice(word.index, 1);
	const parent = word.elem.parentNode;
	parent.removeChild(word.elem);
	parent.removeChild(word.wsElem);
	updateIndices();
}

function updateIndices() {
	for(let i = 0; i < words.length; i++) {
		words[i].index = i;
	}
	console.log(JSON.stringify(words.map(w => [w.word, w.index])));
}

function rerenderWord(word) {
	word.elem.innerText = word.word;
	word.wsElem.textContent = word.space;
}

function editWordImmediately(fn, spaceFn) {
	if(activeWord) {
		activeWord.word = fn(activeWord.word);
		if(spaceFn) {
			activeWord.space = spaceFn(activeWord.space);
		}
		rerenderWord(activeWord);
	}
}

function previousWord() {
	if(activeWord && activeWord.index > 0) {
		setActiveWord(activeWord.index - 1);
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

function finishEditing(text) {
		activeWord.elem.contentEditable = false;
		activeWord.editing = false;
	console.log('finishEditing ' + JSON.stringify(text));
	const theWord = activeWord;
	deleteWord();
	insertWords(tokenize(text + theWord.space));
}

function insertWords(newWords) {
	console.log('insertWords ' + JSON.stringify(newWords));
	const index = activeWord.index;
	words.splice(index, 0, ...newWords);

	const parent = document.getElementById('textbox');

	for(const word of newWords) {
		renderWord(word);
		parent.insertBefore(word.elem, activeWord.elem);
		parent.insertBefore(word.wsElem, activeWord.elem);
	}

	updateIndices();
}

function renderWord(word) {
	               const elem = document.createElement('span');
	               word.elem = elem;
	               elem.className = 'word';
	               elem.innerText = word.word;
	               elem.onclick = () => {
	                       setActiveWord(word.index);
	               };
	               textbox.appendChild(elem);
	               const ws = document.createTextNode(word.space);
	               word.wsElem = ws;
	               textbox.appendChild(ws);

}

document.addEventListener('keydown', event => {
	console.log('key event', event);
	if(activeWord && activeWord.editing) {
		switch(event.key) {
			case 'Enter':
				event.preventDefault();
				finishEditing(activeWord.elem.innerText);
				break;
		}
		return;
	}
	switch(event.key) {
		case 'ArrowLeft':
			previousWord();
			break;
		case 'ArrowRight':
			nextWord();
			break;
		case ',':
			editWordImmediately(w => w.replace(/[-,:.!?[\]]/g, '') + event.key);
			nextWord();
			break;
		case '.':
		case '?':
		case '!':
			editWordImmediately(w => w.replace(/[-,:.!?[\]]/g, '') + event.key);
			nextWord();
			editWordImmediately(w => w.substring(0,1).toUpperCase() + w.substring(1));
			break;
		case '>':
			editWordImmediately(w => w.replace(/[-,:.!?[\]]/g, '') + '...');
			nextWord();
			break;
		case 'A':
			editWordImmediately(w => w.substring(0,1).toUpperCase() + w.substring(1));
			break;
		case 'a':
			editWordImmediately(w => w.substring(0,1).toLowerCase() + w.substring(1));
			break;
		case 'c':
			event.preventDefault();
			editWord();
			break;
		case 'i':
			event.preventDefault();
			nextWord();
			insertWords([ { word: '', space: ' ' } ]);
			previousWord();
			editWord();
			break;
		case ' ':
			editWordImmediately(w => w.replace(/[-,:.!?[\]]/g, ''));
			nextWord();
			break;
		case 'd':
			deleteWord();
			break;
		case 'Enter':
			previousWord();
			editWordImmediately(w => w, addEnter);
			nextWord();
			break;
		case 'Backspace':
			previousWord();
			editWordImmediately(w => w, space => ' ');
			nextWord();
			break;
		case 'B':
			previousWord();
			editWordImmediately(w => w, addEnter);
			nextWord();
			finishEditing('[B] ' + activeWord.word);
			previousWord();
			break;
		case 'W':
			previousWord();
			editWordImmediately(w => w, addEnter);
			nextWord();
			finishEditing('[W] ' + activeWord.word);
			previousWord();
			break;
	}
});

function addEnter(s) {
	return s.replace(/[^\n]/g, '') + '\n';
}

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
