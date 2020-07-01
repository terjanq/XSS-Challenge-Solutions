const code_check_code = `\
        <?php
            $callback = "callback";
            if (isset($_GET['callback']))
            {
                $callback = preg_replace("/[^a-z0-9.]+/i", "", $_GET['callback']);
            }
            
            $key = "";
            if (isset($_GET['code']))
            {
                $key = $_GET['code'];
            }
            
            if (mb_strlen($key, "UTF-8") <= 10)
            {
                if ($key == "XSS_ME")
                {
                    $result = "Okay! You can access <a href='#not-implemented'>the secret page</a>!";
                }
                else
                {
                    $result = "Invalid code: '$key'";
                }
            }
            else
            {
                $result = "Invalid code: too long";
            }
            $json = json_encode($result, JSON_HEX_TAG);
            
            header('X-XSS-Protection: 0');
            header('X-Content-Type-Options: nosniff');
            header('Content-Type: text/javascript; charset=utf-8');
            print "$callback($json)";`;

code_index_html = `\
        <!-- Challenge -->
        <h2>秘密のコードを入力(Enter secret code)</h2>
        <p>Enter the secret code to access the secret page!</p>
        <form name="form">
        <input id="c" type="text"><input type="submit" value="Submit">
        </form>
        <div id="result"></div>
        <script>
            var callback = function (msg) {
                result.innerHTML = msg;
            }
            document.addEventListener('DOMContentLoaded', function (event) {
                if (getQuery('code')) {
                    var code = getQuery('code');
                    c.value = code;
                    checkCode(code);
                }
            });
            form.addEventListener('submit', function (event) {
                checkCode(c.value);
                event.preventDefault();
            });

            function checkCode(code) {
                var s = document.createElement('script');
                s.src = \`/xss_2020-06/check_code.php?callback=callback&code=\${encodeURI(code)}\`;
                document.body.appendChild(s);
            }

            function getQuery(name) {
                return new URL(location.href).searchParams.get(name);
            }
        <\/script>`;

code_writeup = `\
The challenge consisted of leveraging an advanced case of the SOME attack to achieve cross-site scripting.

The challenger was presented with:

1. Partial control of the callback parameter on \`/check-code.php\` endpoint (\`/[^a-z0-9.]+/i\`).
2. Partial control of the code parameter on \`/check-code.php\` endpoint (\`length <= 10\`).

SOME was achieved by specifying a prepared payload in the code parameter, which was being used to
load a JSONP endpoint with a fixed callback and a partially attacker-controlled function parameter
(retrieved from the code value).

Furthermore, to achieve control of the callback parameter used in the JSONP one was required to abuse
the unsafe use of encodeURI in the checkCode function.

Since \`encodeURI\` doesn't encode the \`&\` character it was possible to send \`&callback=\` in the code parameter
as a way to "overwrite" its value (given the server was using the last occurrence of a given parameter
instead of the first one).

As a side effect of the encoding functionality, it was not possible to use certain characters like \`+\` or \`&\`
in the payload since \`%\` would end up URL encoded - preventing trivial string concatenation.

The next step was to figure out how to escalate SOME to XSS.
Functions that evaluate javascript from strings were discarded given there was only partial control over
the function parameter and its start wasn't valid javascript.

This lead to the realization that by using \`document.write\` it was possible to write to the document stream
and build the payload little by little.

With the help of multiple iframes and same-origin cross-iframe manipulation, one could write an HTML tag
to the DOM containing an oncut event and then trigger the desired payload by emitting a cut event
using SOME once again.
`;

window.addEventListener(`DOMContentLoaded`, _ => {
    hljs.configure({
        'tabReplace': '<br>123'
    })
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

    codePHP.innerText = code_check_code;
    codeHTML.innerText = code_index_html;
    codeWrite.innerText = code_writeup;
        
    code.innerText = c;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

    code.innerHTML = code.innerHTML.replace(
        `"iframeA"</span>`, `"iframeA"</span><br>           `
        )
    

});
