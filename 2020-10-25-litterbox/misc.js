const code_index_html = `\

<!DOCTYPE html>
<html>
<head>
    <title>Litter Box</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta charset="utf-8"/>
    <style>
        body {
            margin: 0;
        }
        iframe {
            display: block;
            background: #000;
            border: none;
            height: 100vh;
            width: 100vw;
        }
    </style>
</head>
<body>
<script>
    window.onmessage = (e) => {
        if (e.source == window.frames[0]){
                eval(e.data) // 😽
        }
    }
</script>


<script src='main.js'></script>
<iframe id='litterbox' sandbox></iframe>

</body>
</html>
`;

code_js = `\
(async () => {
  const urlParams = new URLSearchParams(location.search)
  let src = urlParams.get('src') ? urlParams.get('src') : 'sandbox.html'
  /* make sure its up */
  try{
      await fetch(src, {mode: 'no-cors', cache: 'no-cache'})
  }
  catch(e){
      console.log('noooo hecking')
      return
  }
  litterbox.src = src   
})()
`


code_writeup = `\
The challenge was to execute arbitrary XSS in the following function:
\`\`\`js
    window.onmessage = (e) => {
        if (e.source == window.frames[0]){
                eval(e.data)
        }
    }
\`\`\`

The goal of the solution was to make \`e.source === null\` and 
and \`window.frmaes[0] === undefined\`, so \`null == undefined\` returns \`true\`

The intended solution was to exhaust the available sockets to block executing
    <script src=main.js> and therefore <iframe id='litterbox' sandbox>
which was placed right after the script. 

My solution does a Race Condition on parsing the iframe by the challenge.
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

    
    codeHTML.innerText = code_index_html;
    codeJS.innerText = code_js;
    writeup.innerText = code_writeup;
    code.innerText = c;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

});
