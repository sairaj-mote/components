smForm.innerHTML = `
    <style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }
    :host{
        --gap: 1rem;
        width: 100%;
    }
    form{
        display: grid;
        gap: var(--gap);
        width: 100%;
    }
    </style>
	<form onsubmit="return false">
		<slot></slot>
	</form>
`

customElements.define('sm-form', class extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({
			mode: 'open'
		}).append(smForm.content.cloneNode(true))

		this.form = this.shadowRoot.querySelector('form')
		this.formElements
		this.requiredElements
		this.submitButton
		this.resetButton
		this.allRequiredValid = false
	}
	debounce = (callback, wait) => {
		let timeoutId = null;
		return (...args) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => {
				callback.apply(null, args);
			}, wait);
		};
	}
	handleInput = this.debounce((e) => {
		this.allRequiredValid = this.requiredElements.every(elem => elem.isValid)
		if (!this.submitButton) return;
		if (this.allRequiredValid) {
			this.submitButton.disabled = false;
		}
		else {
			this.submitButton.disabled = true;
		}
	}, 100)
	handleKeydown = this.debounce((e) => {
		if (e.key === 'Enter') {
			if (this.allRequiredValid) {
				this.submitButton.click()
			}
			else {
				// implement show validity logic 
			}
		}
	}, 100)
	reset = () => {
		this.formElements.forEach(elem => elem.reset())
	}
	connectedCallback() {
		const slot = this.shadowRoot.querySelector('slot')
		slot.addEventListener('slotchange', e => {
			this.formElements = [...this.querySelectorAll('sm-input, sm-textarea, sm-checkbox, tags-input, file-input, sm-switch, sm-checkbox')]
			this.requiredElements = this.formElements.filter(elem => elem.hasAttribute('required'))
			this.submitButton = e.target.assignedElements().find(elem => elem.getAttribute('variant') === 'primary' || elem.getAttribute('type') === 'submit');
			this.resetButton = e.target.assignedElements().find(elem => elem.getAttribute('type') === 'reset');
            if (this.resetButton) {
				this.resetButton.addEventListener('click', this.reset)
			}
		})
		this.addEventListener('input', this.handleInput)
		this.addEventListener('keydown', this.handleKeydown)
	}
	disconnectedCallback() {
		this.removeEventListener('input', this.handleInput)
	}
})
