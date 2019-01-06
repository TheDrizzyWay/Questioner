// Tags system concept sourced from GeeksLaunch tutorial

[].forEach.call(document.getElementsByClassName('tags-input'), (el) => {
  const hiddenInput = document.createElement('input');
  const mainInput = document.createElement('input');
  const tags = [];

  hiddenInput.setAttribute('type', 'hidden');
  hiddenInput.setAttribute('name', el.getAttribute('data-name'));

  mainInput.setAttribute('type', 'text');
  mainInput.classList.add('main-input');
  mainInput.addEventListener('input', () => {
    const enteredTags = mainInput.value.split(' ');
    if (enteredTags.length > 1) {
      enteredTags.forEach((t) => {
        const filteredTag = filterTag(t);
        if (filteredTag.length > 0) addTag(filteredTag);
      });
      mainInput.value = '';
    }
  });

  mainInput.addEventListener('keydown', (e) => {
    const keyCode = e.which || e.keyCode;
    if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  });

  el.appendChild(mainInput);
  el.appendChild(hiddenInput);

  function addTag(text) {
    const tag = {
      text,
      element: document.createElement('span'),
    };
    if (tags.length <= 9) {
      tag.element.classList.add('tag');
      tag.element.textContent = tag.text;

      const closeBtn = document.createElement('span');
      closeBtn.classList.add('close');
      closeBtn.addEventListener('click', () => {
        removeTag(tags.indexOf(tag));
      });

      tag.element.appendChild(closeBtn);
      tags.push(tag);
      el.insertBefore(tag.element, mainInput);
      refreshTags();
    }
  }

  function removeTag(index) {
    const tag = tags[index];
    tags.splice(index, 1);
    el.removeChild(tag.element);
    refreshTags();
  }

  function refreshTags() {
    const tagsList = [];
    tags.forEach((t) => {
      tagsList.push(t.text);
    });
    hiddenInput.value = tagsList.join(',');
  }

  function filterTag(tag) {
    return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
  }
});
