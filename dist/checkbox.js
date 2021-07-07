const smCheckbox = document.createElement('template')
smCheckbox.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        -webkit-box-sizing: border-box;
                box-sizing: border-box;
    } 
    :host{
        display: -webkit-inline-box;
        display: -ms-inline-flexbox;
        display: inline-flex;
        --height: 1.6rem;
        --width: 1.6rem;
        --border-radius: 0.2rem;
        --border-color: rgba(var(--text-color), 0.7);
    }
    :host([disabled]) {
        opacity: 0.6;
        pointer-events: none;
    }
    .checkbox {
        position: relative;
        display:-webkit-box;
        display:-ms-flexbox;
        display:flex;
        -webkit-box-align: center;
            -ms-flex-align: center;
                align-items: center;
        cursor: pointer;
        height: 1.5rem;
        outline: none;
        -webkit-tap-highlight-color: transparent;
    }
    
    .checkbox:active .icon,
    .checkbox:focus-within .icon{
        box-shadow: 0 0 0 0.3rem var(--accent-color) inset;
    }
    
    .checkbox input {
        display: none;
    }
    
    .checkbox .checkmark {
        stroke-dashoffset: -65;
        stroke-dasharray: 65;
        -webkit-transition: stroke-dashoffset 0.3s; 
        -o-transition: stroke-dashoffset 0.3s; 
        transition: stroke-dashoffset 0.3s;
    }
    
    .checkbox input:checked ~ svg .checkmark {
        stroke-dashoffset: 0;
        stroke: rgba(var(--foreground-color), 1);
    }
    .checkbox input:checked ~ .icon {
        stroke-width: 8; 
        stroke: var(--accent-color);
        background: var(--accent-color);
    }
    .checkbox input:not(:checked) ~ .icon {
        box-shadow: 0 0 0 0.2rem var(--border-color) inset;
    }
    
    .icon {
        fill: none;
        height: var(--height);
        width: var(--width);
        padding: 0.2rem;
        stroke: rgba(var(--text-color), 0.7);
        stroke-width: 6;
        overflow: visible;
        stroke-linecap: round;
        stroke-linejoin: round;
        -webkit-transition: background 0.3s;
        -o-transition: background 0.3s;
        transition: background 0.3s;
        border-radius: var(--border-radius);
    }
</style>
<label class="checkbox" tabindex="0">
    <input type="checkbox">
    <svg class="icon" viewBox="0 0 64 64">
        <title>checkbox</title>
        <path class="checkmark" d="M50.52,19.56,26,44.08,13.48,31.56" />
    </svg>
    <slot></slot>
</label>`
customElements.define('sm-checkbox', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smCheckbox.content.cloneNode(true))

        this.checkbox = this.shadowRoot.querySelector('.checkbox');
        this.input = this.shadowRoot.querySelector('input')

        this.isChecked = false
        this.isDisabled = false
    }

    static get observedAttributes() {
        return ['disabled', 'checked']
    }

    get disabled() {
        return this.isDisabled
    }

    set disabled(val) {
        if (val) {
            this.setAttribute('disabled', '')
        } else {
            this.removeAttribute('disabled')
        }
    }

    get checked() {
        return this.isChecked
    }

    set checked(value) {
        if (value) {
            this.setAttribute('checked', '')
        }
        else {
            this.removeAttribute('checked')
        }
    }

    set value(val) {
        this.val = val
        this.setAttribute('value', value)
    }

    get value() {
        return getAttribute('value')
    }

    dispatch = () => {
        this.dispatchEvent(new CustomEvent('change', {
            bubbles: true,
            composed: true
        }))
    }
    handleKeyup = e => {
        if ((e.code === "Enter" || e.code === "Space") && this.isDisabled == false) {
            if (this.hasAttribute('checked')) {
                this.input.checked = false
                this.removeAttribute('checked')
            }
            else {
                this.input.checked = true
                this.setAttribute('checked', '')
            }
        }
    }
    handleChange = e => {
        if (this.input.checked) {
            this.setAttribute('checked', '')
        }
        else {
            this.removeAttribute('checked')
        }
    }
    
    connectedCallback() {
        this.val = ''
        this.addEventListener('keyup', this.handleKeyup)
        this.input.addEventListener('change', this.handleChange)
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === 'disabled') {
                if (newValue === 'true') {
                    this.isDisabled = true
                } else {
                    this.isDisabled = false
                }
            }
            else if (name === 'checked') {
                if (this.hasAttribute('checked')) {
                    this.isChecked = true
                    this.input.checked = true
                }
                else {
                    this.input.checked = false
                    this.isChecked = false
                }
                this.dispatch()
            }
        }
    }
    disconnectedCallback() {
        this.removeEventListener('keyup', this.handleKeyup)
        this.removeEventListener('change', this.handleChange)
    }
})