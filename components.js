//Button

const smButton = document.createElement('template')
smButton.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }       
            :host{
                display: inline-flex;
            }
            :host([disabled='true']) .sm-button{
                cursor: default;
                opacity: 1;
                background: rgba(var(--text), 0.4) !important;
                color: rgba(var(--foreground), 1);
            }
            :host([variant='primary']) .sm-button{
                background: var(--accent-color);
                color: rgba(var(--foreground), 1);
            }
            :host([variant='outlined']) .sm-button{
                box-shadow: 0 0 0 0.1rem var(--accent-color) inset;
                background: rgba(var(--foreground), 1); 
                color: var(--accent-color);
            }
            :host([variant='no-outline']) .sm-button{
                background: rgba(var(--foreground), 1); 
                color: var(--accent-color);
            }
            .sm-button {
                display: flex;
                padding: 0.6rem 0.8rem;
                cursor: pointer;
                user-select: none;
                border-radius: 0.2rem; 
                justify-content: center;
                transition: transform 0.3s;
                text-transform: uppercase;
                font-weight: 600;
                color: var(--accent-color);
                letter-spacing: 0.1em;
                font-family: var(--font-family);
                font-size: 0.8rem;
                background: var(--light-accent-shade); 
            }
            @media (hover: hover){
                :host([variant='primary']:not([disabled="true"])) .sm-button:hover{
                    opacity: 0.8;
                }
                :host([variant='no-outline']) .sm-button:hover{
                    background: var(--light-accent-shade); 
                }
            }
        </style>
        <div class="sm-button">
            <slot></slot>   
        </div>`;
customElements.define('sm-button',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' }).append(smButton.content.cloneNode(true))
        }
        static get observedAttributes() {
            return ['disabled']
        }

        get disabled() {
            return this.getAttribute('disabled')
        }

        set disabled(val) {
            this.setAttribute('disabled', val)
        }

        connectedCallback() {
            let disabledEvent = new CustomEvent('disabled', {
                bubbles: true,
                composed: true
            })
            let clicked = new CustomEvent('clicked', {
                bubbles: true,
                composed: true
            })
            this.addEventListener('click', (e) => {
                if (this.getAttribute('disabled') === 'true') {
                    this.dispatchEvent(disabledEvent)
                }
                else
                    this.dispatchEvent(clicked)
            })
        }

        attributeChangedCallback(name, oldValue, newValue) {
        }
    })

//Input
const smInput = document.createElement('template')
smInput.innerHTML = `
        <style>
        *{
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        } 
        input[type="search"]::-webkit-search-decoration,
        input[type="search"]::-webkit-search-cancel-button,
        input[type="search"]::-webkit-search-results-button,
        input[type="search"]::-webkit-search-results-decoration { display: none; }
        input[type=number] {
        -moz-appearance:textfield;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            margin: 0; 
        }
        input:invalid{
        outline: none;
        box-shadow: none;
        }
        ::-moz-focus-inner{
        border: none;
        }
        :host{
            display: inline-flex;
            flex-direction: column;
        }
        .hide{
           opacity: 0 !important;
           pointer-events: none !important;
        }
        .icon {
            fill: none;
            height: 1.6rem;
            width: 1.6rem;
            padding: 0.5rem;
            stroke: rgba(var(--text), 0.7);
            stroke-width: 10;
            overflow: visible;
            stroke-linecap: round;
            border-radius: 1rem;
            stroke-linejoin: round;
            cursor: pointer;
            min-width: 0;
        }
        .input {
            display: flex;
            align-items: center;
            position: relative;
            gap: 1rem;
            padding: 0.6rem 1rem;
            border-radius: 0.2em;
            transition: opacity 0.3s;
            background: rgba(var(--text), 0.1);
            font-family: var(--font-family);
            width: 100%
        }

        input:focus{
            caret-color: var(--accent-color);
        }
    
        .label {
            user-select: none;
            opacity: .7;
            font-weight: 400;
            font-size: 1rem;
            position: absolute;
            top: 0;
            transition: transform 0.3s;
            -webkit-transform-origin: left;
            transform-origin: left;
            pointer-events: none;
            will-change: transform;
            text-transform: capitalize;
        }
        .container{
            display: flex;
            position: relative;
            align-items: center;
            flex: 1;
        }    
        input{
            font-size: 1rem;
            border: none;
            background: transparent;
            outline: none;
            color: rgba(var(--text), 1);
            width: 100%;
        }
        .animate-label .container input {
            -webkit-transform: translateY(0.5rem);
                    transform: translateY(0.5rem);
            }
          
        .animate-label .container .label {
            -webkit-transform: translateY(-60%) scale(0.7);
                    transform: translateY(-60%) scale(0.7);
            opacity: 1;
            color: var(--accent-color);
        }
        .helper-text{
            color: var(--error-color);
            padding: 0.4rem 1rem;
        }
        @media (any-hover: hover){
            .icon:hover{
                background: rgba(var(--text), 0.1);
            }
        }
    </style>
    <label class="input">
        <slot name = "icon"></slot>
        <div class="container">
            <input/>
            <div class="label"></div>
        </div>
        <svg class="icon clear hide" viewBox="0 0 64 64">
            <title>clear</title>
            <line x1="64" y1="0" x2="0" y2="64"/>
            <line x1="64" y1="64" x2="0" y2="0"/>
        </svg>
    </label>
    <div class="helper-text hide"></div>
`;
customElements.define('sm-input',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' }).append(smInput.content.cloneNode(true))
        }
        static get observedAttributes() {
            return ['placeholder']
        }

        get value() {
            return this.shadowRoot.querySelector('input').value
        }

        set value(val) {
            this.shadowRoot.querySelector('input').value = val;
        }

        get placeholder() {
            return this.getAttribute('placeholder')
        }

        set placeholder(val) {
            this.setAttribute('placeholder', val)
        }

        get type() {
            return this.getAttribute('type')
        }

        get isValid() {
            return this.shadowRoot.querySelector('input').checkValidity()
        }

        preventNonNumericalInput(e) {
            let keyCode = e.keyCode;
            if (!((keyCode > 47 && keyCode < 56) || (keyCode > 36 && keyCode < 39) || (keyCode > 95 && keyCode < 104) || keyCode === 110 || (keyCode > 7 && keyCode < 19))) {
                e.preventDefault();
            }
        }

        checkInput(label, inputParent, clear, helperText) {
            if (!this.hasAttribute('placeholder') || this.getAttribute('placeholder') === '')
                return;
            if (this.input.value !== '') {
                if (this.animate)
                    inputParent.classList.add('animate-label')
                else
                    label.classList.add('hide')
                clear.classList.remove('hide')
            }
            else {
                if (this.animate)
                    inputParent.classList.remove('animate-label')
                else
                    label.classList.remove('hide')
                clear.classList.add('hide')
            }
            if (this.valueChanged) {
                if (this.input.checkValidity())
                    helperText.classList.add('hide')
                else
                    helperText.classList.remove('hide')
            }
        }

        connectedCallback() {
            let inputParent = this.shadowRoot.querySelector('.input'),
                clearBtn = this.shadowRoot.querySelector('.clear'),
                label = this.shadowRoot.querySelector('.label'),
                helperText = this.shadowRoot.querySelector('.helper-text')
            this.valueChanged = false;
            this.animate = this.hasAttribute('animate')
            this.input = this.shadowRoot.querySelector('input')
            this.shadowRoot.querySelector('.label').textContent = this.getAttribute('placeholder')
            if (this.hasAttribute('value')) {
                this.input.value = this.getAttribute('value')
                this.checkInput(inputParent, clearBtn)
            }
            if (this.hasAttribute('helper-text')) {
                helperText.textContent = this.getAttribute('helper-text')
            }
            if (this.hasAttribute('type')) {
                if (this.getAttribute('type') === 'number') {
                    this.input.setAttribute('inputmode', 'numeric')
                }
                else
                    this.input.setAttribute('type', this.getAttribute('type'))
            }
            else
                this.input.setAttribute('type', 'text')
            this.input.addEventListener('keydown', e => {
                if (this.getAttribute('type') === 'number')
                    this.preventNonNumericalInput(e);
            })
            this.input.addEventListener('input', e => {
                this.checkInput(label, inputParent, clearBtn, helperText)
            })
            this.input.addEventListener('change', e => {
                this.valueChanged = true;
                if (this.input.checkValidity())
                    helperText.classList.add('hide')
                else
                    helperText.classList.remove('hide')
            })
            clearBtn.addEventListener('click', e => {
                this.input.value = ''
                this.checkInput(label, inputParent, clearBtn, helperText)
            })
        }

        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (name === 'placeholder')
                    this.shadowRoot.querySelector('.label').textContent = newValue;
            }
        }
    })

// tab-header

const smTabs = document.createElement('template')
smTabs.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
} 
:host{
    display: flex;
}
.tabs{
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    overflow: hidden auto;
}
.tab-header{
    display: flex;
    position: relative;
    overflow: auto hidden;
    max-width: 100%;
    border-bottom: solid 1px rgba(var(--text), .2);
    scrollbar-width: 0;
    margin-bottom: 1rem;
}
.indicator{
    position: absolute;
    left: 0;
    bottom: 0;
    height: 0.15rem;
    border-radius: 1rem 1rem 0 0;  
    background: var(--accent-color);
    transition: transform 0.3s, width 0.3s;
}
:host([type="tab"]) .indicator{
    height: 100%;
    border-radius: 0.2rem
}
:host([type="tab"]) .tab-header{
    border-bottom: none; 
}
:host([type="tab"]) slot[name="tab"]{
    border-radius: 0.2rem;
    border-bottom: none;
}
.hide-completely{
    display: none;
}
:host([type="tab"]) slot[name="tab"]::slotted(.active){
    color: rgba(var(--foreground), 1);
}
slot[name="tab"]::slotted(.active){
    color: var(--accent-color);
    opacity: 1;
}
slot[name="panel"]::slotted(.hide-completely){
    display: none;
}
@media (hover: none){
    .tab-header::-webkit-scrollbar-track {
        -webkit-box-shadow: none !important;
        background-color: transparent !important;
    }
    .tab-header::-webkit-scrollbar {
        height: 0;
        background-color: transparent;
    }
}         
</style>
<div class="tabs">
    <div class="tab-header">
        <slot name="tab">Nothing to see here</slot>
        <div class="indicator"></div>
    </div>
    <slot name="panel">Nothing to see here</slot>
</div>
`;

customElements.define('sm-tabs', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smTabs.content.cloneNode(true))
        this.indicator = this.shadowRoot.querySelector('.indicator');
        this.tabSlot = this.shadowRoot.querySelector('slot[name="tab"]');
        this.panelSlot = this.shadowRoot.querySelector('slot[name="panel"]');
        this.tabHeader = this.shadowRoot.querySelector('.tab-header');
    }
    connectedCallback() {

        //animations
        let flyInLeft = [
            {
                opacity: 0,
                transform: 'translateX(-1rem)'
            },
            {
                opacity: 1,
                transform: 'none'
            }
        ],
            flyInRight = [
                {
                    opacity: 0,
                    transform: 'translateX(1rem)'
                },
                {
                    opacity: 1,
                    transform: 'none'
                }
            ],
            flyOutLeft = [
                {
                    opacity: 1,
                    transform: 'none'
                },
                {
                    opacity: 0,
                    transform: 'translateX(-1rem)'
                }
            ],
            flyOutRight = [
                {
                    opacity: 1,
                    transform: 'none'
                },
                {
                    opacity: 0,
                    transform: 'translateX(1rem)'
                }
            ],
            animationOptions = {
                duration: 300,
                fill: 'forwards',
                easing: 'ease'
            }
        this.prevTab
        this.allTabs
        this.shadowRoot.querySelector('slot[name="panel"]').addEventListener('slotchange', () => {
            this.shadowRoot.querySelector('slot[name="panel"]').assignedElements().forEach((panel, index) => {
                panel.classList.add('hide-completely')
            })
        })
        this.shadowRoot.querySelector('slot[name="tab"]').addEventListener('slotchange', () => {
            this.allTabs = this.shadowRoot.querySelector('slot[name="tab"]').assignedElements();
            this.shadowRoot.querySelector('slot[name="tab"]').assignedElements().forEach((panel, index) => {
                panel.setAttribute('rank', index + 1)
            })
        })
        this._targetBodyFlyRight = (targetBody) => {
            targetBody.classList.remove('hide-completely')
            targetBody.animate(flyInRight, animationOptions)
        }
        this._targetBodyFlyLeft = (targetBody) => {
            targetBody.classList.remove('hide-completely')
            targetBody.animate(flyInLeft, animationOptions)
        }
        this.tabSlot.addEventListener('click', e => {
            if (e.target === this.prevTab || !e.target.closest('sm-tab'))
                return
            if (this.prevTab)
                this.prevTab.classList.remove('active')
            e.target.classList.add('active')

            e.target.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            this.indicator.setAttribute('style', `width: ${e.target.getBoundingClientRect().width}px; transform: translateX(${e.target.getBoundingClientRect().left - e.target.parentNode.getBoundingClientRect().left + this.tabHeader.scrollLeft}px)`)

            if (this.prevTab) {
                let targetBody = e.target.nextElementSibling,
                    currentBody = this.prevTab.nextElementSibling;

                if (this.prevTab.getAttribute('rank') < e.target.getAttribute('rank')) {
                    if (currentBody && !targetBody)
                        currentBody.animate(flyOutLeft, animationOptions).onfinish = () => {
                            currentBody.classList.add('hide-completely')
                        }
                    else if (targetBody && !currentBody) {
                        this._targetBodyFlyRight(targetBody)
                    }
                    else if (currentBody && targetBody) {
                        currentBody.animate(flyOutLeft, animationOptions).onfinish = () => {
                            currentBody.classList.add('hide-completely')
                            this._targetBodyFlyRight(targetBody)
                        }
                    }
                } else {
                    if (currentBody && !targetBody)
                        currentBody.animate(flyOutRight, animationOptions).onfinish = () => {
                            currentBody.classList.add('hide-completely')
                        }
                    else if (targetBody && !currentBody) {
                        this._targetBodyFlyLeft(targetBody)
                    }
                    else if (currentBody && targetBody) {
                        currentBody.animate(flyOutRight, animationOptions).onfinish = () => {
                            currentBody.classList.add('hide-completely')
                            this._targetBodyFlyLeft(targetBody)
                        }
                    }
                }
            } else {
                e.target.nextElementSibling.classList.remove('hide-completely')
            }
            this.prevTab = e.target;
        })
        let observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let activeElement = this.tabSlot.assignedElements().filter(element => {
                        if (element.classList.contains('active'))
                            return true
                    })
                    if (activeElement.length) {
                        let tabDimensions = activeElement[0].getBoundingClientRect();
                        this.indicator.setAttribute('style', `width: ${tabDimensions.width}px; transform: translateX(${tabDimensions.left - activeElement[0].parentNode.getBoundingClientRect().left + this.tabHeader.scrollLeft}px)`)
                    }
                    else {
                        this.tabSlot.assignedElements()[0].classList.add('active')
                        this.panelSlot.assignedElements()[0].classList.remove('hide-completely')
                        let tabDimensions = this.tabSlot.assignedElements()[0].getBoundingClientRect();
                        this.indicator.setAttribute('style', `width: ${tabDimensions.width}px; transform: translateX(${tabDimensions.left - this.tabSlot.assignedElements()[0].parentNode.getBoundingClientRect().left + this.tabHeader.scrollLeft}px)`)
                        this.prevTab = this.tabSlot.assignedElements()[0];
                    }
                }
            })
        },
            { threshold: 1.0 })
        observer.observe(this.tabHeader)
        let touchStartTime = 0,
            touchEndTime = 0,
            swipeTimeThreshold = 200,
            swipeDistanceThreshold = 20,
            startingPointX = 0,
            endingPointX = 0,
            currentIndex = 0;
        this.addEventListener('touchstart', e => {
            touchStartTime = e.timeStamp
            startingPointX = e.changedTouches[0].clientX
        })
        this.panelSlot.addEventListener('touchend', e => {
            touchEndTime = e.timeStamp
            endingPointX = e.changedTouches[0].clientX
            if (touchEndTime - touchStartTime < swipeTimeThreshold) {
                currentIndex = this.allTabs.findIndex(element => element.classList.contains('active'))
                if (startingPointX > endingPointX && startingPointX - endingPointX > swipeDistanceThreshold && currentIndex < this.allTabs.length) {
                    this.allTabs[currentIndex + 1].click()
                }
                else if (startingPointX < endingPointX && endingPointX - startingPointX > swipeDistanceThreshold && currentIndex > 0) {
                    this.allTabs[currentIndex - 1].click()
                }
            }
        })
    }
})

// tab
const smTab = document.createElement('template')
smTab.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
} 
:host{
    position: relative;
    display: inline-flex;
    z-index: 1;
}
.tab{
    position: relative;
    user-select: none;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    white-space: nowrap;
    padding: 0.6rem 0.8rem;
    font-weight: 500;
    word-spacing: 0.1em;
    text-align: center;
    transition: color 0.3s;
    text-transform: capitalize;
    font-family: var(--font-family);
}
@media (hover: hover){
    :host(.active) .tab{
        opacity: 1;
    }
    .tab{
        opacity: 0.7
    }
    .tab:hover{
        opacity: 1
    }
}
</style>
<div class="tab">
    <slot></slot>
</div>
`;

customElements.define('sm-tab', class extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' }).append(smTab.content.cloneNode(true))
    }
})

//chcekbox

const smCheckbox = document.createElement('template')
smCheckbox.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
} 
:host{
    display: inline-flex;
}
.checkbox {
    diplay:flex;
    border-radius: 2rem;
    cursor: pointer;
}

.checkbox:active svg {
  -webkit-transform: scale(0.9);
          transform: scale(0.9);
}

.checkbox input {
  display: none;
}

.checkbox .checkmark {
  stroke-dashoffset: -65;
  stroke-dasharray: 65;
  -webkit-transition: stroke-dashoffset 0.3s; 
  transition: stroke-dashoffset 0.3s;
}

.checkbox input:checked ~ svg .checkmark {
  stroke-dashoffset: 0;
  stroke: rgba(var(--foreground), 1);
}
.checkbox input:checked ~ svg {
  stroke: var(--accent-color);
  fill: var(--accent-color);
  stroke-width: 8; 
}

.icon {
  fill: none;
  height: 1.2rem;
  width: 1.2rem;
  stroke: rgba(var(--text), 0.7);
  stroke-width: 6;
  overflow: visible;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
<label class="checkbox">
    <input type="checkbox">
    <svg class="icon" viewBox="0 0 64 64">
        <title>checkbox</title>
        <rect class="box" x="0" y="0" width="64" height="64" rx="4" />
        <path class="checkmark" d="M50.52,19.56,26,44.08,13.48,31.56" />
    </svg>
</label>`
customElements.define('sm-checkbox', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smCheckbox.content.cloneNode(true))
    }

    static get observedAttributes() {
        return ['disabled']
    }

    get disabled() {
        return this.getAttribute('disabled')
    }

    set disabled(val) {
        this.setAttribute('disabled', val)
    }

    connectedCallback() {
        this.checkbox = this.shadowRoot.querySelector('.checkbox');
        if (this.hasAttribute('disabled')) {
            this.checkbox.classList.add('disabled')
        }
        else {
            this.checkbox.classList.remove('disabled')
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.checkbox = this.shadowRoot.querySelector('.checkbox');
        if (oldValue !== newValue) {
            if (name === 'disabled') {
                if (newValue === 'true') {
                    this.checkbox.classList.add('disabled')
                }
                else {
                    this.checkbox.classList.remove('disabled')
                }
            }
        }
    }

})

//sm-audio

const smAudio = document.createElement('template')
smAudio.innerHTML = `
<style>
*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

:host{
	display: flex;
}

.audio{
  position: relative;
  display: -webkit-box;
  display: flex;
  -webkit-box-align: center;
          align-items: center;
  -webkit-user-select: none;
          user-select: none;
  padding: 0.6rem;
  border-radius: 0.2rem;
  background: rgba(var(--text), 0.08);
  overflow: hidden;
  width: 100%;
}

.hide {
  display: none;
}

.icon{
  stroke: rgba(var(--text), 1);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  overflow: visible;
  height: 2.1rem;
  width: 2.1rem;
  padding: 0.6rem;
  cursor: pointer;
  border-radius: 2rem;
  margin-right: 0.5rem;
}

.icon:hover{
  background: rgba(var(--text), 0.1);
}

audio {
  display: none;
}

.track {
  position: absolute;
  height: 0.2rem;
  bottom: 0;
  background: var(--accent-color);
  left: 0;
  -webkit-transition: width 0.2s;
  transition: width 0.2s;
  pointer-events: none;
  z-index: 0;
  border-radius: 0.2rem;
}

.disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
	<div class="audio">
		<svg class="icon play" viewBox="-6 0 64 64">
			<title>play</title>
			<path d="M57.12,26.79,12.88,1.31a6,6,0,0,0-9,5.21v51a6,6,0,0,0,9,5.21L57.12,37.21A6,6,0,0,0,57.12,26.79Z"/>
		</svg>
		<svg class="icon pause hide" viewBox="0 0 64 64">
			<title>pause</title>
			<line x1="17.5" x2="17.5" y2="64"/>
			<line x1="46.5" x2="46.5" y2="64"/>
		</svg>
		<h5 class="current-time"></h5> / <h5 class="duration"></h5>
		<audio src=""></audio>
		<div class="track"></div>
	</audio>
`;

customElements.define('sm-audio', class extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }).append(smAudio.content.cloneNode(true))

        this.playing = false;
    }
    static get observedAttributes() {
        return ['src']
    }
    play() {
        this.audio.play()
        this.playing = false;
        this.pauseBtn.classList.remove('hide')
        this.playBtn.classList.add('hide')
    }
    pause() {
        this.audio.pause()
        this.playing = true;
        this.pauseBtn.classList.add('hide')
        this.playBtn.classList.remove('hide')
    }

    get isPlaying() {
        return this.playing;
    }

    connectedCallback() {
        this.playBtn = this.shadowRoot.querySelector('.play');
        this.pauseBtn = this.shadowRoot.querySelector('.pause');
        this.audio = this.shadowRoot.querySelector('audio')
        this.playBtn.addEventListener('click', e => {
            this.play()
        })
        this.pauseBtn.addEventListener('click', e => {
            this.pause()
        })
        this.audio.addEventListener('ended', e => {
            this.pause()
        })
        let width;
        if ('ResizeObserver' in window) {
            let resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    width = entry.contentRect.width;
                })
            })
            resizeObserver.observe(this)
        }
        else {
            let observer = new IntersectionObserver((entries, observer) => {
                if (entries[0].isIntersecting)
                    width = this.shadowRoot.querySelector('.audio').offsetWidth;
            }, {
                threshold: 1
            })
            observer.observe(this)
        }
        this.audio.addEventListener('timeupdate', e => {
            let time = this.audio.currentTime,
                minutes = Math.floor(time / 60),
                seconds = Math.floor(time - minutes * 60),
                y = seconds < 10 ? "0" + seconds : seconds;
            this.shadowRoot.querySelector('.current-time').textContent = `${minutes}:${y}`
            this.shadowRoot.querySelector('.track').style.width = (width / this.audio.duration) * this.audio.currentTime + 'px'
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'src') {
                if (this.hasAttribute('src') && newValue.trim() !== '') {
                    this.shadowRoot.querySelector('audio').src = newValue;
                    this.shadowRoot.querySelector('audio').onloadedmetadata = () => {
                        let duration = this.audio.duration,
                            minutes = Math.floor(duration / 60),
                            seconds = Math.floor(duration - minutes * 60),
                            y = seconds < 10 ? "0" + seconds : seconds;
                        this.shadowRoot.querySelector('.duration').textContent = `${minutes}:${y}`;
                    }
                }
                else
                    this.classList.add('disabled')
            }
        }
    }
})

//sm-switch

const smSwitch = document.createElement('template')
smSwitch.innerHTML = `	
<style>
*{
    box-sizing: border-box;
    padding: 0;
    margin: 0;
}

:host{
    display: inline-flex;
}
.switch {
    position: relative;
    overflow: hidden;
    display: -webkit-inline-box;
    display: -ms-inline-flexbox;
    display: inline-flex;
    -webkit-box-align: center;
            align-items: center;
    border-radius: 1rem;
    width: 2.4rem;
    padding: 0.2rem;
    cursor: pointer;
}

.switch input {
    display: none;
}

.switch .track {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    -webkit-transition: background 0.4s;
    transition: background 0.4s;
    background: rgba(var(--text), 0.4);
    box-shadow: 0 0.1rem 0.3rem #00000040 inset;
}

.switch .button {
    position: relative;
    display: -webkit-inline-box;
    display: inline-flex;
    height: 1rem;
    width: 1rem;
    border-radius: 1rem;
    box-shadow: 0 0.1rem 0.4rem #00000060;
    transition: transform 0.4s;
    border: solid 0.3rem rgba(var(--foreground), 1);
}

.switch input:checked ~ .button {
    transform: translateX(100%);
}

.switch input:checked ~ .track {
    background: var(--accent-color);
}

</style>
<label class="switch">
    <input type="checkbox">
    <div class="track"></div>
    <div class="button"></div>
</label>`

customElements.define('sm-switch', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smSwitch.content.cloneNode(true))
    }

    get checked() {
        return this.checkbox.checked
    }

    set checked(value) {
        this.checkbox.checked = value;
    }

    connectedCallback() {
        this.checkbox = this.shadowRoot.querySelector('input');
    }
})

// sm-select
const smSelect = document.createElement('template')
smSelect.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            } 
            .icon {
                fill: none;
                height: 0.8rem;
                width: 0.8rem;
                stroke: rgba(var(--text), 0.7);
                stroke-width: 6;
                overflow: visible;
                stroke-linecap: round;
                stroke-linejoin: round;
            }      
            :host{
                display: inline-flex;
            }
            .hide{
                opacity: 0;
                pointer-events: none;
            }
            .sm-select{
                position: relative;
                display: flex;
                flex-direction: column;
                cursor: pointer;
                width: 100%;
                -webkit-tap-highlight-color: transparent;
            }
            .option-text{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .selection{
                border-radius: 0.2rem;
                display: flex;
                padding: 0.4rem 0.7rem;
                background: rgba(var(--text), 0.1);
                border: solid 1px rgba(var(--text), 0.2);
                align-items: center;
                justify-content: space-between;
                outline: none;
            }
            .icon{
                margin-left: 1rem;
            }
            :host([align-select="right"]) .options{
                left: 0;
            }
            :host([align-select="right"]) .options{
                right: 0;
            }
            .options{
                overflow: hidden auto;
                position: absolute;
                grid-area: options;
                display: flex;
                flex-direction: column;
                min-width: 100%;
                background: rgba(var(--foreground), 1);
                transition: opacity 0.3s, top 0.3s;
                border: solid 1px rgba(var(--text), 0.2);
                border-radius: 0.2rem;
                z-index: 2;
                box-shadow: 0.4rem 0.8rem 1.2rem #00000030;
            }
        </style>
        <div class="sm-select">
            <div class="selection" tabindex="0">
                <div class="option-text"></div>
                <svg class="icon toggle" viewBox="0 0 64 64">
                    <polyline points="63.65 15.99 32 47.66 0.35 15.99"/>
                </svg>
            </div>
            <div class="options hide">
                <slot></slot> 
            </div>
        </div>`;
customElements.define('sm-select', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smSelect.content.cloneNode(true))
    }
    static get observedAttributes() {
        return ['value']
    }
    get value() {
        return this.getAttribute('value')
    }
    set value(val) {
        this.setAttribute('value', val)
    }
    connectedCallback() {
        let optionList = this.shadowRoot.querySelector('.options'),
            chevron = this.shadowRoot.querySelector('.toggle'),
            slot = this.shadowRoot.querySelector('.options slot'),
            selection = this.shadowRoot.querySelector('.selection'),
            previousOption,
            slideDown = [
                { transform: `translateY(-0.5rem)` },
                { transform: `translateY(0)` }
            ],
            slideUp = [
                { transform: `translateY(0)` },
                { transform: `translateY(-0.5rem)` }
            ],
            animationOptions = {
                duration: 300,
                fill: "forwards",
                easing: 'ease'
            }
        selection.addEventListener('click', e => {
            optionList.classList.remove('hide')
            optionList.animate(slideDown, animationOptions)
        })
        this.addEventListener('optionSelected', e => {
            if (previousOption !== e.target) {
                this.setAttribute('value', e.detail.value)
                this.shadowRoot.querySelector('.option-text').textContent = e.detail.text;
                this.dispatchEvent(new CustomEvent('change', {
                    bubbles: true,
                    composed: true
                }))
                if (previousOption) {
                    previousOption.classList.remove('check-selected')
                }
                previousOption = e.target;
            }
            setTimeout(() => {
                optionList.animate(slideUp, animationOptions)
                optionList.classList.add('hide')
            }, 200);

            e.target.classList.add('check-selected')
        })
        slot.addEventListener('slotchange', e => {
            if (slot.assignedElements()[0]) {
                let firstElement = slot.assignedElements()[0];
                previousOption = firstElement;
                firstElement.classList.add('check-selected')
                this.setAttribute('value', firstElement.getAttribute('value'))
                this.shadowRoot.querySelector('.option-text').textContent = firstElement.textContent
                slot.assignedElements().forEach((element, index) => {
                    element.setAttribute('data-rank', index + 1);
                })
            }
        });
        document.addEventListener('mousedown', e => {
            if (!this.contains(e.target)) {
                optionList.classList.add('hide')
                optionList.animate(slideUp, animationOptions)
            }
        })
    }
})

// sm-option
const smOption = document.createElement('template')
smOption.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }     
            :host{
                display: flex;
            }
            .sm-option{
                min-width: 100%;
                padding: 0.8rem 1.2rem;
                cursor: pointer;
                overflow-wrap: break-word;
                outline: none;
                display: flex;
                align-items: center;
            }
            .sm-option:focus{
                background: rgba(var(--text), 0.1);
            }
            .sm-option:focus .icon{
                opacity: 0.4
            }
            :host(.check-selected) .icon{
                opacity: 1 !important
            }
            .icon {
                margin-right: 0.8rem;
                fill: none;
                height: 0.8rem;
                width: 0.8rem;
                stroke: rgba(var(--text), 0.7);
                stroke-width: 10;
                overflow: visible;
                stroke-linecap: round;
                border-radius: 1rem;
                stroke-linejoin: round;
                opacity: 0;
            }
            @media (hover: hover){
                .sm-option:hover{
                    background: rgba(var(--text), 0.1);
                }
                .sm-option:hover .icon{
                    opacity: 0.4
                }
            }
        </style>
        <div class="sm-option" tabindex="0">
            <svg class="icon" viewBox="0 0 64 64">
                <polyline points="0.35 31.82 21.45 52.98 63.65 10.66"/>
            </svg>
            <slot></slot> 
        </div>`;
customElements.define('sm-option', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smOption.content.cloneNode(true))
    }
    connectedCallback() {
        this.addEventListener('click', e => {
            let optionSelected = new CustomEvent('optionSelected', {
                bubbles: true,
                composed: true,
                detail: {
                    text: this.textContent,
                    value: this.getAttribute('value')
                }
            })
            this.dispatchEvent(optionSelected)
        })
        if (this.hasAttribute('default')) {
            setTimeout(() => {
                let optionSelected = new CustomEvent('optionSelected', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        text: this.textContent,
                        value: this.getAttribute('value'),
                        rank: this.dataset.rank
                    }
                })
                this.dispatchEvent(optionSelected)
            }, 0);
        }
    }
})

// sm-select
const smStripSelect = document.createElement('template')
smStripSelect.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }    
            :host{
                display: flex;
            }
            .sm-select{
                position: relative;
                display: flex;
                gap: 0.5rem;
                max-width: 100%;
                overflow: auto hidden;
                margin: 0.6rem 0;
            }
            slot::slotted(.active){
                border-radius: 2rem;
                opacity: 1;
                background-color: rgba(var(--text), .6);  
                color: rgba(var(--foreground), 1);
            }
            @media (hover: none){
                ::-webkit-scrollbar-track {
                    -webkit-box-shadow: none !important;
                    background-color: transparent !important;
                }
                ::-webkit-scrollbar {
                    height: 0;
                    background-color: transparent;
                }
            }
        </style>
        <div class="sm-select">
            <slot></slot> 
        </div>`;
customElements.define('sm-strip-select', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smStripSelect.content.cloneNode(true))
    }
    static get observedAttributes() {
        return ['value']
    }
    get value() {
        return this.getAttribute('value')
    }
    set value(val) {
        this.setAttribute('value', val)
    }
    connectedCallback() {
        let previousOption,
            slot = this.shadowRoot.querySelector('slot');
        this.addEventListener('optionSelected', e => {
            if (previousOption === e.target) return;
            if (previousOption)
                previousOption.classList.remove('active')
            e.target.classList.add('active')
            e.target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
            this.setAttribute('value', e.detail.value)
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true,
                composed: true
            }))
            previousOption = e.target;
        })
        slot.addEventListener('slotchange', e => {
            if (slot.assignedElements()[0]) {
                let firstElement = slot.assignedElements()[0];
                this.setAttribute('value', firstElement.getAttribute('value'))
                firstElement.classList.add('active')
                previousOption = firstElement;
            }
        });
    }
})

// sm-option
const smStripOption = document.createElement('template')
smStripOption.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }     
            :host{
                display: flex;
            }
            .sm-option{
                padding: 0.4rem 0.8rem;
                cursor: pointer;
                overflow-wrap: break-word;
                outline: none;
                border-radius: 2rem;
                text-transform: capitalize;
                border: solid 1px rgba(var(--text), .3);
                opacity: 0.9;
            }
            .sm-option:focus{
                background: rgba(var(--text), 0.1);
            }

            @media (hover: hover){
                .sm-option{
                    transition: background 0.3s;
                }
                .sm-option:hover{
                    background: rgba(var(--text), 0.1);
                }
            }
        </style>
        <div class="sm-option" tabindex="0">
            <slot></slot> 
        </div>`;
customElements.define('sm-strip-option', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smStripOption.content.cloneNode(true))
    }
    connectedCallback() {
        this.addEventListener('click', e => {
            let optionSelected = new CustomEvent('optionSelected', {
                bubbles: true,
                composed: true,
                detail: {
                    text: this.textContent,
                    value: this.getAttribute('value')
                }
            })
            this.dispatchEvent(optionSelected)
        })
        if (this.hasAttribute('default')) {
            setTimeout(() => {
                let optionSelected = new CustomEvent('optionSelected', {
                    bubbles: true,
                    composed: true,
                    detail: {
                        text: this.textContent,
                        value: this.getAttribute('value')
                    }
                })
                this.dispatchEvent(optionSelected)
            }, 0);
        }
    }
})

//popup
const smPopup = document.createElement('template')
smPopup.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    } 
    :host{
        display: grid;
    }
    .popup-container{
        display: grid;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        place-items: center;
        background: #00000060;
        z-index: 10;
        transition: opacity 0.3s ease;
    }
    .popup{
        flex-direction: column;
        align-self: flex-end;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        border-radius: 0.5rem 0.5rem 0 0;
        position: relative;
        display: flex;
        transform: translateY(100%);
        transition: transform 0.3s;
        background: rgba(var(--foreground), 1);
        box-shadow: 0 -1rem 2rem #00000020;
        overflow-y: auto;
        max-height: 100%;
    }
    .container-header{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(var(--text), 0.3);
    }
    .popup-top{
        display: flex;
        width: 100%;
    }
    .heading{
        font-weight: 400;
    }
    .heading:first-letter{
        text-transform: uppercase;
    }
    .hide{
        opacity: 0;
        pointer-events: none;
    }
    .icon {
        fill: none;
        height: 1.6rem;
        width: 1.6rem;
        padding: 0.4rem;
        stroke: rgba(var(--text), 0.7);
        stroke-width: 8;
        overflow: visible;
        stroke-linecap: round;
        border-radius: 1rem;
        stroke-linejoin: round;
        cursor: pointer;
        min-width: 0;
        -webkit-tap-highlight-color: transparent;
    }
    @media screen and (min-width: 640px){
        .popup{
            width: 24rem;
            align-self: center;
            border-radius: 0.4rem;
            height: auto;
            transform: translateY(0) scale(0.9);
            box-shadow: 0 2rem 2rem #00000040;
        }
        .container-header{
            padding: 1.2rem 1.5rem;
        }
    }
    @media screen and (max-width: 640px){
        .popup-top{
            flex-direction: column;
            align-items: center;
        }
        .handle{
            height: 0.3rem;
            width: 2rem;
            background: rgba(var(--text), .2);
            border-radius: 1rem;
            margin: 0.5rem 0;
        }
        .heading{
            padding: 1rem 1.5rem
        }
        .close{
            height: 2rem;
            width: 2rem;
            padding: 0.55rem;
            margin-right: 1rem;
        }
    }
</style>
<div class="popup-container hide">
    <div class="popup">
        <div class="popup-top">
            <div class="handle"></div>
            <div class="container-header">
                <h3 class="heading"></h3>
                <svg class="icon close" viewBox="0 0 64 64">
                    <title>Close</title>
                    <line x1="64" y1="0" x2="0" y2="64"/>
                    <line x1="64" y1="64" x2="0" y2="0"/>
                </svg>
            </div>
        </div>
        <slot></slot>
    </div>
</div>
`;
customElements.define('sm-popup', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smPopup.content.cloneNode(true))
    }

    show() {
        this.popupContainer.classList.remove('hide')
        if (window.innerWidth < 648)
            this.popup.style.transform = 'translateY(0)';
        else
            this.popup.style.transform = 'scale(1)';
        document.body.setAttribute('style', `overflow: hidden; top: -${window.scrollY}px`)
    }
    hide() {
        this.popupContainer.classList.add('hide')
        if (window.innerWidth < 648)
            this.popup.style.transform = 'translateY(100%)';
        else
            this.popup.style.transform = 'scale(0.9)';
        const scrollY = document.body.style.top;
        document.body.setAttribute('style', `overflow: auto; top: initial`)
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    handleTouchStart = (e) => {
        this.touchStartY = e.changedTouches[0].clientY
        this.popup.style.transition = 'initial'
        this.touchStartTime = e.timeStamp
    }

    handleTouchMove = (e) => {
        if (this.touchStartY < e.changedTouches[0].clientY) {
            this.offset = e.changedTouches[0].clientY - this.touchStartY;
            this.touchEndAnimataion = window.requestAnimationFrame(this.movePopup)
        }
        /*else {
        offset = touchStartY - e.changedTouches[0].clientY;
        this.popup.style.transform = `translateY(-${offset}px)`
    }*/
    }

    handleTouchEnd = (e) => {
        this.touchEndTime = e.timeStamp
        cancelAnimationFrame(this.touchEndAnimataion)
        this.touchEndY = e.changedTouches[0].clientY
        this.popup.style.transition = 'transform 0.3s'
        if (this.touchEndTime - this.touchStartTime > 200) {
            if (this.touchEndY - this.touchStartY > this.threshold) {
                this.hide()
            }
            else {
                this.show()
            }
        }
        else {
            if (this.touchEndY > this.touchStartY)
                this.hide()
        }
    }

    movePopup = () => {
        this.popup.style.transform = `translateY(${this.offset}px)`
    }

    connectedCallback() {
        this.popupContainer = this.shadowRoot.querySelector('.popup-container')
        this.popup = this.shadowRoot.querySelector('.popup')
        this.offset
        this.popupHeader = this.shadowRoot.querySelector('.popup-top')
        this.touchStartY = 0
        this.touchEndY = 0
        this.touchStartTime = 0
        this.touchEndTime = 0
        this.threshold = this.popup.getBoundingClientRect().height * 0.3
        this.touchEndAnimataion;
        
        if (this.hasAttribute('heading'))
            this.shadowRoot.querySelector('.heading').textContent = this.getAttribute('heading')
                
        this.popupContainer.addEventListener('mousedown', e => {
            if (e.target === this.popupContainer) {
                this.hide()
            }
        })

        this.shadowRoot.querySelector('.close').addEventListener('click', e => {
            this.hide()
        })

        this.popupHeader.addEventListener('touchstart', this.handleTouchStart)
        this.popupHeader.addEventListener('touchmove', this.handleTouchMove)
        this.popupHeader.addEventListener('touchend', this.handleTouchEnd)
    }
    disconnectedCallback() {
        this.popupHeader.removeEventListener('touchstart', this.handleTouchStart)
        this.popupHeader.removeEventListener('touchmove', this.handleTouchMove)
        this.popupHeader.removeEventListener('touchend', this.handleTouchEnd)
    }
})

//carousel

const smCarousel = document.createElement('template')
smCarousel.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    } 
    :host{
        display: flex;
    }
    .icon {
        position: absolute;
        display: flex;
        fill: none;
        height: 2.6rem;
        width: 2.6rem;
        border-radius: 3rem;
        padding: 0.9rem;
        stroke: rgba(var(--text), 0.7);
        stroke-width: 10;
        overflow: visible;
        stroke-linecap: round;
        stroke-linejoin: round;
        cursor: pointer;
        min-width: 0;
        z-index: 1;
        background: rgba(var(--foreground), 1);
        box-shadow: 0 0.2rem 0.2rem #00000020,
                    0 0.5rem 1rem #00000040; 
        -webkit-tap-highlight-color: transparent;
        transition: transform 0.3s; 
    }
    .hide{
        pointer-events: none;
        opacity: 0;
    }
    .shrink{
        transform: scale(0)
    }
    .previous-item{
        left: -1.3rem;
    }
    .next-item{
        right: -1.3rem;
    }
    .left,.right{
        position: absolute;
        width: 2rem;
        height: 100%; 
        transition: opacity 0.3s;
    }
    .left{
        background: linear-gradient(to left, transparent, rgba(var(--foreground), 0.6))
    }
    .right{
        right: 0;
        background: linear-gradient(to right, transparent, rgba(var(--foreground), 0.6))
    }
    .carousel-container{
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
    }
    .carousel{
        display: flex;
        max-width: 100%;
        overflow: auto hidden;
        scroll-snap-type: x mandatory;
    }
    slot::slotted(*){
        scroll-snap-align: center;
    }
    :host([align-items="start"]) slot::slotted(*){
        scroll-snap-align: start;
    }
    :host([align-items="center"]) slot::slotted(*){
        scroll-snap-align: center;
    }
    :host([align-items="end"]) slot::slotted(*){
        scroll-snap-align: end;
    }
    @media screen and (min-width: 640px){
        
    }
    @media (hover: hover){
        .carousel{
            overflow: hidden;
        }
        .left,.right{
            display: none;
        }
    }
    @media (hover: none){
        .carousel{
            overflow: auto none;
        }
        .icon{
            display: none;
        }
        .left,.right{
            display: block;
        }
    }
</style>
<div class="carousel-container">
    <div class="left"></div>
    <svg class="icon previous-item hide" viewBox="4 0 64 64">
        <title>Previous</title>
        <polyline points="48.01 0.35 16.35 32 48.01 63.65"/>
    </svg>
    <div class="carousel">
        <slot></slot>
    </div>
    <svg class="icon next-item hide" viewBox="-6 0 64 64">
        <title>Next</title>
        <polyline points="15.99 0.35 47.65 32 15.99 63.65"/>
    </svg>
    <div class="right"></div>
</div>
`;

customElements.define('sm-carousel', class extends HTMLElement{
    constructor() {
        super()
        this.shadow = this.attachShadow({ mode: 'open' }).append(smCarousel.content.cloneNode(true))
    }

    scrollLeft = () => {
        this.carousel.scrollBy({
            top: 0,
            left: -this.scrollDistance,
            behavior: 'smooth'
        })
    }

    scrollRight = () => {
        this.carousel.scrollBy({
            top: 0,
            left: this.scrollDistance,
            behavior: 'smooth'
        })
    }

    connectedCallback() {
        this.carousel = this.shadowRoot.querySelector('.carousel')
        this.carouselContainer = this.shadowRoot.querySelector('.carousel-container')
        this.carouselSlot = this.shadowRoot.querySelector('slot')
        this.nextArrow = this.shadowRoot.querySelector('.next-item')
        this.previousArrow = this.shadowRoot.querySelector('.previous-item')
        this.nextGradient = this.shadowRoot.querySelector('.right')
        this.previousGradient = this.shadowRoot.querySelector('.left')
        this.carouselItems
        this.scrollDistance = this.carouselContainer.getBoundingClientRect().width/3
        const firstElementObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting){
                this.previousArrow.classList.add('hide', 'shrink')
                this.previousGradient.classList.add('hide')
            }
            else {
                this.previousArrow.classList.remove('hide', 'shrink')
                this.previousGradient.classList.remove('hide')
            }
        }, {
            root: this.carouselContainer,
            threshold: 0.9
        })        
        const lastElementObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting){
                this.nextArrow.classList.add('hide', 'shrink')
                this.nextGradient.classList.add('hide')
            }
            else{
                this.nextArrow.classList.remove('hide', 'shrink')
                this.nextGradient.classList.remove('hide')
            }
        }, {
            root: this.carouselContainer,
            threshold: 0.9
        })        
        
        this.carouselSlot.addEventListener('slotchange', e => {
            this.carouselItems = this.carouselSlot.assignedElements()
            firstElementObserver.observe(this.carouselItems[0])
            lastElementObserver.observe(this.carouselItems[this.carouselItems.length - 1])
        })

        this.nextArrow.addEventListener('click', this.scrollRight)
        this.previousArrow.addEventListener('click', this.scrollLeft)
    }

    disconnectedCallback() {
        this.nextArrow.removeEventListener('click', this.scrollRight)
        this.previousArrow.removeEventListener('click', this.scrollLeft)
    }
})