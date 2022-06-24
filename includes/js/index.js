document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.footnote-drawer-reference').forEach((reference) => {
        reference.addEventListener('click', (event) => {
            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();

            // 既存のドロワーがあれば抜ける
            if (document.getElementById("footnote-drawer-wrapper")) {
                return;
            }

            let article = event.currentTarget.closest('article');
            article.insertBefore(createWrapper(event), article.lastChild)
        })
    })
});

const createWrapper = (event) => {
    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", 'footnote-drawer-wrapper');
    wrapper.appendChild(createMask());
    wrapper.appendChild(createContainer(event));
    wrapper.addEventListener('touchmove', (event) => {event.preventDefault()}, {passive:false});
    wrapper.addEventListener('mousewheel', (event) => {event.preventDefault()}, {passive:false});
    setTimeout(() => wrapper.setAttribute("class", 'is-open'), 1);

    return wrapper;
}

const createMask = () => {
    let mask = document.createElement('div');
    mask.setAttribute('id', 'footnote-drawer-mask');
    mask.addEventListener('click', removeDrawer);

    return mask;
}

const createContainer = (event) => {
    let container = document.createElement('div');
    container.setAttribute("id", 'footnote-drawer-container');
    container.appendChild(createHeader());
    container.appendChild(createContents(event));

    return container;
}

const createHeader = () => {
    let header = document.createElement('div');
    header.setAttribute("class", 'footnote-drawer-header');
    header.innerText = footnote_drawer.plugin.text.footnotes;
    let close_button = document.createElement('button');
    close_button.setAttribute('type', 'button');
    close_button.setAttribute('class', 'footnote-drawer-close-button');
    close_button.addEventListener('click', removeDrawer);
    header.appendChild(close_button);

    return header;
}

const createContents = (event) => {
    let contents = document.createElement('div');
    contents.setAttribute("class", 'footnote-drawer-contents');
    let footnote = document.getElementById(event.currentTarget.dataset.footnoteDrawerTo).getElementsByClassName('footnote-drawer-endnotes-contents')[0].cloneNode(true);
    let number = document.createElement('sup');
    number.innerText = '[' + event.currentTarget.dataset.footnoteDrawerNumber + ']';
    contents.appendChild(number);
    contents.appendChild(footnote);

    return contents;
}

const removeDrawer = () => {
    let wrapper = document.getElementById("footnote-drawer-wrapper");
    if (wrapper) {
        wrapper.classList.remove('is-open');
        setTimeout(() => wrapper.remove(), 250);
    }
}
