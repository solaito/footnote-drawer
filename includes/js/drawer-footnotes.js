document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drawer-footnotes-reference').forEach((reference) => {
        reference.addEventListener('click', (event) => {
            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();

            // 既存のドロワーがあれば抜ける
            if (document.getElementById("drawer-footnotes-wrapper")) {
                return;
            }

            let article = event.currentTarget.closest('article');
            article.insertBefore(createWrapper(event), article.lastChild)
        })
    })
});

const createWrapper = (event) => {
    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", 'drawer-footnotes-wrapper');
    wrapper.appendChild(createMask());
    wrapper.appendChild(createContainer(event));
    wrapper.addEventListener('touchmove', (event) => {event.preventDefault()}, {passive:false});
    wrapper.addEventListener('mousewheel', (event) => {event.preventDefault()}, {passive:false});
    setTimeout(() => wrapper.setAttribute("class", 'is-open'), 1);

    return wrapper;
}

const createMask = () => {
    let mask = document.createElement('div');
    mask.setAttribute('id', 'drawer-footnotes-mask');
    mask.addEventListener('click', removeDrawer);

    return mask;
}

const createContainer = (event) => {
    let container = document.createElement('div');
    container.setAttribute("id", 'drawer-footnotes-container');
    container.appendChild(createHeader());
    container.appendChild(createContents(event));

    return container;
}

const createHeader = () => {
    let header = document.createElement('div');
    header.setAttribute("class", 'drawer-footnotes-header');
    header.innerText = drawer_footnotes.plugin.text.footnotes;
    let close_button = document.createElement('button');
    close_button.setAttribute('type', 'button');
    close_button.setAttribute('class', 'drawer-footnotes-close-button');
    close_button.addEventListener('click', removeDrawer);
    header.appendChild(close_button);

    return header;
}

const createContents = (event) => {
    let contents = document.createElement('div');
    contents.setAttribute("class", 'drawer-footnotes-contents');
    let footnote = document.getElementById(event.currentTarget.dataset.drawerFootnotesTo).getElementsByClassName('drawer-footnotes-endnotes-contents')[0].cloneNode(true);
    let number = document.createElement('sup');
    number.innerText = '[' + event.currentTarget.dataset.drawerFootnotesNumber + ']';
    contents.appendChild(number);
    contents.appendChild(footnote);

    return contents;
}

const removeDrawer = () => {
    let wrapper = document.getElementById("drawer-footnotes-wrapper");
    if (wrapper) {
        wrapper.classList.remove('is-open');
        setTimeout(() => wrapper.remove(), 250);
    }
}
