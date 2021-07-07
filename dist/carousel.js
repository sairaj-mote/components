const smCarousel = document.createElement('template')
smCarousel.innerHTML = `
<style>
*{
    padding: 0;
    margin: 0;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
} 
:host{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    --arrow-left: 1rem;
    --arrow-right: 1rem;
    --arrow-top: auto;
    --arrow-bottom: auto;
    --arrow-fill: rgba(var(--foreground-color), 1);
    --arrow-background: rgba(var(--text-color), 1);
    --arrow-box-shadow: 0 0.2rem 0.2rem #00000020, 0 0.5rem 1rem #00000040;
    --indicator-top: auto;
    --indicator-bottom: -1rem;
    --active-indicator-color: var(--accent-color);
}
.carousel__button{
    position: absolute;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    cursor: pointer;
    min-width: 0;
    top:  var(--arrow-top);
    bottom:  var(--arrow-bottom);
    border: none;
    background: var(--arrow-background);
    -webkit-box-shadow: var(--arrow-box-shadow);
            box-shadow:  var(--arrow-box-shadow); 
    -webkit-tap-highlight-color: transparent;
    -webkit-transform: scale(0);
        -ms-transform: scale(0);
            transform: scale(0);
    z-index: 1;
    border-radius: 3rem;
    padding: 0.5rem;
}
.carousel__button:active{
    background: rgba(var(--text-color), 0.1);
}
button:focus{
    outline: none;
}
button:focus-visible{
    outline: rgba(var(--text-color), 1) 0.1rem solid;
}
.carousel__button--left{
    left: var(--arrow-left);
}
.carousel__button--right{
    right: var(--arrow-right);
}
.icon {
    height: 1.5rem;
    width: 1.5rem;
    fill: var(--arrow-fill);
}
.hide{
    pointer-events: none;
    opacity: 0;
}
.expand{
    -webkit-transform: scale(1);
        -ms-transform: scale(1);
            transform: scale(1)
}
.carousel-container{
    position: relative;
    display: grid;
    width: 100%;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
}
.carousel{
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    max-width: 100%;
    width: 100%;
    overflow: auto hidden;
    -ms-scroll-snap-type: x mandatory;
        scroll-snap-type: x mandatory;
}
.indicators{
    display: -ms-grid;
    display: grid;
    grid-auto-flow: column;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    position: absolute;
    top: var(--indicator-top);
    bottom: var(--indicator-bottom);
    gap: 0.5rem;
    width: 100%;
}
.dot{
    position: relative;
    padding: 0.2rem;
    background: rgba(var(--text-color), 0.3);
    border-radius: 1rem;
    -webkit-transition: 0.2s;
    -o-transition: 0.2s;
    transition: 0.2s;
    cursor: pointer;
}
.dot.active{
    -webkit-transform: scale(1.5);
        -ms-transform: scale(1.5);
            transform: scale(1.5);
    background: var(--active-indicator-color);
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
@media (hover: hover){
    .carousel{
        overflow: hidden;
    }
    .left,.right{
        display: none;
    }
    .carousel__button:hover{
        background: rgba(var(--text-color), 0.06);
    }
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
    .carousel{
        overflow: auto none;
    }
    .carousel__button{
        display: none;
    }
    .left,.right{
        display: block;
    }
}
</style>
<div class="carousel-container">
    <button class="carousel__button carousel__button--left">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/></svg>
    </button>
    <div part="carousel" class="carousel">
        <slot></slot>
    </div>
    <button class="carousel__button carousel__button--right">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="none" d="M0 0h24v24H0z"/><path d="M13.172 12l-4.95-4.95 1.414-1.414L16 12l-6.364 6.364-1.414-1.414z"/></svg>
    </button>
    <div class="indicators"></div>
</div>
`;

customElements.define('sm-carousel', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({
            mode: 'open'
        }).append(smCarousel.content.cloneNode(true))

        this.isAutoPlaying = false
        this.autoPlayInterval = 5000
        this.autoPlayTimeout
        this.initialTimeout
        this.activeSlideNum = 0
        this.carouselItems
        this.indicators
        this.showIndicator = false
        this.carousel = this.shadowRoot.querySelector('.carousel')
        this.carouselContainer = this.shadowRoot.querySelector('.carousel-container')
        this.carouselSlot = this.shadowRoot.querySelector('slot')
        this.nextArrow = this.shadowRoot.querySelector('.carousel__button--right')
        this.previousArrow = this.shadowRoot.querySelector('.carousel__button--left')
        this.indicatorsContainer = this.shadowRoot.querySelector('.indicators')
    }

    static get observedAttributes() {
        return ['indicator', 'autoplay', 'interval']
    }

    scrollLeft = () => {
        this.carousel.scrollBy({
            left: -this.scrollDistance,
            behavior: 'smooth'
        })
    }

    scrollRight = () => {
        this.carousel.scrollBy({
            left: this.scrollDistance,
            behavior: 'smooth'
        })
    }

    handleIndicatorClick = (e) => {
        if (e.target.closest('.dot')) {
            const slideNum = parseInt(e.target.closest('.dot').dataset.rank)
            if (this.activeSlideNum !== slideNum) {
                this.showSlide(slideNum)
            }
        }
    }

    showSlide = (slideNum) => {
        this.carousel.scrollTo({
            left: (this.carouselItems[slideNum].getBoundingClientRect().left - this.carousel.getBoundingClientRect().left + this.carousel.scrollLeft),
            behavior: 'smooth'
        })
    }

    nextSlide = () => {
        if (!this.carouselItems) return
        let showSlideNo = (this.activeSlideNum + 1) < this.carouselItems.length ? this.activeSlideNum + 1 : 0
        this.showSlide(showSlideNo)
    }
    
    autoPlay = () => {
        this.nextSlide()
        if (this.isAutoPlaying) {
            this.autoPlayTimeout = setTimeout(() => {
                this.autoPlay()
            }, this.autoPlayInterval);
        }
    }

    startAutoPlay = () => {
        this.setAttribute('autoplay', '')
    }

    stopAutoPlay = () => {
        this.removeAttribute('autoplay')
    }

    connectedCallback() {
        this.scrollDistance = this.carouselContainer.getBoundingClientRect().width / 3
        let frag = document.createDocumentFragment();
        if (this.hasAttribute('indicator'))
            this.showIndicator = true


        let firstVisible = false,
            lastVisible = false
        const allElementsObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (this.showIndicator) {                    
                    const activeRank = parseInt(entry.target.dataset.rank)
                    if (entry.isIntersecting) {
                        this.indicators[activeRank].classList.add('active')
                        this.activeSlideNum = activeRank
                    }
                    else
                        this.indicators[activeRank].classList.remove('active')
                }
                if (!entry.target.previousElementSibling)
                    if (entry.isIntersecting) {
                        this.previousArrow.classList.remove('expand')
                        firstVisible = true
                    }
                else {
                    this.previousArrow.classList.add('expand')
                    firstVisible = false
                }
                if (!entry.target.nextElementSibling)
                    if (entry.isIntersecting) {
                        this.nextArrow.classList.remove('expand')
                        lastVisible = true
                    }
                else {
                    this.nextArrow.classList.add('expand')
                    lastVisible = false
                }
                if (firstVisible && lastVisible)
                    this.indicatorsContainer.classList.add('hide')
                else
                    this.indicatorsContainer.classList.remove('hide')
            })
        }, {
            root: this.carouselContainer,
            threshold: 0.9
        })

        const carouselObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.scrollDistance = this.carouselContainer.getBoundingClientRect().width / 3
            }
        })

        carouselObserver.observe(this.carouselContainer)

        this.carouselSlot.addEventListener('slotchange', e => {
            this.carouselItems = this.carouselSlot.assignedElements()
            this.carouselItems.forEach(item => allElementsObserver.observe(item))
            if (this.showIndicator) {
                this.indicatorsContainer.innerHTML = ``
                this.carouselItems.forEach((item, index) => {
                    let dot = document.createElement('div')
                    dot.classList.add('dot')
                    dot.dataset.rank = index
                    frag.append(dot)
                    item.dataset.rank = index
                })
                this.indicatorsContainer.append(frag)
                this.indicators = this.indicatorsContainer.children
            }
        })

        this.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft')
                this.scrollRight()
            else if (e.code === 'ArrowRight')
                this.scrollRight()
        })

        this.nextArrow.addEventListener('click', this.scrollRight)
        this.previousArrow.addEventListener('click', this.scrollLeft)
        this.indicatorsContainer.addEventListener('click', this.handleIndicatorClick)
    }

    async attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {            
            if (name === 'indicator') {
                if (this.hasAttribute('indicator'))
                    this.showIndicator = true
                else
                    this.showIndicator = false
                }
            if (name === 'autoplay') {
                if (this.hasAttribute('autoplay')) {
                    this.initialTimeout = setTimeout(() => {
                        this.isAutoPlaying = true
                        this.autoPlay()
                    }, this.autoPlayInterval);
                }
                else {
                    this.isAutoPlaying = false
                    clearTimeout(this.autoPlayTimeout)
                    clearTimeout(this.initialTimeout)
                }
                
            }
            if (name === 'interval') {
                if (this.hasAttribute('interval') && this.getAttribute('interval').trim() !== '') {
                    this.autoPlayInterval = Math.abs(parseInt(this.getAttribute('interval').trim()))
                }
                else {
                    this.autoPlayInterval = 5000
                }
            }
        }
    }

    disconnectedCallback() {
        this.nextArrow.removeEventListener('click', this.scrollRight)
        this.previousArrow.removeEventListener('click', this.scrollLeft)
        this.indicatorsContainer.removeEventListener('click', this.handleIndicatorClick)
    }
})