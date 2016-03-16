/**
 * Characters in text layer may be rendered character by character.
 * This causes weirdness when selecting text to create annotations.
 * This method merges adjacent characters into a shared div.
 *
 * @param textLayer <div> containing the text content
 */
export default function mergeAdjacentText(textLayer) {
  let chars = textLayer.querySelectorAll('div');
  let rows = {};

  // Arrange all the characters by row based on style.top
  Array.prototype.forEach.call(chars, div => {
    let top = div.style.top;

    if (!rows[top]) {
      rows[top] = [];
    }

    let row = rows[top];
    row.push(div);
  });

  // Merge characters into rows
  let fragment = document.createDocumentFragment();
  Object.keys(rows).forEach(key => {
    let row = rows[key];
    let text = '';
    let textDiv;
    let lastDiv;

    function openTextDiv(div) {
      textDiv = div.cloneNode();
      textDiv.innerHTML = '';
      fragment.appendChild(textDiv);
    }

    function closeTextDiv() {
      textDiv.appendChild(document.createTextNode(text));
      textDiv = null;
      text = '';
    }

    // Iterate every character in the row
    row.forEach((div, i) => {
      if (!textDiv) {
        openTextDiv(div);
      }

      // Get the style without position props of this and last div
      let thisStyle = div.getAttribute('style');
      let lastStyle = lastDiv ? lastDiv.getAttribute('style') : null;
      if (thisStyle) {
        thisStyle = thisStyle.replace(/(left|top):.*?px;/g, '').trim();
      }
      if (lastStyle) {
        lastStyle = lastStyle.replace(/(left|top):.*?px;/g, '').trim();
      }

      // Close div if last style doesn't match current style
      if (thisStyle !== lastStyle) {
        closeTextDiv();
        openTextDiv(div);
      }
      // Account for white space-ish
      else if (lastDiv) {
        let thisRect = div.getBoundingClientRect();
        let lastRect = lastDiv.getBoundingClientRect();
        let cloneDiv = div.cloneNode();
        let spaceDiff = thisRect.left - lastRect.right;
        let spaceWidth = 0;

        // Calculate the width of a single white space
        cloneDiv.innerHTML = '&nbsp;';
        cloneDiv.style.position = 'absolute';
        document.body.appendChild(cloneDiv);
        spaceWidth = cloneDiv.getBoundingClientRect().width;
        document.body.removeChild(cloneDiv);

        // If the diff is greater than a single space close div
        if (spaceDiff > spaceWidth) {
          closeTextDiv();
          openTextDiv(div);
        }
        // Otherwise if divs aren't immediately adjacent add a space
        else if (spaceDiff >= 1) {
          text += ' ';
        }
      }
      
      // Copy text content
      text += div.textContent;

      // This is it, we're done with the row
      if (i === row.length - 1) {
        closeTextDiv();
      }

      // Keep track of the last div
      lastDiv = div;
    });
  });

  // Update the text layer with the merged text
  textLayer.innerHTML = '';
  textLayer.appendChild(fragment);
}

