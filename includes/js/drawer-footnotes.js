document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drawer-footnotes-reference').forEach((reference) => {
        reference.addEventListener('click', (event) => {
            init();
            // 領域外クリックの場合閉じるようイベントリスナーを登録
            document.addEventListener('click', removeDrawer);

            let id = event.currentTarget.id.replace(/-ref/, "");
            let footnote = document.getElementById(id).getElementsByClassName('drawer-footnotes-endnotes-contents')[0].innerHTML;
            let footnotes = document.createElement('div');
            footnotes.setAttribute("id", 'drawer-footnotes');
            footnotes.insertAdjacentHTML('afterbegin', footnote)

            let article = document.getElementById('post-1');
            article.insertBefore(footnotes, article.lastChild)

            // href="#"属性が設定されたaタグにイベントリスナーを設定しているため、デフォルトの挙動でページ内遷移が発生する。
            // デフォルトの挙動はJavascriptが無効だった場合に必要となる。
            // Javascriptが有効な場合は不要なので、デフォルトの挙動は無効とする。
            event.preventDefault();
        })
    })
});

function init() {
    // 既存のドロワーがあれば削除
    let drawer = document.getElementById("drawer-footnotes");
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
    if (event.target.closest('#drawer-footnote') === null) {
        let hoge = document.getElementById("drawer-footnotes");
        if (hoge) {
            hoge.remove();
            this.removeEventListener('click', removeDrawer);
        }
    }
}
