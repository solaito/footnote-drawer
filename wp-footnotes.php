<?php

/*
Plugin Name: Wp Footnotes
Plugin URI: http://URI_Of_Page_Describing_Plugin_and_Updates
Description: A brief description of the Plugin.
Version: 1.0
Author:
Author URI: http://URI_Of_The_Plugin_Author
License: A "Slug" license name e.g. GPL2
*/

class TFN
{
    private $footnotes;

    /*
     * MEMO:
     * the_content -> shortcodeの順で処理されるのでトリッキーなことをしている
     * 以下の処理順でコンテンツの末尾に脚注リストを差し込む
     * ・the_contentでコンテンツ末尾に脚注リスト用のショートコードを追加
     * ・それぞれの脚注をショートコードで拾い、クラス変数に格納する
     * ・脚注リスト用のショートコードでそれぞれの脚注をまとめてリスト化
     */
    public function __construct()
    {
        $this->footnotes = [];
        add_filter('the_content', array($this, 'add_temp_list'));
        add_shortcode('tfn', array($this, 'register_footnotes'));
        add_shortcode('tfn_list', array($this, 'replace_temp_list'));
    }

    public function register_footnotes($atts, $content = null)
    {
        $n = count($this->footnotes) + 1;
        array_push($this->footnotes,
            array(
                'id' => 'cite_note-' . $n,
                'content' => $content
            ));
        return sprintf('<sup>[%d]</sup>', $n);
    }

    public function replace_temp_list($atts, $content = null)
    {
        $lis = '';
        foreach ($this->footnotes as $footnote) {
            $lis .= sprintf('<li id="%s">%s</li>', footnote['id'], $footnote['content']);
        }

        return sprintf('<h2>%s</h2><ol>%s</ol>', __('Footnotes'), $lis);
    }

    public function add_temp_list($content)
    {
        return $content . '[tfn_list]';
    }
}

$tfn = new TFN();
