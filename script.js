document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", async function () {
    const buttonId = this.id;

    try {
      // fetch css
      const response = await fetch("buttons.css");
      const cssContent = await response.text();

      // match css
      const regex = new RegExp(`#${buttonId}(\\s|:)[^}]*}`, "g");
      const matches = cssContent.match(regex);

      if (!matches) {
        alert(`No CSS found for the button with ID: ${buttonId}`);
        return;
      }

      let buttonCss = matches.join("\n\n");

      // checks animations and keyframes
      const animationNames = [
        ...buttonCss.matchAll(/animation:\s*([\w-]+)/g),
      ].map((match) => match[1]);

      if (animationNames.length > 0) {
        const keyframesRegex = new RegExp(
          `@keyframes\\s+(?:${animationNames.join("|")})[^#@]*}`,
          "g"
        );
        const keyframes = cssContent.match(keyframesRegex);
        if (keyframes) {
          buttonCss = keyframes.join("\n\n") + "\n\n" + buttonCss;
        }
      }

      // Copy to clipboard
      await navigator.clipboard.writeText(buttonCss);
      alert(`CSS copied to clipboard!`);
    } catch (error) {
      console.error("Error processing the button's CSS:", error);
      alert("An error occurred while processing the CSS.");
    }
  });
});
