const Notif = {
    init() {
        this.hideTimeout = null;

        this.el = document.createElement("div");
        this.el.className = 'alert';

        this.iconWarning = document.createElement("img")
        this.iconWarning.setAttribute("src", "asset/images/warning2.png")

        this.msg = document.createElement("h6")

        this.iconClose = document.createElement("span")
        this.iconClose.setAttribute("src", "asset/images/close-outline.svg")
      
        this.el.append(this.iconWarning, this.msg, this.iconClose)
        document.body.appendChild(this.el);
    },
    show(message, state) {
        clearTimeout(this.hideTimeout);

        this.msg.textContent = message;

        if(state) {
            this.el.classList.add(`active`)
            this.hideTimeout = setTimeout(()=> {
                this.el.classList.remove('active')
            }, 3000); //setelah 3 detik alert hilang   
        }else {
            this.el.classList.remove(`active`)
        }

    }
}
document.addEventListener('DOMContentLoaded', () =>{
    Notif.init();
}) 
