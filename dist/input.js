const smInput = document.createElement('template')
smInput.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
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
input::-ms-reveal,
input::-ms-clear {
  display: none;
}
input:invalid{
    outline: none;
    -webkit-box-shadow: none;
            box-shadow: none;
}
::-moz-focus-inner{
border: none;
}
:host{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    --width: 100%;
    --font-size: 1rem;
    --icon-gap: 0.5rem;
    --border-radius: 0.3rem;
    --padding: 0.7rem 1rem;
    --background: rgba(var(--text-color), 0.06);
}
.hide{
   opacity: 0 !important;
   pointer-events: none !important;
}
.hide-completely{
    display: none;
}
.icon {
    fill: rgba(var(--text-color), 0.6);
    height: 1.4rem;
    width: 1.4rem;
    border-radius: 1rem;
    cursor: pointer;
    min-width: 0;
}

:host(.round) .input{
    border-radius: 10rem;
}
.input {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    cursor: text;
    min-width: 0;
    text-align: left;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    position: relative;
    gap: var(--icon-gap);
    padding: var(--padding);
    border-radius: var(--border-radius);
    -webkit-transition: opacity 0.3s;
    -o-transition: opacity 0.3s;
    transition: opacity 0.3s;
    background: var(--background);
    width: 100%;
    outline: none;
}
.input.readonly .clear{
    opacity: 0 !important;
    margin-right: -2rem;
    pointer-events: none !important;
}
.readonly{
    pointer-events: none;
}
.input:focus-within:not(.readonly){
    box-shadow: 0 0 0 0.1rem var(--accent-color) inset !important;
}
.disabled{
    pointer-events: none;
    opacity: 0.6;
}
.label {
    opacity: .7;
    font-weight: 400;
    font-size: var(--font-size);
    position: absolute;
    top: 0;
    -webkit-transition: -webkit-transform 0.3s;
    transition: -webkit-transform 0.3s;
    -o-transition: transform 0.3s;
    transition: transform 0.3s;
    transition: transform 0.3s, -webkit-transform 0.3s;
    -webkit-transform-origin: left;
    -ms-transform-origin: left;
        transform-origin: left;
    pointer-events: none;
    white-space: nowrap;
    overflow: hidden;
    -o-text-overflow: ellipsis;
       text-overflow: ellipsis;
    width: 100%;
    user-select: none;
    will-change: transform;
}
.outer-container{
    position: relative;
    width: var(--width);
}
.container{
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    position: relative;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-flex: 1;
        -ms-flex: 1;
            flex: 1;
}    
input{
    font-size: var(--font-size);
    border: none;
    background: transparent;
    outline: none;
    color: rgba(var(--text-color), 1);
    width: 100%;
}
:host(:not(.outlined)) .animate-label .container input {
    -webkit-transform: translateY(0.6rem);
            -ms-transform: translateY(0.6rem);
        transform: translateY(0.6rem);
    }
  
:host(:not(.outlined)) .animate-label .label {
    -webkit-transform: translateY(-0.7em) scale(0.8);
            -ms-transform: translateY(-0.7em) scale(0.8);
        transform: translateY(-0.7em) scale(0.8);
    opacity: 1;
    color: var(--accent-color)
}
:host(.outlined) .input {
    box-shadow: 0 0 0 0.1rem rgba(var(--text-color), 0.4) inset;
    background: rgba(var(--foreground-color), 1);
}
:host(.outlined) .label {
    width: max-content;
    margin-left: -0.5rem;
    padding: 0 0.5rem;
}
:host(.outlined) .animate-label .label {
    -webkit-transform: translate(0.1rem, -1.5rem) scale(0.8);
            -ms-transform: translate(0.1rem, -1.5rem) scale(0.8);
        transform: translate(0.1rem, -1.5rem) scale(0.8);
    opacity: 1;
    background: rgba(var(--foreground-color), 1);
}
.animate-label:focus-within:not(.readonly) .label{
    color: var(--accent-color)
}
.feedback-text{
    font-size: 0.9rem;
    width: 100%;
    color: var(--error-color);
    padding: 0.6rem 1rem;
    text-align: left;
}
.feedback-text:empty{
    padding: 0;
}
@media (any-hover: hover){
    .icon:hover{
        background: rgba(var(--text-color), 0.1);
    }
}
</style>
<div class="outer-container">
    <label part="input" class="input">
        <slot name="icon"></slot>
        <div class="container">
            <input/>
            <div part="placeholder" class="label"></div>
        </div>
        <svg class="icon clear hide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-11.414L9.172 7.757 7.757 9.172 10.586 12l-2.829 2.828 1.415 1.415L12 13.414l2.828 2.829 1.415-1.415L13.414 12l2.829-2.828-1.415-1.415L12 10.586z"/></svg>
    </label>
    <div class="feedback-text"></div>
</div>
`;
customElements.define('sm-input',
    class extends HTMLElement {

        constructor() {
            super()
            this.attachShadow({
                mode: 'open'
            }).append(smInput.content.cloneNode(true))

            this.inputParent = this.shadowRoot.querySelector('.input')
            this.input = this.shadowRoot.querySelector('input')
            this.clearBtn = this.shadowRoot.querySelector('.clear')
            this.label = this.shadowRoot.querySelector('.label')
            this.feedbackText = this.shadowRoot.querySelector('.feedback-text')
            this.validationFunction
            this.observeList = ['type', 'required', 'disabled', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step']
        
            this.reset = this.reset.bind(this)
            this.setValidity = this.setValidity.bind(this)
            this.showValidity = this.showValidity.bind(this)
            this.hideValidity = this.hideValidity.bind(this)
            this.focusIn = this.focusIn.bind(this)
            this.focusOut = this.focusOut.bind(this)
            this.fireEvent = this.fireEvent.bind(this)
            this.debounce = this.debounce.bind(this)
            this.checkInput = this.checkInput.bind(this)
        }

        static get observedAttributes() {
            return ['placeholder', 'type', 'required', 'disabled', 'readonly', 'min', 'max', 'pattern', 'minlength', 'maxlength', 'step']
        }

        get value() {
            return this.input.value
        }

        set value(val) {
            this.input.value = val;
            this.checkInput()
            this.fireEvent()
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

        set type(val) {
            this.setAttribute('type', val)
        }

        get isValid() {
            if (this.customValidation) {
                return this.validationFunction(this.input.value)
            }
            else {
                return this.input.checkValidity()
            }
        }

        get validity() {
            return this.input.validity
        }

        set disabled(value) {
            if (value)
                this.inputParent.classList.add('disabled')
            else
                this.inputParent.classList.remove('disabled')
        }
        set readOnly(value) {
            if (value) {
                this.setAttribute('readonly', '')
            } else {
                this.removeAttribute('readonly')
            }
        }
        set customValidation(val) {
            this.validationFunction = val
        }
        reset(){
            this.value = ''
        }

        setValidity(message){
            this.feedbackText.textContent = message
        }

        showValidity(){
            this.feedbackText.classList.remove('hide-completely')
        }

        hideValidity(){
            this.feedbackText.classList.add('hide-completely')
        }

        focusIn(){
            this.input.focus()
        }

        focusOut(){
            this.input.blur()
        }

        fireEvent(){
            let event = new Event('input', {
                bubbles: true,
                cancelable: true,
                composed: true
            });
            this.dispatchEvent(event);
        }
        debounce(callback, wait){
            let timeoutId = null;
            return (...args) => {
                window.clearTimeout(timeoutId);
                timeoutId = window.setTimeout(() => {
                    callback.apply(null, args);
                }, wait);
            };
        }

        checkInput(e){
            if (!this.hasAttribute('readonly')) {
                if (this.input.value !== '') {
                    this.clearBtn.classList.remove('hide')
                } else {
                    this.clearBtn.classList.add('hide')
                }
            }
            if (!this.hasAttribute('placeholder') || this.getAttribute('placeholder') === '') return;
            if (this.input.value !== '') {
                if (this.animate)
                    this.inputParent.classList.add('animate-label')
                else
                    this.label.classList.add('hide')
            } else {
                if (this.animate)
                    this.inputParent.classList.remove('animate-label')
                else
                    this.label.classList.remove('hide')
            }
        }


        connectedCallback() {
            this.animate = this.hasAttribute('animate')
            if (this.hasAttribute('value')) {
                this.input.value = this.getAttribute('value')
                this.checkInput()
            }
            if (this.hasAttribute('error-text')) {
                this.feedbackText.textContent = this.getAttribute('error-text')
            }
            if (!this.hasAttribute('type')) {
                this.setAttribute('type', 'text')
            }

            this.input.addEventListener('input', this.checkInput)
            this.clearBtn.addEventListener('click', this.reset)
        }
        
        attributeChangedCallback(name, oldValue, newValue) {
            if (oldValue !== newValue) {
                if (this.observeList.includes(name)) {
                    if (this.hasAttribute(name)) {
                        this.input.setAttribute(name, this.getAttribute(name) ? this.getAttribute(name) : '')
                    }
                    else {
                        this.input.removeAttribute(name)
                    }
                }
                if (name === 'placeholder') {
                    this.label.textContent = newValue;
                    this.setAttribute('aria-label', newValue);
                }
                else if (name === 'type') {
                    if (this.hasAttribute('type') && this.getAttribute('type') === 'number') {
                        this.input.setAttribute('inputmode', 'numeric')
                    }
                }
                else if (name === 'readonly') {
                    if (this.hasAttribute('readonly')) {
                        this.inputParent.classList.add('readonly')
                    } else {
                        this.inputParent.classList.remove('readonly')
                    }
                }
                else if (name === 'disabled') {
                    if (this.hasAttribute('disabled')) {
                        this.inputParent.classList.add('disabled')
                    }
                    else {
                        this.inputParent.classList.remove('disabled')
                    }
                }
            }
        }
        disconnectedCallback() {
            this.input.removeEventListener('input', this.checkInput)
            this.clearBtn.removeEventListener('click', this.reset)
        }
    })