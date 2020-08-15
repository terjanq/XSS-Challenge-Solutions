const shift = (spaces, code) => {
    let c = code
    if (spaces < 0) {
        let r = new RegExp(`^(\\ ){0,${-spaces}}`, 'gm');
        c = c.replace(r, '');
    } else {
        c = c.replace(/^/gm, ' '.repeat(spaces));
    }
    return c;
}

function observe(node, callback){
    const observer = new MutationObserver(callback);
    observer.observe(node, {childList:true, subtree: true });
}

function hl_sol(){
    let c = solution.outerHTML.replace(/\r\n/g, '\n')
    const code = document.querySelector('#code');
    c = shift(-4, c);
        
    code.innerText = c;

    hljs.highlightBlock(code);
}

window.addEventListener(`DOMContentLoaded`, _ => {
    
    window.misc();
    hl_sol();
    observe(solution, hl_sol);
});