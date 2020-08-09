const code_index_html = `\
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>HHarder XSS Challenge by @terjanq</title>
    <link rel="stylesheet" href="style.css">
    <script src="/harder.js"></script>
    <script src="/hof2?cb=displayHoF2&amp;t=26616236&amp;hmac=401896bdc2b7fdb52aedac9b8e0971b5b72fe238" defer></script>

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="terjanq">
    <meta name="twitter:title" content="HHarder XSS Challenge">
    <meta name="twitter:description" content="HHarder XSS Challenge by @terjanq">
    <meta name="twitter:image" content="https://i.imgur.com/fMRhTWA.png">

  </head>
  <body>
    <h1> HHarder XSS Challenge by @terjanq </h1>
    <img src="https://i.imgur.com/UZD9lme.gif">
    <p>
      <span class=teaser>Can you execute arbitrary XSS?</span>
    </p>
    <h2>Rules</h2>
    <ul id=rules></ul>
    
    <h2>Hall of Fame</h2>
    <pre><code id=hof></code></pre>
  </body>
</html>
`;

code_harder_js = `\
~function(){
    const params = new URL(location.href).searchParams;
    const msg_url = "https://twitter.com/messages/compose?recipient_id=1090682326709952512&text=%47%72%65%61%74%20%63%68%61%6C%6C%65%6E%67%65%21%20%68%65%72%65%20%69%73%20%6D%79%20%73%6F%6C%75%74%69%6F%6E%3A%20"
    
    const t = params.get('t');
    
    const url = new URL(location.origin);
    url.pathname = location.pathname;
    url.searchParams.set('t', t);
    history.replaceState(null, null, url.href);
    
    window.name = "Harder XSS Challenge by @terjanq";
    opener = null;
    
    window.displayHoF2 = function(obj){
        const hof = document.getElementById('hof');
        hof.innerText = JSON.stringify(obj, null, 4);
    }
    
    
    function displayRules(){
        const rules_ul = document.getElementById('rules');
        const rules = [
            \`The goal is to call <strong><code>alert(secret)</code></strong> on the path <strong><code>/harder</code></strong>, where <code>secret</code> is a secret from the JSON object\`,
            \`The solution must <strong>not reuse the resources</strong> from the easier version, i.e. <code>/script.js</code>, <code>/</code> and <code>/hof</code> cannot be used\`,
            \`The solution must work on the latest version of <strong>both</strong> Chrome and Firefox\`, 
            \`The solution must respect the CSP\`, 
            \`Only <strong><code>harderxss.terjanq.me</code></strong> domain can be used in the solution, i.e. using other subdomains such as <code>*.terjanq.me<code> or <code>terjanq.me</code> is disallowed\`, 
            \`No user interaction is allowed\`, 
            \`<strong>The solution must execute in less than 3 seconds</strong>\`,
            \`<code>hmac</code> is generated via <strong><code>hmac(req.url, SECRET_KEY+req.ip)</code></strong> and is <strong>not supposed to be bypassable or breakable</strong>\`,
            \`Please don't bruteforce &mdash; <strong>there are no hidden endpoints</strong>\`,
            \`Solved? Message me on twitter <a target="_blank" href="\${msg_url}">@terjanq</a>\`,
            \`Don't forget to follow the twitter <a target="_blank" href="https://twitter.com/terjanq/status/1285594387578322944">thread</a> for updates\`,
            \`Too hard? Try the <a href="/">easier</a> version!\`
        ];
        
        for(let r of rules){
            let li = document.createElement('li');
            li.innerHTML = r;
            rules_ul.appendChild(li);
        }
    }
     
    window.addEventListener("DOMContentLoaded", () => {
        displayRules();
    });
  
}()        
`;

code_hof = `\
displayHoF2({
    "solvers": [
      {
        "name": "shafigullin",
        "intended": 3,
        "comment": "Intended solution :)",
        "timestamp": "1595534580000"
      },
      {
        "name": "BenHayak",
        "intended": 3,
        "comment": "Slightly off of the intended, gj!",
        "timestamp": "1596573660000"
      }
    ],
    "secret": "Congratz! Seems that you solved me hard."
  })
`;

window.addEventListener(`DOMContentLoaded`, _ => {
    let c = solution.outerHTML.replace(/\r\n/g, '\n')
    const shift = spaces => {
        if (spaces < 0) {
            let r = new RegExp(`^(\\ ){0,${-spaces}}`, 'gm');
            c = c.replace(r, '');
        } else {
            c = c.replace(/^/gm, ' '.repeat(spaces));
        }

    }

    shift(-4)

    codeJS.innerText = code_harder_js;
    codeHTML.innerText = code_index_html;
    codeCB.innerText = code_hof;
        
    code.innerText = c;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

});
