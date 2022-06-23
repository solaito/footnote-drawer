document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drawer-footnotes-reference').forEach((reference) => {
        reference.addEventListener('click', (event) => {
            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();

            let drawer = document.getElementById("drawer-footnotes-container");
            if (drawer) {
                return;
            }
            // 既存のドロワーがあれば削除
            //removeDrawer();
            // 領域外クリックの場合閉じるようイベントリスナーを登録
            document.addEventListener('click', clickOutsideRemoveDrawer);

            let container = document.createElement('div');
            container.setAttribute("id", 'drawer-footnotes-container');
            container.appendChild(createHeader());
            container.appendChild(createContents(event));
            setTimeout(() => container.setAttribute("class", 'is-open'), 1);

            let article = event.currentTarget.closest('article');
            article.insertBefore(container, article.lastChild)
        })
    })
});

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
    let drawer = document.getElementById("drawer-footnotes-container");
    if (drawer) {
        drawer.classList.remove('is-open');
        setTimeout(() => drawer.remove(), 250);
        document.removeEventListener('click', clickOutsideRemoveDrawer);
    }
}

const clickOutsideRemoveDrawer = (event) => {
    // ドロワー展開時のクリックイベントも拾うので、その場合は抜ける
    // 他の処理との兼ね合いもあるので、イベントの伝播は止めない
    if (event.target.closest('.drawer-footnotes-reference') !== null) {
        return;
    }
    // ドロワー以外がクリックされた場合はドロワーを削除する
    if (event.target.closest('#drawer-footnotes-container') === null) {
        removeDrawer()
    }
}
