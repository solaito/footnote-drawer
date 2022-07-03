<?php

class Footnote_Drawer_Options_Page
{
    const PAGE = 'footnote-drawer-admin';
    const TITLE = 'Footnote Drawer';
    const SECTIONS = [
        'WORDING' => 'footnote_drawer_wording_setting_section',
    ];
    const IDS = [
        'WORDING_FOOTNOTES' => 'wording_footnotes',
    ];

    private $options;

    public function __construct()
    {
        add_action('admin_menu', array($this, 'add_plugin_page'));
        add_action('admin_init', array($this, 'page_init'));
        add_filter('plugin_action_links_' . FOOTNOTE_DRAWER_PLUGIN_BASENAME, array($this, 'settings_link'));
    }

    public function settings_link($links)
    {
        $link = sprintf('<a href="%s">%s</a>',
            esc_url(add_query_arg('page', 'footnote-drawer', get_admin_url() . 'options-general.php')),
            __('Settings', FOOTNOTE_DRAWER_TEXT_DOMAIN));
        array_unshift($links, $link);

        return $links;
    }

    public function add_plugin_page()
    {
        add_options_page(
            self::TITLE,
            self::TITLE,
            'manage_options',
            'footnote-drawer',
            array($this, 'create_admin_page')
        );
    }

    public function create_admin_page()
    {
        $this->options = get_option('footnote_drawer_option_name'); ?>

        <div class="wrap">
            <h1>Footnote Drawer</h1>
            <p></p>

            <form method="post" action="options.php">
                <?php
                settings_fields('option_group');
                do_settings_sections(self::PAGE);
                submit_button();
                ?>
            </form>
        </div>
    <?php }

    public function page_init()
    {
        register_setting(
            'option_group',
            'footnote_drawer_option_name',
            array($this, 'sanitize')
        );

        add_settings_section(
            self::SECTIONS['WORDING'],
            __('Change of wording', FOOTNOTE_DRAWER_TEXT_DOMAIN),
            array($this, 'section_info'),
            self::PAGE
        );

        add_settings_field(
            self::IDS['WORDING_FOOTNOTES'],
            __('Footnotes', FOOTNOTE_DRAWER_TEXT_DOMAIN),
            array($this, 'display_textbox_callback'),
            self::PAGE,
            self::SECTIONS['WORDING'],
            array(self::IDS['WORDING_FOOTNOTES'])
        );
    }

    public function sanitize($input)
    {
        $sanitary_values = array();

        foreach (self::IDS as $id) {
            if (isset($input[$id])) {
                $sanitary_values[$id] = $input[$id];
            }
        }
        var_dump($sanitary_values);
        return $sanitary_values;
    }

    public function section_info()
    {

    }

    public function display_textbox_callback($args)
    {
        $id = $args[0];

        $current_value = isset($this->options[$id]) ? $this->options[$id] : '';
        $str = sprintf('<input type="text" name="footnote_drawer_option_name[%s]" id="%s" value="%s" />',
            $id,
            $id,
            $current_value);
        echo $str;
    }
}

if (is_admin()) {
    $fnd = new Footnote_Drawer_Options_Page();
}
