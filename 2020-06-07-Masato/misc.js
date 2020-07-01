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

    codePHP.innerText = code_check_code;
    codeHTML.innerText = code_index_html;

    code.innerText = c;

    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });

});