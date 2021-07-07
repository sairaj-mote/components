const smNotifications = document.createElement('template')
smNotifications.innerHTML = `
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
    }
    .hide{
        opacity: 0 !important;
        pointer-events: none !important;
    }
    .notification-panel{
        display: -ms-grid;
        display: grid;
        width: 100%;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 100;
        max-height: 100%;
        overflow: hidden auto;
        -ms-scroll-chaining: none;
            overscroll-behavior: contain;
        }
        .no-transformations{
        -webkit-transform: none;
            -ms-transform: none;
                transform: none;
        opacity: 1;
    }
    .notification-panel:empty{
        display:none;
    }
    .notification{
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        opacity: 0;
        padding: 1rem 1.5rem;
        margin-bottom: 0.5rem;
        -webkit-transform: translateY(-1rem);
            -ms-transform: translateY(-1rem);
                transform: translateY(-1rem);
        position: relative;
        border-radius: 0.3rem;
        -webkit-box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
                    0.5rem 1rem 2rem rgba(0, 0, 0, 0.1);
                box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.1),
                    0.5rem 1rem 2rem rgba(0, 0, 0, 0.1);
        background: rgba(var(--foreground-color), 1);
        -webkit-transition: height 0.3s, opacity 0.3s, -webkit-transform 0.3s;
        transition: height 0.3s, opacity 0.3s, -webkit-transform 0.3s;
        -o-transition: height 0.3s, transform 0.3s, opacity 0.3s;
        transition: height 0.3s, transform 0.3s, opacity 0.3s;
        transition: height 0.3s, transform 0.3s, opacity 0.3s, -webkit-transform 0.3s;
        overflow: hidden;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
        touch-action: none;
    }
    h4:first-letter,
    p:first-letter{
        text-transform: uppercase;
    }
    h4{
        font-weight: 400;
    }
    p{
        line-height: 1.6;
        -webkit-box-flex: 1;
            -ms-flex: 1;
                flex: 1;
        color: rgba(var(--text-color), 0.9);
        overflow-wrap: break-word;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        -ms-hyphens: auto;
        -webkit-hyphens: auto;
        hyphens: auto;
        max-width: 100%;
    }
    .notification:last-of-type{
        margin-bottom: 0;
    }
    .icon {
        fill: none;
        height: 1.6rem;
        width: 1.6rem;
        stroke: rgba(var(--text-color), 0.7);
        overflow: visible;
        stroke-linecap: round;
        border-radius: 1rem;
        stroke-linejoin: round;
        cursor: pointer;
    }
    .error-icon{
        stroke: #E53935;
    }
    .success-icon{
        stroke: #00C853;
    }
    .close{
        margin-left: 1rem;
        padding: 0.5rem;
        stroke-width: 10;
    }
    .notification-icon{
        height: 1.4rem;
        width: 1.4rem;
        margin: 0.3em 1rem 0 0;
        stroke-width: 6;
    }
    @media screen and (min-width: 640px){
        .notification-panel{
            max-width: 28rem;
            width: max-content;
            -webkit-box-pack: end;
                -ms-flex-pack: end;
            justify-content: flex-end;
        }
        .notification{
            -ms-grid-column-align: end;
                justify-self: end;
            width: auto;
            margin-right: 1.5rem;
            margin-bottom: 1rem;
            border-bottom: none;
            border: solid 1px rgba(var(--text-color), 0.2);
            -webkit-transform: translateX(1rem);
                -ms-transform: translateX(1rem);
                    transform: translateX(1rem);
        }
    }
    @media screen and (any-hover: none){
        .close{
            display: none
        }
    }
</style>
<div class="notification-panel"></div>
`

customElements.define('sm-notifications', class extends HTMLElement {
    constructor() {
        super()
        this.shadow = this.attachShadow({
            mode: 'open'
        }).append(smNotifications.content.cloneNode(true))
    }

    handleTouchStart = (e) => {
        this.notification = e.target.closest('.notification')
        this.touchStartX = e.changedTouches[0].clientX
        this.notification.style.transition = 'initial'
        this.touchStartTime = e.timeStamp
    }

    handleTouchMove = (e) => {
        e.preventDefault()
        if (this.touchStartX < e.changedTouches[0].clientX) {
            this.offset = e.changedTouches[0].clientX - this.touchStartX;
            this.touchEndAnimataion = requestAnimationFrame(this.movePopup)
        } else {
            this.offset = -(this.touchStartX - e.changedTouches[0].clientX);
            this.touchEndAnimataion = requestAnimationFrame(this.movePopup)
        }
    }

    handleTouchEnd = (e) => {
        this.notification.style.transition = 'transform 0.3s, opacity 0.3s'
        this.touchEndTime = e.timeStamp
        cancelAnimationFrame(this.touchEndAnimataion)
        this.touchEndX = e.changedTouches[0].clientX
        if (this.touchEndTime - this.touchStartTime > 200) {
            if (this.touchEndX - this.touchStartX > this.threshold) {
                this.removeNotification(this.notification)
            } else if (this.touchStartX - this.touchEndX > this.threshold) {
                this.removeNotification(this.notification, true)
            } else {
                this.resetPosition()
            }
        } else {
            if (this.touchEndX > this.touchStartX) {
                this.removeNotification(this.notification)
            } else {
                this.removeNotification(this.notification, true)
            }
        }
    }

    movePopup = () => {
        this.notification.style.transform = `translateX(${this.offset}px)`
    }

    resetPosition = () => {
        this.notification.style.transform = `translateX(0)`
    }

    push = (messageBody, type, pinned) => {
        let notification = document.createElement('div'),
            composition = ``
        notification.classList.add('notification')
        if (pinned)
            notification.classList.add('pinned')
        if (type === 'error') {
            composition += `
    <svg class="notification-icon icon error-icon" viewBox="0 0 64 64">
            <path d="M32,4.73a3.17,3.17,0,0,1,2.76,1.59l13.9,24.09L62.57,54.49a3.19,3.19,0,0,1-2.76,4.78H4.19a3.19,3.19,0,0,1-2.76-4.78L15.34,30.41,29.24,6.32A3.17,3.17,0,0,1,32,4.73m0-1a4.14,4.14,0,0,0-3.62,2.09L14.47,29.91.57,54a4.19,4.19,0,0,0,3.62,6.28H59.81A4.19,4.19,0,0,0,63.43,54L49.53,29.91,35.62,5.82A4.14,4.14,0,0,0,32,3.73Z"/>
            <line x1="32" y1="24" x2="32" y2="36"/>
            <line x1="32" y1="46" x2="32" y2="48"/>
    </svg>`
        } else if (type === 'success') {
            composition += `
        <svg class="notification-icon icon success-icon" viewBox="0 0 64 64">
            <polyline points="0.35 31.82 21.45 52.98 63.65 10.66"/>
        </svg>`
        }
        composition += `
                    <p>${messageBody}</p>
                    <svg class="icon close" viewBox="0 0 64 64">
                        <title>Close</title>
                        <line x1="64" y1="0" x2="0" y2="64"/>
                        <line x1="64" y1="64" x2="0" y2="0"/>
                    </svg>`
        notification.innerHTML = composition
        this.notificationPanel.prepend(notification)
        if (window.innerWidth > 640) {
            notification.animate([{
                    transform: `translateX(1rem)`,
                    opacity: '0'
                },
                {
                    transform: 'translateX(0)',
                    opacity: '1'
                }
            ], this.animationOptions).onfinish = () => {
                notification.setAttribute('style', `transform: none;`);
            }
        } else {
            notification.setAttribute('style', `transform: translateY(0); opacity: 1`)
        }
        notification.addEventListener('touchstart', this.handleTouchStart)
        notification.addEventListener('touchmove', this.handleTouchMove)
        notification.addEventListener('touchend', this.handleTouchEnd)
    }

    removeNotification = (notification, toLeft) => {
        if (!this.offset)
            this.offset = 0;

        if (toLeft)
            notification.animate([{
                    transform: `translateX(${this.offset}px)`,
                    opacity: '1'
                },
                {
                    transform: `translateX(-100%)`,
                    opacity: '0'
                }
            ], this.animationOptions).onfinish = () => {
                notification.remove()
            }
        else {
            notification.animate([{
                    transform: `translateX(${this.offset}px)`,
                    opacity: '1'
                },
                {
                    transform: `translateX(100%)`,
                    opacity: '0'
                }
            ], this.animationOptions).onfinish = () => {
                notification.remove()
            }
        }
    }

    clearAll = () => {
        Array.from(this.notificationPanel.children).forEach(child => {
            this.removeNotification(child)
        })
    }

    connectedCallback() {
        this.notificationPanel = this.shadowRoot.querySelector('.notification-panel')
        this.animationOptions = {
            duration: 300,
            fill: "forwards",
            easing: "ease"
        }
        this.fontSize = Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0])
        this.notification
        this.offset
        this.touchStartX = 0
        this.touchEndX = 0
        this.touchStartTime = 0
        this.touchEndTime = 0
        this.threshold = this.notificationPanel.getBoundingClientRect().width * 0.3
        this.touchEndAnimataion;

        this.notificationPanel.addEventListener('click', e => {
            if (e.target.closest('.close'))(
                this.removeNotification(e.target.closest('.notification'))
            )
        })

        const observer = new MutationObserver(mutationList => {
            mutationList.forEach(mutation => {
                if (mutation.type === 'childList') {
                    if (mutation.addedNodes.length) {
                        if (!mutation.addedNodes[0].classList.contains('pinned'))
                            setTimeout(() => {
                                this.removeNotification(mutation.addedNodes[0])
                            }, 5000);
                        if (window.innerWidth > 640)
                            this.notificationPanel.style.padding = '1.5rem 0 3rem 1.5rem';
                        else
                            this.notificationPanel.style.padding = '1rem 1rem 2rem 1rem';
                    } else if (mutation.removedNodes.length && !this.notificationPanel.children.length) {
                        this.notificationPanel.style.padding = 0;
                    }
                }
            })
        })
        observer.observe(this.notificationPanel, {
            attributes: true,
            childList: true,
            subtree: true
        })
    }
})