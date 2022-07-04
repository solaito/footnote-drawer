<?php

/*
Plugin Name: Footnote Drawer
Plugin URI: https://github.com/solaito/footnote-drawer
Description: View Footnotes in the drawer.
Version: 1.0.1
Author: Tonica, LLC.
Author URI: https://tonica.llc/
License: GPL2
Text Domain: footnote-drawer
*/

define("FOOTNOTE_DRAWER_PLUGIN", __FILE__);
define("FOOTNOTE_DRAWER_PLUGIN_BASENAME", plugin_basename(FOOTNOTE_DRAWER_PLUGIN));
define("FOOTNOTE_DRAWER_PLUGIN_DIR_URL", plugin_dir_url(FOOTNOTE_DRAWER_PLUGIN));
const FOOTNOTE_DRAWER_TEXT_DOMAIN = 'footnote-drawer';

require_once 'includes/options-page.php';

class Footnote_Drawer
{
    const PREFIX = 'footnote-drawer';

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
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_filter('the_content', array($this, 'add_temp_endnotes_filter'));
        add_shortcode('fnd', array($this, 'footnote_callback'));
        add_shortcode('fnd_end', array($this, 'endnotes_callback'));
    }

    public function init()
    {
        $this->footnotes = [];
    }

    public function enqueue_scripts()
    {
        $data = get_file_data(FOOTNOTE_DRAWER_PLUGIN, array('version' => 'Version'));
        $options = get_option('footnote_drawer_option_name');
        $version = $data['version'];
        $footnote_drawer = array(
            'plugin' => array(
                'words' => array(
                    'footnotes' => $this->footnotes_word($options),
                )
            )
        );
        wp_enqueue_script('footnote-drawer', FOOTNOTE_DRAWER_PLUGIN_DIR_URL . 'includes/js/index.js', null, $version);
        wp_localize_script('footnote-drawer', 'footnote_drawer', $footnote_drawer);
        wp_enqueue_style('footnote_drawer', FOOTNOTE_DRAWER_PLUGIN_DIR_URL . 'includes/css/style.css', null, $version);
    }

    public function footnote_callback($atts, $content = null)
    {
        $n = count($this->footnotes) + 1;
        $id_prefix = self::PREFIX . '-post-' . get_the_ID();
        $id = $id_prefix . '-' . $n;
        $ref_id = $id_prefix . '-ref-' . $n;
        array_push($this->footnotes,
            array(
                'id' => $id,
                'ref_id' => $ref_id,
                'content' => $content
            ));
        $a = sprintf('<a href="#%s">[%d]</a>', $id, $n);
        return sprintf('<sup id="%s" class="%s-reference" data-%s-number="%s" data-%s-to="%s">%s</sup>',
            $ref_id, self::PREFIX, self::PREFIX, $n, self::PREFIX, $id, $a);
    }

    public function endnotes_callback($atts, $content = null)
    {
        $options = get_option('footnote_drawer_option_name');
        // 脚注が登録されていなければ文末脚注も不要
        if (empty($this->footnotes)) {
            return;
        }
        $lis = '';
        foreach ($this->footnotes as $footnote) {
            $jump_link = sprintf('<b class="%s-scroll-up""><a href="#%s">^</a></b>', self::PREFIX, $footnote['ref_id']);
            $content = sprintf('<span class="%s-endnotes-contents">%s</span>', self::PREFIX, $footnote['content']);
            $lis .= sprintf('<li id="%s">%s%s</li>', $footnote['id'], $jump_link, $content);
        }

        return sprintf('<h2>%s</h2><ol class="%s-endnotes">%s</ol>',
            esc_html($this->footnotes_word($options)),
            self::PREFIX, $lis);
    }

    public function add_temp_endnotes_filter($content)
    {
        return $content . '[fnd_end]';
    }

    private function footnotes_word($options)
    {
        $word = $options[Footnote_Drawer_Options_Page::IDS['WORDING_FOOTNOTES']];
        $default = 'Footnotes';
        return isset($word) ?
            $word : __($default, FOOTNOTE_DRAWER_TEXT_DOMAIN);
    }
}

new Footnote_Drawer();
