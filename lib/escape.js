
/*
 * escape.js
 *
 *A string escaping and stripping functions to protect against
 *XSS attack vectors that leverage output of untrusted content to
 *embed malicious code segments.
 *
 */

// Function to remove all XML tag entries cleanly from the provided
// text. This will actually render the text into a Document Object and
// remove any and all tags cleanly from the text. It will then encode
// any remaining entities.
String.prototype.whitelist = function (allowable_tags) {
  if (!allowable_tags) {
    allowable_tags =[];
  }
  var recursiveXMLPurge = function(element) {
    try {

    if (element.nodeKind() === "text") {
      return element.toString().h();
    } else {
      var contents = "";
      var localName = "";
      try { localName = element.localName().toLowerCase(); } catch (e) {}
      var children = element.children();
      for (var i=0; i< children.length(); i++) {
        contents += recursiveXMLPurge(children[i]);
      }
      if (element.nodeKind() == "element" && allowable_tags.indexOf(localName) >= 0) {
        return "<"+localName+">"+contents+"</"+localName+">";
      } else {
        return " "+contents;
      }
    }
    } catch (e) {
      print(e);
      print(element);
      try {
        print(element.nodeKind());
      }catch(e){
      }
      try {
        print(element.localName());
      }catch(e){
      }
      return "";
    }
  };
  try {
    str = recursiveXMLPurge(new XML("<dirtydoc>"+this+"</dirtydoc>"));
    str.replace(/^\s+/, "").replace(/\s+$/, "");
    return str;
  } catch(e) {
    print(e);
    return this.replace(/(<([^>]+)>)/ig,"").h();
  }
};


//Function for HTML encoding of entities that would yield tags or
//problematic characters during HTML rendering. This is a security
//function for removing malicious code that will be rendered to the browser.
String.prototype.h = function () {
  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
};



var test_escape = function () {

  function assertEqual(expected, realized) {


    var expectedValue = expected;
    var realizedValue = realized;
    if (typeof expected === "function") {
      expectedValue = expected();
    }
    if (typeof realized === "function") {
      realizedValue = realized();
    }
    if (expectedValue === realizedValue) {
      print(".");
    } else {
      print("F");
      print("Expected: |"+expectedValue+"| but got: |"+realizedValue+"|");
      if (typeof realized === "function") {
        print(realized);
      }
    }
  }
  return {
    h: function() {
      assertEqual("&amp;", "&".h());
      assertEqual("&lt;","<".h());
      assertEqual("&gt;", ">".h());
    },
    whitelist: function() {
      // purge valid xml
      assertEqual("I like alert('chickens');", "I like <script>alert('chickens');</script>".whitelist());

      //purge unknown entries but allow known ones to go through.
      assertEqual("I like alert('<b>chickens</b>');", "I like <script>alert('<b>chickens</b>');</script>".whitelist(["b"]));

      //purge invalid xml
      assertEqual("I like alert('chickens');",   "I like <script>alert('chickens');".whitelist());

      //encodes entities it cannot purge.
      assertEqual("I like alert('chickens');&lt;/script", "I like <script>alert('chickens');</script".whitelist());

    },
    all:function() {
      this.h();
      this.whitelist();
    }
  };
}();




