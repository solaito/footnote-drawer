const prefix = 'footnote-drawer';
const openedDrawerClassName = 'is-open';

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(`.${prefix}-reference`).forEach((reference) => {
        reference.addEventListener('click', (event) => {
            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();

            // 既存のドロワーがあれば抜ける
            if (document.getElementById(`${prefix}-wrapper`)) {
                return;
            }

            let article = event.currentTarget.closest('article');
            article.insertBefore(createWrapper(event), article.lastChild)
        })
    })
});

const createWrapper = (event) => {
    let wrapper = document.createElement('div');
    wrapper.setAttribute("id", `${prefix}-wrapper`);
    wrapper.appendChild(createMask());
    wrapper.appendChild(createContainer(event));
    wrapper.addEventListener('touchmove', (event) => {
        event.preventDefault()
    }, {passive: false});
    wrapper.addEventListener('mousewheel', (event) => {
        event.preventDefault()
    }, {passive: false});
    // アニメーションのためにタイミングをずらしてクラス名を付与する
    setTimeout(() => wrapper.setAttribute('class', openedDrawerClassName), 1);

    return wrapper;
}

const createMask = () => {
    let mask = document.createElement('div');
    mask.setAttribute('id', `${prefix}-mask`);
    mask.addEventListener('click', removeDrawer);

    return mask;
}

const createContainer = (event) => {
    let container = document.createElement('div');
    container.setAttribute('id', `${prefix}-container`);
    container.appendChild(createHeader());
    container.appendChild(createContents(event));

    return container;
}

const createHeader = () => {
    let header = document.createElement('div');
    header.setAttribute('class', `${prefix}-header`);
    header.innerText = footnote_drawer.plugin.words.footnotes;
    let close_button = document.createElement('button');
    close_button.setAttribute('type', 'button');
    close_button.setAttribute('class', `${prefix}-close-button`);
    close_button.addEventListener('click', removeDrawer);
    header.appendChild(close_button);

    return header;
}

const createContents = (event) => {
    let contents = document.createElement('div');
    contents.setAttribute('class', `${prefix}-contents`);
    // ドロワーに表示させるためのコンテンツを文末脚注からクローンして持ってくる
    let footnote = document.getElementById(event.currentTarget.dataset.footnoteDrawerTo).getElementsByClassName(`${prefix}-endnotes-contents`)[0].cloneNode(true);
    let number = document.createElement('sup');
    number.innerText = '[' + event.currentTarget.dataset.footnoteDrawerNumber + ']';
    contents.appendChild(number);
    contents.appendChild(footnote);

    return contents;
}

const removeDrawer = () => {
    const animationDuration = 250;
    let wrapper = document.getElementById(`${prefix}-wrapper`);
    if (wrapper) {
        wrapper.classList.remove(openedDrawerClassName);
        setTimeout(() => wrapper.remove(), animationDuration);
    }
}
