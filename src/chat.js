import React, { useEffect } from "react";

function KommunicateChat() {
  useEffect(() => {
    (function (d, m) {
      var kommunicateSettings = {
        appId: "314c8987f6d2c5193dcbb342ecac43b51",
        popupWidget: true,
        automaticChatOpenOnNavigation: true,
      };
      var s = document.createElement("script");
      s.type = "text/javascript";
      s.async = true;
      s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
      var h = document.getElementsByTagName("head")[0];
      h.appendChild(s);
      window.kommunicate = m;
      m._globals = kommunicateSettings;
    })(document, window.kommunicate || {});
  }, []);
  return <div></div>;
}

export default KommunicateChat;
