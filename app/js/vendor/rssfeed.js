
var userRssFeed;

$("#submitRssChoice").click(function(event) {
    event.preventDefault();
    userRssFeed = $("#userRssFeed").val();
    var feed = getFeed(userRssFeed);
    $(".rss-feed").append(feed);
});

function getFeed (userRssFeed) {
    var params = {
        rssmikle_url: "https://news.google.com/news/section?q=" + userRssFeed + "&output=rss",
        rssmikle_frame_width: "400", rssmikle_frame_height: "400", frame_height_by_article: "",
        rssmikle_target: "_blank", rssmikle_font: "Arial, Helvetica, sans-serif", rssmikle_font_size: "12",
        rssmikle_border: "off",
        responsive: "off",
        rssmikle_css_url: "rss-feed",
        text_align: "left",
        text_align2: "left",
        corner: "off",
        scrollbar: "on",
        autoscroll: "on",
        scrolldirection: "up",
        scrollstep: "3",
        mcspeed: "20",
        sort: "New",
        rssmikle_title: "off",
        rssmikle_title_sentence: "",
        rssmikle_title_link: "",
        rssmikle_title_bgcolor: "#0066FF",
        rssmikle_title_color: "#FFFFFF",
        rssmikle_title_bgimage: "",
        rssmikle_item_bgcolor: "#FAFAFA",
        rssmikle_item_bgimage: "",
        rssmikle_item_title_length: "55",
        rssmikle_item_title_color: "#FF3636",
        rssmikle_item_border_bottom: "on",
        rssmikle_item_description: "on",
        item_link: "off",
        rssmikle_item_description_length: "150",
        rssmikle_item_description_color: "#666666",
        rssmikle_item_date: "gl1", rssmikle_timezone: "Etc/GMT",
        datetime_format: "%b %e, %Y %l:%M:%S %p",
        item_description_style: "text", item_thumbnail: "full",
        article_num: "15", rssmikle_item_podcast: "off",
        keyword_inc: "",
        keyword_exc: ""
    };
    feedwind_show_widget_iframe(params);
};
