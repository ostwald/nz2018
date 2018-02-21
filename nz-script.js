
$.featherlight.prototype.closeIcon = '<span>CLOSE</span>'

var ALBUM_LIST = [];
$.each(PHOTO_DATA['albums'],function (id, album) {
    ALBUM_LIST.push(album);
});

ALBUM_LIST.sort(function (a, b) {
    var astart = moment(a.start, moment.ISO_8601);
    var bstart = moment(b.start, moment.ISO_8601);
    return (astart.isBefore(bstart) ? -1 : ((astart.isAfter(bstart) ? 1 : 0)))

})

//slog(ALBUM_LIST);

var ALBUM_CLASS = Class.extend ({
    init: function (album_id) {
        this.id = album_id;
        this.data = PHOTO_DATA['albums'][this.id];
        this.start = this.data.start;
        this.end = this.data.end;
        this.items = []
        this.itemMap = []
        this.items_init()
        this.index = this.get_index();
        var name_splits = this.data.name.split(' - ');
        slog (name_splits);
//        this.name = this.data.name;
        this.name = name_splits[1];
        this.number = name_splits[0];
        this.comment = this.data.comment;
    },

    items_init: function () {
        var self = this;
        $(this.data.itemIds).each( function (i, photo_id) {
            var photo = PHOTO_DATA['items'][photo_id]
            self.items.push(photo)
            self.itemMap[photo_id] = photo
        });
    },

    get_album_dates_OFF: function () {
        var start = moment(this.data.start, moment.ISO_8601).format ('M/D/Y')
        var end = moment(this.data.end, moment.ISO_8601).format ('M/D/Y')

        return (start != end ? start + ' - ' + end : end)
    },

    get_index: function () {
        for (var i=0;i<ALBUM_LIST.length;i++) {
            if (ALBUM_LIST[i].id == this.id) {
                return i
            }
        }
        return -1;
    },

    attach_nav: function ($root) {
        var $nav = $('#album-nav')

        var prev = this.index > 0 ? this.index - 1 : null;
        log ('prev: ' + prev)
        var $prev = $t('span')
            .addClass('nav-link')
            .html('prev');
        if (prev != null){
            $prev
                .click (function (event) {
                    window.location = 'index.html?album='+ALBUM_LIST[prev].id;
                })
                .addClass('active')
        } else {
            $prev.addClass('inactive')
        }

        var next = this.index < (ALBUM_LIST.length - 1) ? this.index + 1 : null;
        log ("next: " + next)
        var $next = $t('span')
            .addClass('nav-link')
            .html('next');
        if (next != null) {
            $next
                .click (function (event) {
                    window.location = 'index.html?album='+ALBUM_LIST[next].id;
                })
                .addClass('active')
        } else {
            $next.addClass('inactive')
        }

        $root
            .html($prev)
            .append(' | ')
            .append($next);
    },

    render: function () {
        log ('render_album: ' + album)
        $('#index').hide();
        $('#album').show();
        $('#photo').hide();

        log (this.items.length + " photos found")

        $('#album .name').html(this.name)
        $('#album .dates').html (get_album_dates(this))

        var self = this;
        $('.album-nav').each (function (i, el) {
            self.attach_nav($(el));
        });

        var wrapper = $('#album .thumbnails')

        if (this.id == 243) {
            wrapper.html($t('div')
                .attr('id', 'routeburn')
                .html ($t('img')
                    .attr ('src', 'assets/routeburn.gif')))
        }

        $(this.items).each(function (i, photo) {

            if (photo.filename.indexOf ('.MOV') != -1) {
                log ("skipping " + photo.filename);
                return;
            }


            var photo_id = photo.id;
    //        log (photo.id)
            var m_date = moment(photo.date, moment.ISO_8601)
            var thumb_name = photo.filename.replace('.MOV', '.jpg');
            var thumb_wrapper = $t('div')
                .addClass('thumb-wrapper')
                .html($t('a')
                    .attr('href', '#')
                    .attr('data-featherlight', 'assets/photos/' + photo.filename)
                    .attr('data-featherlight-variant', 'nz-variant')
                    .html($t('img')
                        .addClass('thumbnail')
                        .attr('src', 'assets/thumbnails/' + thumb_name)))
                .append ($t('div')
                    .addClass('comment')
                    .html(photo.comment))
                .append($t('div')
                    .addClass('date')
                    .html(m_date.format('M/D/Y h:m a')))
    /*        if (photo.comment) {
                thumb_wrapper.append($t('div')
                    .addClass('comment')
                    .html(photo.comment))
            }*/
            wrapper.append(thumb_wrapper)
        });

    }

})

function get_album_dates (album) {
    var start = moment(album.start, moment.ISO_8601).format ('M/D/Y')
    var end = moment(album.end, moment.ISO_8601).format ('M/D/Y')

    return (start != end ? start + ' - ' + end : end)
}

function render_album(album_id) {
    var album = new ALBUM_CLASS (album_id);
    album.render();
}

function render_photo(photo) {
    log ('render_photo: ' + photo);
    $('#index').hide();
    $('#album').hide();
    $('#photo').show();
}

function render_index() {
   log ('render_index')
   $('#index').show();
   $('#album').hide();
   $('#photo').hide();

    var wrapper = $('table.albums')
    $(ALBUM_LIST).each(function (i, album) {

        var name_splits = album.name.split(' - ');
        var name = name_splits[1];
        var number = name_splits[0];

        wrapper.append($t('tr')
            .html($t('td')
                .addClass('bullet')
                .html($t('img')
                    .attr ('src', 'assets/numbers/'+number+'.png')))
            .append($t('td')
                .addClass('title')
                .html(name))
            // .append(" - " + get_album_dates(album))
            .click (function (event) {
                window.location = "index.html?album=" + album.id
//                render_album (album.id)
            }));
        if (0 && album.comment) {
            wrapper.append($t('div')
                .addClass('comment')
                .html(album.comment))
        }
    })
}

//log(Object.keys(PHOTO_DATA['items']).length)
//
//$.each(PHOTO_DATA['items'], function (i, album) {
//    slog(album)
//})

