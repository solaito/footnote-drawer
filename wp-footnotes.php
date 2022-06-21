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

define("DRAWER_FOOTNOTE_PLUGIN", __FILE__);
define("DRAWER_FOOTNOTE_PLUGIN_BASENAME", plugin_basename(DRAWER_FOOTNOTE_PLUGIN));
define("DRAWER_FOOTNOTE_PLUGIN_DIR_URL", plugin_dir_url(DRAWER_FOOTNOTE_PLUGIN));

add_action('wp_enqueue_scripts', 'drawer_footnote_enqueue_scripts');
function drawer_footnote_enqueue_scripts()
{
    $data = get_file_data(DRAWER_FOOTNOTE_PLUGIN, array('version' => 'Version'));
    $version = $data['version'];
    $drawer_footnotes = array(
        'plugin' => array(
            'text' => array(
                'footnotes' => __('Footnotes'),
            )
        )
    );
    //wp_localize_script('drawer-footnotes-hoge', 'drawer-footnotes-piyo', $param);
    wp_enqueue_script('drawer-footnotes', DRAWER_FOOTNOTE_PLUGIN_DIR_URL . 'includes/js/drawer-footnotes.js', null, $version);
    wp_localize_script('drawer-footnotes', 'drawer_footnotes', $drawer_footnotes);
    wp_enqueue_style('drawer_footnotes', DRAWER_FOOTNOTE_PLUGIN_DIR_URL . 'includes/css/style.css', null, $version);
}

class DrawerFootnotes
{
    private $footnotes;

    /*
     * MEMO:
     * the_content -> shortcodeの順で処理されるのでトリッキーなことをしている
     * 以下の処理順でコンテンツの末尾に文末脚注を差し込む
     * ・the_contentでコンテンツ末尾に文末脚注用のショートコードを追加
     * ・それぞれの脚注をショートコードで拾い、クラス変数に格納する
     * ・文末脚注用のショートコードでそれぞれの脚注をまとめてリスト化
     */
    public function __construct()
    {
        // the_postが最初に呼び出されるのでそのタイミングで初期化
        add_filter('the_post', array($this, 'init'));
        add_filter('the_content', array($this, 'add_temp_endnotes_filter'));
        add_shortcode('dfn', array($this, 'footnote_callback'));
        add_shortcode('dfn_end', array($this, 'endnotes_callback'));
    }

    public function init()
    {
        $this->footnotes = [];
    }

    public function footnote_callback($atts, $content = null)
    {
        $n = count($this->footnotes) + 1;
        $id_prefix = 'drawer-footnotes-post-'. get_the_ID();
        $id = $id_prefix . '-' . $n;
        $ref_id = $id_prefix . '-ref-' . $n;
        array_push($this->footnotes,
            array(
                'id' => $id,
                'ref_id' => $ref_id,
                'content' => $content
            ));
        $a = sprintf('<a href="#%s">[%d]</a>', $id, $n );
        return sprintf('<sup id="%s" class="drawer-footnotes-reference" data-drawer-footnotes-number="%s" data-drawer-footnotes-to="%s">%s</sup>',
            $ref_id, $n, $id, $a);
    }

    public function endnotes_callback($atts, $content = null)
    {
        // 脚注が登録されていなければ文末脚注も不要
        if (empty($this->footnotes)) {
            return;
        }
        $lis = '';
        foreach ($this->footnotes as $footnote) {
            $jump_link = sprintf('<b class="drawer-footnotes-scroll-up""><a href="#%s">^</a></b>', $footnote['ref_id']);
            $content = sprintf('<span class="drawer-footnotes-endnotes-contents">%s</span>', $footnote['content']);
            $lis .= sprintf('<li id="%s">%s%s</li>', $footnote['id'], $jump_link, $content);
        }

        return sprintf('<h2>%s</h2><ol class="drawer-footnotes-endnotes">%s</ol>', __('Footnotes'), $lis);
    }

    public function add_temp_endnotes_filter($content)
    {
        return $content . '[dfn_end]';
    }
}

new DrawerFootnotes();
