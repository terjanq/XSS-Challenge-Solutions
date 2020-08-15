const code_index_html = `\
  <h1> Here is my 2020 XSS challenge, Enjoy! </h1>

  <!-- Rules -->
  <div>
    <ul id="itemsList"></ul>
  </div>
  <!-- Client ID -->
  <h3> Auth application Client ID </h3>

  <!-- Sandbox client id: demo85266365425329.apps.myappstore.com -->
  <form name="form">
    <label for="client_id">Client ID:</label>
    <input id="client_id" type="text" class="inputbox" placeholder="demo85266365425329.apps.myappstore.com">
    <input type="submit" value="Continue">
  </form>
  <!-- Feedback -->
  <div id="result" class="message"></div>

  <script nonce="9saPYg4drgRTNhjsePMyRcWDj7s4tg">
  /* Rules */
  var rules = [
    "The goal is to alert the <b>csp nonce</b> in this origin 🎩.",
    "The solution must work in latest version of the modern browsers. (i.e. Chrome, Firefox, Safari, Edge)",
    "The solution must respect CSP.",
    "Please assume CSP nonce is dynamic for the sake of the challenge.",
    "Using resources on this domain except this page and/or connect.php is not allowed.",
    "No user interaction allowed.",
    "DM me on twitter with solutions: <a href='https://twitter.com/BenHayak'>@BenHayak</a> "
  ];

  function init() {
    rules.forEach((rule)=> {
      listValue = document.createElement("li");
      listValue.innerHTML = rule;
      itemsList.appendChild(listValue);
    });
  }

  document.addEventListener('DOMContentLoaded', (event) => {
    init();
    let p_code = new URL(location.href).searchParams.get('client_id');
    if (p_code) {
        client_id.value = p_code;
        connect(p_code);
      }
  })

  function callback(response, status) {
    result.className = "message"
    if (status === "406: Not Acceptable") {
      result.classList.add("error");
    }
    else {
      result.classList.add("info");
    }
    result.innerHTML = DOMPurify.sanitize(response, {ADD_DATA_URI_TAGS: true});
  }
  function connect(code) {
    let s = document.createElement('script');
    s.src = \`/mini_2020/connect.php?client_id=\${encodeURI(code)}\`;
    document.body.appendChild(s);
  }

  form.addEventListener('submit', function(event) {
    connect(client_id.value);
    event.preventDefault();
  });

  </script>
`;

code_hof = `\
alert("Error: 'aaa'", "406: Not Acceptable");
`;

window.misc = function(){
    codeHTML.innerText = code_index_html;
  codeCB.innerText = code_hof;

  document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block);
  });
};