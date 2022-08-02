import { emitter } from "@/composables/useEvent";

export default {
  mounted: (el) => {
    const revealText = (text) => {
      const next = text[0];
      if (!next) {
        emitter.emit("displayed");
      } else if (el.dataset.displayed === "false") {
        el.textContent += next;
        const delay = next === " " ? 0 : 90;
        setTimeout(() => revealText(text.slice(1)), delay);
      }
    };

    const callback = (mutationList) => {
      for (const { type, attributeName } of mutationList) {
        if (type === "attributes") {
          if (attributeName === "data-text" && el.dataset.text !== "") {
            if (el.dataset.displayed === "true") {
              el.textContent = el.dataset.text;
            } else {
              el.textContent = "";
              el.dataset.displayed = "false";
              revealText(el.dataset.text);
            }
          } else if (
            attributeName === "data-displayed" &&
            el.dataset.displayed === "true"
          ) {
            el.textContent = el.dataset.text;
          }
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(el, { attributes: true });
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
      el.textContent = el.dataset.text;
    else if (el.dataset.displayed === "true") el.textContent = el.dataset.text;
    else if (el.dataset.text) revealText(el.dataset.text);
  },
};
