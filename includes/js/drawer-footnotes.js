document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drawer-footnotes-reference').forEach((reference) => {
        reference.addEventListener('click', (event) => {
            init();
            // 領域外クリックの場合閉じるようイベントリスナーを登録
            document.addEventListener('click', removeDrawer);

            // ヘッダー
            let drawer_header = document.createElement('div');
            drawer_header.setAttribute("class", 'drawer-footnotes-header');
            drawer_header.innerText = 'Footnotes';

            // コンテナ
            let drawer_contents = document.createElement('div');
            drawer_contents.setAttribute("class", 'drawer-footnotes-contents');
            let footnote = document.getElementById(event.currentTarget.dataset.drawerFootnotesTo).getElementsByClassName('drawer-footnotes-endnotes-contents')[0].cloneNode(true);
            let number = document.createElement('sup');
            number.innerText = '[' + event.currentTarget.dataset.drawerFootnotesNumber + ']';
            drawer_contents.appendChild(number);
            drawer_contents.appendChild(footnote);

            let drawer_container = document.createElement('div');
            drawer_container.setAttribute("id", 'drawer-footnotes-container');
            drawer_container.appendChild(drawer_header);
            drawer_container.appendChild(drawer_contents);

            let article = event.currentTarget.closest('article');
            article.insertBefore(drawer_container, article.lastChild)

            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();
        })
    })
});

function init() {
    // 既存のドロワーがあれば削除
    let drawer = document.getElementById("drawer-footnotes-container");
    if (drawer) {
        drawer.remove();
    }
}

function removeDrawer(event) {
    // ドロワー展開時のクリックイベントも拾うので、その場合は抜ける
    // 他の処理との兼ね合いもあるので、イベントの伝播は止めない
    if (event.target.closest('.drawer-footnotes-reference') !== null) {
        return;
    }
    // ドロワー以外がクリックされた場合はドロワーを削除する
    if (event.target.closest('#drawer-footnotes-container') === null) {
        let drawer = document.getElementById("drawer-footnotes-container");
        if (drawer) {
            drawer.remove();
            this.removeEventListener('click', removeDrawer);
        }
    }
}
